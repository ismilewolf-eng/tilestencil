"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  calculateTilePlan,
  formatMeasurement,
  fromMillimeters,
  getPaperDimensions,
  toMillimeters,
  type MeasurementUnit,
  type PageOrientation,
  type PaperSize,
  type TilePlan,
} from "@/lib/geometry";
import { localizedPath, otherLocale, type Locale } from "@/lib/locale";
import { SiteFooter } from "@/components/SiteFooter";
import { exportTiledPdf, type ExportImage, type RenderMode } from "@/lib/pdf-export";
import { SAMPLE_PRESETS, type SamplePreset } from "@/lib/sample-presets";

type Status =
  | { kind: "progress"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | null;

const supportedTypes = new Set(["image/jpeg", "image/png"]);

function text(locale: Locale, chinese: string, english: string): string {
  return locale === "en" ? english : chinese;
}

function cleanNumber(value: number, maximumFractionDigits = 2): string {
  return Number(value.toFixed(maximumFractionDigits)).toString();
}

function readFileAsDataUrl(file: File, errorMessage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(errorMessage));
    reader.readAsDataURL(file);
  });
}

function readImageDimensions(dataUrl: string, errorMessage: string): Promise<{ widthPx: number; heightPx: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ widthPx: image.naturalWidth, heightPx: image.naturalHeight });
    image.onerror = () => reject(new Error(errorMessage));
    image.src = dataUrl;
  });
}

function getPlanError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function DisplayPlan({ plan, unit, locale }: { plan: TilePlan; unit: MeasurementUnit; locale: Locale }) {
  return (
    <dl className="plan-stats">
      <div>
        <dt>{text(locale, "最终尺寸", "Final size")}</dt>
        <dd>
          {formatMeasurement(plan.targetWidthMm, unit)} × {formatMeasurement(plan.targetHeightMm, unit)}
        </dd>
      </div>
      <div>
        <dt>{text(locale, "纸张方向", "Paper orientation")}</dt>
        <dd>
          {plan.paper.label} · {plan.orientation === "portrait" ? text(locale, "纵向", "Portrait") : text(locale, "横向", "Landscape")}
        </dd>
      </div>
      <div>
        <dt>{text(locale, "可打印区域", "Printable area")}</dt>
        <dd>
          {formatMeasurement(plan.printableWidthMm, unit)} × {formatMeasurement(plan.printableHeightMm, unit)}
        </dd>
      </div>
      <div>
        <dt>{text(locale, "分页结果", "Tiling result")}</dt>
        <dd>
          {locale === "en"
            ? `${plan.columns} columns × ${plan.rows} rows · ${plan.tiles.length} pages`
            : `${plan.columns} 列 × ${plan.rows} 行 · ${plan.tiles.length} 页`}
        </dd>
      </div>
    </dl>
  );
}

function TilePreview({
  image,
  plan,
  locale,
}: {
  image: ExportImage | null;
  plan: TilePlan | null;
  locale: Locale;
}) {
  if (!plan) {
    return (
      <div className="preview-empty">
        <span className="preview-empty-mark" aria-hidden="true">
          +
        </span>
        <p>{text(locale, "填写有效尺寸后，这里会显示分页布局。", "Enter a valid size to see the tiling layout here.")}</p>
      </div>
    );
  }

  const ratio = plan.targetWidthMm / plan.targetHeightMm;
  return (
    <div className="tile-preview-wrap">
      <div className="tile-preview" style={{ aspectRatio: String(ratio) }}>
        {image ? (
          <img src={image.dataUrl} alt={text(locale, `已选择图片：${image.name}`, `Selected image: ${image.name}`)} />
        ) : (
          <div className="preview-placeholder">
            <span>{text(locale, "本地图片预览", "Local image preview")}</span>
          </div>
        )}
        <div
          className="tile-grid"
          aria-label={
            locale === "en"
              ? `Tiling preview with ${plan.rows} rows and ${plan.columns} columns`
              : `${plan.rows} 行 ${plan.columns} 列的分页预览`
          }
        >
          {plan.tiles.map((tile) => (
            <span
              className="tile-cell"
              key={tile.label}
              style={{
                left: `${(tile.xMm / plan.targetWidthMm) * 100}%`,
                top: `${(tile.yMm / plan.targetHeightMm) * 100}%`,
                width: `${(tile.widthMm / plan.targetWidthMm) * 100}%`,
                height: `${(tile.heightMm / plan.targetHeightMm) * 100}%`,
              }}
            >
              {tile.label}
            </span>
          ))}
        </div>
      </div>
      <div className="preview-ruler" aria-hidden="true">
        <span>{text(locale, "起点", "Origin")}</span>
        <span>{text(locale, "末页保留真实边缘尺寸", "Final tiles keep the true remaining edge size")}</span>
      </div>
    </div>
  );
}

export function TileStencilApp({ locale = "zh-CN" }: { locale?: Locale }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<ExportImage | null>(null);
  const [unit, setUnit] = useState<MeasurementUnit>("cm");
  const [widthInput, setWidthInput] = useState("30");
  const [heightInput, setHeightInput] = useState("20");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [paperSize, setPaperSize] = useState<PaperSize>("a4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [marginInput, setMarginInput] = useState("0.8");
  const [overlapInput, setOverlapInput] = useState("0.5");
  const [renderMode, setRenderMode] = useState<RenderMode>("original");
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const alternateLocale = otherLocale(locale);
  const t = (chinese: string, english: string) => text(locale, chinese, english);

  const planResult = useMemo(() => {
    try {
      const plan = calculateTilePlan({
        targetWidthMm: toMillimeters(Number(widthInput), unit),
        targetHeightMm: toMillimeters(Number(heightInput), unit),
        paperSize,
        orientation,
        marginMm: toMillimeters(Number(marginInput), unit),
        overlapMm: toMillimeters(Number(overlapInput), unit),
      });
      return { plan, error: null as string | null };
    } catch (error) {
      return {
        plan: null,
        error: getPlanError(error, t("无法计算分页，请检查尺寸设置。", "Unable to calculate tiles. Check the size settings.")),
      };
    }
  }, [heightInput, locale, marginInput, orientation, overlapInput, paperSize, unit, widthInput]);

  const paper = getPaperDimensions(paperSize, orientation);

  useEffect(() => {
    if (status?.kind !== "success") {
      return undefined;
    }

    const timer = window.setTimeout(() => setStatus(null), 4500);
    return () => window.clearTimeout(timer);
  }, [status]);

  function updateDimension(axis: "width" | "height", nextValue: string): void {
    const numeric = Number(nextValue);
    if (axis === "width") {
      setWidthInput(nextValue);
    } else {
      setHeightInput(nextValue);
    }

    if (!keepAspectRatio || !image || !Number.isFinite(numeric) || numeric <= 0) {
      return;
    }

    const ratio = image.widthPx / image.heightPx;
    if (axis === "width") {
      setHeightInput(cleanNumber(numeric / ratio));
    } else {
      setWidthInput(cleanNumber(numeric * ratio));
    }
  }

  function updateUnit(nextUnit: MeasurementUnit): void {
    if (nextUnit === unit) {
      return;
    }

    const convert = (value: string): string => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        return value;
      }
      return cleanNumber(fromMillimeters(toMillimeters(numeric, unit), nextUnit), 3);
    };

    setWidthInput(convert(widthInput));
    setHeightInput(convert(heightInput));
    setMarginInput(convert(marginInput));
    setOverlapInput(convert(overlapInput));
    setUnit(nextUnit);
  }

  async function acceptImage(file: File | undefined): Promise<void> {
    if (!file) {
      return;
    }

    if (!supportedTypes.has(file.type)) {
      setFileError(t("只支持 JPG 和 PNG 文件。请重新选择图片。", "Only JPG and PNG files are supported. Choose another image."));
      return;
    }

    setFileError(null);
    setStatus(null);
    try {
      const dataUrl = await readFileAsDataUrl(
        file,
        t("无法读取这个文件。请重新选择 JPG 或 PNG。", "This file could not be read. Choose a JPG or PNG again."),
      );
      const dimensions = await readImageDimensions(
        dataUrl,
        t("这个图片无法解码。请换一个 JPG 或 PNG。", "This image could not be decoded. Choose another JPG or PNG."),
      );
      const nextImage = { dataUrl, name: file.name, ...dimensions };
      setImage(nextImage);

      if (keepAspectRatio && Number(widthInput) > 0) {
        setHeightInput(cleanNumber(Number(widthInput) / (dimensions.widthPx / dimensions.heightPx)));
      }
    } catch (error) {
      setImage(null);
      setFileError(getPlanError(error, t("无法读取这个文件。", "This file could not be read.")));
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    void acceptImage(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>): void {
    event.preventDefault();
    setIsDragging(false);
    void acceptImage(event.dataTransfer.files?.[0]);
  }

  function resetImage(): void {
    setImage(null);
    setFileError(null);
    setStatus(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function applyPreset(preset: SamplePreset): void {
    setImage(preset.image);
    const targetWidth = fromMillimeters(preset.widthCm * 10, unit);
    const targetHeight = fromMillimeters(preset.heightCm * 10, unit);
    setWidthInput(cleanNumber(targetWidth));
    setHeightInput(cleanNumber(targetHeight));
    setPaperSize(preset.paperSize);
    setOrientation(preset.orientation);
    setRenderMode(preset.renderMode);
    setFileError(null);
    setStatus(null);
  }

  async function handleExport(): Promise<void> {
    if (!image || !planResult.plan) {
      setStatus({
        kind: "error",
        message: t("先选择图片并修正尺寸设置，再导出 PDF。", "Choose an image and fix the size settings before exporting a PDF."),
      });
      return;
    }

    setIsExporting(true);
    setStatus({ kind: "progress", message: t("正在准备本地 PDF…", "Preparing your local PDF…") });
    try {
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      await exportTiledPdf({
        image,
        plan: planResult.plan,
        mode: renderMode,
        onProgress: (completed, total) => {
          setStatus({
            kind: "progress",
            message: locale === "en" ? `Generating page ${completed}/${total}…` : `正在生成第 ${completed}/${total} 页…`,
          });
        },
      });
      setStatus({
        kind: "success",
        message: t("PDF 已生成，浏览器应已开始下载。", "Your PDF is ready and your browser should have started the download."),
      });
    } catch (error) {
      setStatus({
        kind: "error",
        message: `${getPlanError(error, t("无法生成 PDF。", "Unable to generate the PDF."))} ${t(
          "可以尝试使用较小的源图，或减少一次导出的页数。",
          "Try a smaller source image or export fewer pages at once.",
        )}`,
      });
    } finally {
      setIsExporting(false);
    }
  }

  const renderOptions: Array<{ value: RenderMode; label: string; description: string }> = [
    { value: "original", label: t("原图", "Original"), description: t("保留颜色与细节", "Keep colour and detail") },
    { value: "grayscale", label: t("灰度", "Grayscale"), description: t("用亮度生成单色图", "Use brightness for a monochrome image") },
    {
      value: "template",
      label: t("黑白模板", "Black-and-white template"),
      description: t("高对比，便于描摹与切割", "High contrast for tracing and cutting"),
    },
  ];

  return (
    <div className="site-shell" lang={locale}>
      <a className="skip-link" href="#workspace">
        {t("跳到制作区域", "Skip to workspace")}
      </a>
      <header className="topbar">
        <Link className="brand" href={localizedPath(locale, "home")} aria-label={t("TileStencil 首页", "TileStencil home")}>
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
          </span>
          <span>TileStencil</span>
        </Link>
        <nav aria-label={t("主导航", "Main navigation")}>
          <Link href={localizedPath(locale, "posterGuide")}>{t("分页打印", "Print posters")}</Link>
          <Link href={localizedPath(locale, "stencilGuide")}>{t("模板放大", "Enlarge stencils")}</Link>
          <Link href={localizedPath(locale, "patternGuide")}>{t("纸样打印", "Craft patterns")}</Link>
          <Link href={localizedPath(locale, "bannerGuide")}>{t("横幅大字", "Banner letters")}</Link>
          <Link href={localizedPath(locale, "stainedGlassGuide")}>{t("彩色玻璃", "Stained glass")}</Link>
          <Link href={localizedPath(locale, "scrollSawGuide")}>{t("木工线锯", "Scroll saw")}</Link>
          <Link href={localizedPath(locale, "privacy")}>{t("隐私", "Privacy")}</Link>
          <Link className="language-switch" href={localizedPath(alternateLocale, "home")}>
            {alternateLocale === "en" ? "English" : "中文"}
          </Link>
        </nav>
      </header>

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">LOCAL PRINT WORKBENCH</p>
            <h1 id="page-title">{t("把一张图，准确拼成纸面大图。", "Turn one image into an accurately assembled paper poster.")}</h1>
            <p className="intro-copy">
              {t(
                "导入本地 JPG 或 PNG，按真实尺寸自动分到 A4、A3 或 US Letter。图像只在此浏览器中处理。",
                "Import a local JPG or PNG, set its final size, and tile it across A4, A3, or US Letter. Your image stays in this browser.",
              )}
            </p>
          </div>
          <div className="privacy-note">
            <span className="privacy-lock" aria-hidden="true">⌁</span>
            <div>
              <strong>{t("不上传文件", "No uploads")}</strong>
              <span>{t("读取、处理、PDF 导出都在本地完成。", "Reading, processing, and PDF export all happen locally.")}</span>
            </div>
          </div>
        </section>

        <form
          className="workbench"
          onSubmit={(event) => {
            event.preventDefault();
            void handleExport();
          }}
        >
          <section className="settings-panel" aria-label={t("打印设置", "Print settings")}>
            <section className="settings-section" aria-labelledby="source-heading">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">{t("图片来源", "SOURCE IMAGE")}</p>
                  <h2 id="source-heading">{t("选择一张本地图片", "Choose a local image")}</h2>
                </div>
                {image ? (
                  <button className="text-button" type="button" onClick={resetImage}>
                    {t("移除图片", "Remove image")}
                  </button>
                ) : null}
              </div>

              <div
                className={`upload-zone${isDragging ? " is-dragging" : ""}`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={inputRef}
                  id="image-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="visually-hidden"
                />
                {image ? (
                  <div className="file-summary">
                    <img src={image.dataUrl} alt={t("所选图片缩略图", "Selected image thumbnail")} width="72" height="72" />
                    <div>
                      <strong title={image.name}>{image.name}</strong>
                      <span>
                        {image.widthPx.toLocaleString(locale === "en" ? "en-US" : "zh-CN")} × {image.heightPx.toLocaleString(locale === "en" ? "en-US" : "zh-CN")} px
                      </span>
                    </div>
                    <label className="secondary-button" htmlFor="image-upload">
                      {t("更换", "Replace")}
                    </label>
                  </div>
                ) : (
                  <label className="upload-prompt" htmlFor="image-upload">
                    <span className="upload-glyph" aria-hidden="true">↑</span>
                    <span>
                      <strong>{t("选择 JPG 或 PNG", "Choose a JPG or PNG")}</strong>
                      <small>{t("也可以直接拖进这里", "You can also drag one here")}</small>
                    </span>
                  </label>
                )}
              </div>
              {!image ? (
                <div className="preset-bar">
                  <span className="preset-bar-label">{t("没有现成图片？试试示例：", "No image? Try a sample:")}</span>
                  <div className="preset-buttons">
                    {SAMPLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className="preset-pill"
                        onClick={() => applyPreset(preset)}
                      >
                        {locale === "en" ? preset.label.en : preset.label.zh}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {fileError ? <p className="field-error" role="alert">{fileError}</p> : null}
            </section>

            <section className="settings-section" aria-labelledby="size-heading">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">{t("最终成品", "FINAL OUTPUT")}</p>
                  <h2 id="size-heading">{t("真实尺寸", "Real-world size")}</h2>
                </div>
                <div className="unit-switch" aria-label={t("尺寸单位", "Measurement unit")}>
                  <button className={"is-selected".repeat(unit === "cm" ? 1 : 0) || undefined} type="button" aria-pressed={unit === "cm"} onClick={() => updateUnit("cm")}>
                    cm
                  </button>
                  <button className={"is-selected".repeat(unit === "in" ? 1 : 0) || undefined} type="button" aria-pressed={unit === "in"} onClick={() => updateUnit("in")}>
                    in
                  </button>
                </div>
              </div>

              <div className="input-grid two-up">
                <label>
                  <span>{t("宽度", "Width")}</span>
                  <div className="number-control">
                    <input type="number" min="0.1" step="any" inputMode="decimal" value={widthInput} onChange={(event) => updateDimension("width", event.target.value)} />
                    <em>{unit}</em>
                  </div>
                </label>
                <label>
                  <span>{t("高度", "Height")}</span>
                  <div className="number-control">
                    <input type="number" min="0.1" step="any" inputMode="decimal" value={heightInput} onChange={(event) => updateDimension("height", event.target.value)} />
                    <em>{unit}</em>
                  </div>
                </label>
              </div>
              <label className="check-control">
                <input type="checkbox" checked={keepAspectRatio} onChange={(event) => setKeepAspectRatio(event.target.checked)} />
                <span>{t("修改一边时保持原图比例", "Keep the original image ratio when changing one side")}</span>
              </label>
            </section>

            <section className="settings-section" aria-labelledby="paper-heading">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">{t("纸张", "PAPER")}</p>
                  <h2 id="paper-heading">{t("页面与边距", "Paper and margins")}</h2>
                </div>
              </div>

              <div className="input-grid two-up">
                <label>
                  <span>{t("纸张规格", "Paper size")}</span>
                  <select value={paperSize} onChange={(event) => setPaperSize(event.target.value as PaperSize)}>
                    <option value="a4">A4 · 210 × 297 mm</option>
                    <option value="a3">A3 · 297 × 420 mm</option>
                    <option value="letter">US Letter · 8.5 × 11 in</option>
                  </select>
                </label>
                <fieldset className="radio-fieldset">
                  <legend>{t("方向", "Orientation")}</legend>
                  <div className="segmented-control">
                    <label>
                      <input type="radio" name="orientation" value="portrait" checked={orientation === "portrait"} onChange={() => setOrientation("portrait")} />
                      <span>{t("纵向", "Portrait")}</span>
                    </label>
                    <label>
                      <input type="radio" name="orientation" value="landscape" checked={orientation === "landscape"} onChange={() => setOrientation("landscape")} />
                      <span>{t("横向", "Landscape")}</span>
                    </label>
                  </div>
                </fieldset>
              </div>

              <div className="input-grid two-up parameter-grid">
                <label>
                  <span>{t("打印边距", "Print margins")}</span>
                  <div className="number-control">
                    <input type="number" min={unit === "cm" ? "0.5" : "0.2"} step="any" inputMode="decimal" value={marginInput} onChange={(event) => setMarginInput(event.target.value)} />
                    <em>{unit}</em>
                  </div>
                  <small>{t("四边使用相同值；至少 5 mm。", "The same value is used on all sides; at least 5 mm.")}</small>
                </label>
                <label>
                  <span>{t("拼接重叠", "Tile overlap")}</span>
                  <div className="number-control">
                    <input type="number" min="0" step="any" inputMode="decimal" value={overlapInput} onChange={(event) => setOverlapInput(event.target.value)} />
                    <em>{unit}</em>
                  </div>
                  <small>{t("相邻页共有的图像区域。", "The image area shared by adjacent pages.")}</small>
                </label>
              </div>
              <p className="paper-footnote">
                {locale === "en" ? "Current paper:" : "当前纸张："} {cleanNumber(paper.widthMm)} × {cleanNumber(paper.heightMm)} mm{locale === "en" ? "." : "。"}
              </p>
            </section>

            <section className="settings-section" aria-labelledby="render-heading">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">{t("图像效果", "IMAGE EFFECT")}</p>
                  <h2 id="render-heading">{t("导出样式", "Export style")}</h2>
                </div>
              </div>
              <div className="render-options">
                {renderOptions.map(({ value, label, description }) => (
                  <label className={renderMode === value ? "render-option is-selected" : "render-option"} key={value}>
                    <input type="radio" name="render-mode" value={value} checked={renderMode === value} onChange={() => setRenderMode(value)} />
                    <span>
                      <strong>{label}</strong>
                      <small>{description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </section>

          <aside className="output-panel" aria-label={t("分页预览与导出", "Tiling preview and export")}>
            <div className="output-card">
              <div className="output-heading">
                <div>
                  <p className="section-kicker">{t("分页预览", "TILING PREVIEW")}</p>
                  <h2>{t("这会是你的拼接顺序", "This will be your assembly order")}</h2>
                </div>
                {planResult.plan ? <span className="page-badge">{locale === "en" ? `${planResult.plan.tiles.length} pages` : `${planResult.plan.tiles.length} 页`}</span> : null}
              </div>
              <TilePreview image={image} plan={planResult.plan} locale={locale} />
              {planResult.plan ? <DisplayPlan plan={planResult.plan} unit={unit} locale={locale} /> : null}
              {planResult.error ? <p className="field-error plan-error" role="alert">{planResult.error}</p> : null}
            </div>

            <div className="export-card">
              <div className="print-note">
                <svg className="print-note-badge" width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
                  <circle cx="21" cy="21" r="19.5" className="print-badge-circle" />
                  <text x="21" y="21" textAnchor="middle" dominantBaseline="central" className="print-badge-text">
                    100%
                  </text>
                </svg>
                <p>
                  <strong>{t("打印时请选择 Actual Size / 100%", "Print at Actual Size / 100%")}</strong>
                  <span>{t("不要使用“适合页面”或自动缩放。", "Do not use Fit to Page or automatic scaling.")}</span>
                </p>
              </div>
              <ul className="export-includes">
                <li>{t("页码与网格编号", "Page numbers and grid labels")}</li>
                <li>{t("裁切/拼接定位标记", "Trim and assembly marks")}</li>
                <li>{t("相邻页重叠提示", "Adjacent-page overlap guidance")}</li>
              </ul>
              <button className="primary-button export-button" type="submit" disabled={!image || !planResult.plan || isExporting}>
                {isExporting ? t("正在生成 PDF…", "Generating PDF…") : t("导出拼接 PDF", "Export tiled PDF")}
              </button>
              {!image ? <p className="button-help">{t("选择一张图片后即可导出。", "Choose an image to enable export.")}</p> : null}
              {status ? (
                <p className={status.kind === "error" ? "status-message is-error" : (status.kind === "success" ? "status-message is-success" : "status-message is-progress")} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
                  {status.message}
                </p>
              ) : null}
            </div>
          </aside>
        </form>

        <section className="guides-hub" aria-labelledby="guides-hub-heading">
          <div className="guides-hub-header">
            <p className="section-kicker">{t("探索场景", "PRINTING USE CASES")}</p>
            <h2 id="guides-hub-heading">{t("常用打印场景与操作指南", "Printable Project Guides & Tutorials")}</h2>
            <p className="guides-hub-desc">
              {t(
                "TileStencil 支持针对各类专业场景输出 100% 物理真实尺寸的多页 PDF。探索针对不同工艺与用途的最佳实践：",
                "TileStencil outputs 100% actual-size multi-page PDFs for craft and large-format printing. Explore guides tailored to your project:",
              )}
            </p>
          </div>
          <div className="guides-hub-grid">
            <Link className="guide-card" href={localizedPath(locale, "posterGuide")}>
              <span className="guide-card-icon" aria-hidden="true">🖼️</span>
              <h3>{t("大图分页打印海报", "Multi-Page Poster Printing")}</h3>
              <p>{t("将高分辨率照片无损拆切为多张 A4/A3 拼接海报，支持自定义重叠与边距。", "Split high-resolution photos across standard A4/A3 sheets for giant wall posters.")}</p>
              <span className="guide-card-cta">{t("查看海报教程 →", "Read poster guide →")}</span>
            </Link>
            <Link className="guide-card" href={localizedPath(locale, "stencilGuide")}>
              <span className="guide-card-icon" aria-hidden="true">🎨</span>
              <h3>{t("墙绘与描摹模板放大", "Wall Stencils & Murals")}</h3>
              <p>{t("一键转为高对比度黑白线条，方便投影、复写纸描摹与艺术喷涂。", "Generate crisp high-contrast monochrome contours for mural transfers and tracing.")}</p>
              <span className="guide-card-cta">{t("查看墙绘教程 →", "Read mural guide →")}</span>
            </Link>
            <Link className="guide-card" href={localizedPath(locale, "patternGuide")}>
              <span className="guide-card-icon" aria-hidden="true">📐</span>
              <h3>{t("手工皮具与缝纫纸样 1:1 打印", "1:1 Craft & Sewing Patterns")}</h3>
              <p>{t("严格保留物理毫米精度，杜绝缩放形变，皮具木工开料不出错。", "Preserve exact physical mm scale for leathercraft, sewing blocks, and Cosplay.")}</p>
              <span className="guide-card-cta">{t("查看纸样教程 →", "Read pattern guide →")}</span>
            </Link>
            <Link className="guide-card" href={localizedPath(locale, "bannerGuide")}>
              <span className="guide-card-icon" aria-hidden="true">🏷️</span>
              <h3>{t("派对大字与活动长横幅", "Event Signs & Large Banners")}</h3>
              <p>{t("横向 A4 快速拼接数米长大字标语与节日条幅，排版省纸更平整。", "Tile multi-meter slogan banners horizontally across standard printer paper.")}</p>
              <span className="guide-card-cta">{t("查看横幅教程 →", "Read banner guide →")}</span>
            </Link>
            <Link className="guide-card" href={localizedPath(locale, "stainedGlassGuide")}>
              <span className="guide-card-icon" aria-hidden="true">🪟</span>
              <h3>{t("彩色玻璃与马赛克拼花纸样", "Stained Glass Patterns")}</h3>
              <p>{t("精准配合铅条和铜箔框架的 100% 比例线稿输出，十字对齐不跑位。", "Output 100% actual size line art tailored for foil and came assembly.")}</p>
              <span className="guide-card-cta">{t("查看玻璃教程 →", "Read stained glass guide →")}</span>
            </Link>
            <Link className="guide-card" href={localizedPath(locale, "scrollSawGuide")}>
              <span className="guide-card-icon" aria-hidden="true">🪵</span>
              <h3>{t("木工线锯与镂铣图纸等比打印", "Scroll Saw Woodworking")}</h3>
              <p>{t("直接贴在木料表面进行无形变曲线切割与雕刻，省墨下刀轮廓分明。", "Full-scale adhesive templates for precision scroll sawing and router engraving.")}</p>
              <span className="guide-card-cta">{t("查看木工教程 →", "Read scroll saw guide →")}</span>
            </Link>
            <Link className="guide-card" href={localizedPath(locale, "rasterbatorAlternative")}>
              <span className="guide-card-icon" aria-hidden="true">⚡</span>
              <h3>{t("The Rasterbator 高清替代", "The Rasterbator Alternative")}</h3>
              <p>{t("无波点网格与像素化杂点，保留原图高清细节，1:1 毫米级厘米尺寸物理切片。", "Tile print large posters with original clarity and zero halftone dot pixelation.")}</p>
              <span className="guide-card-cta">{t("查看对比说明 →", "Read comparison →")}</span>
            </Link>
            <Link className="guide-card" href={localizedPath(locale, "acrobatAlternative")}>
              <span className="guide-card-icon" aria-hidden="true">🖨️</span>
              <h3>{t("免 Adobe Acrobat 多页打印", "Print Without Adobe Acrobat")}</h3>
              <p>{t("告别昂贵订阅与复杂打印设置，在浏览器免费生成带对齐重叠线的多页 PDF。", "Free visual multi-sheet tiling without paying for Adobe Acrobat Pro.")}</p>
              <span className="guide-card-cta">{t("查看免费指南 →", "Read free guide →")}</span>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
