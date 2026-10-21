"use client";

import type { ChangeEvent, DragEvent, ReactNode } from "react";
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
import { hasPage, localDecimal, LOCALE_TAG, localizedPath, tr, type Locale, type SiteRoute } from "@/lib/locale";
import { LetterStencilSource } from "@/components/LetterStencilSource";
import { loadSvgPaymentConfig, SvgPaywall, type SvgPaymentConfig } from "@/components/SvgPaywall";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { cleanupStencil, findIslands } from "@/lib/stencil-bridges";
import { stencilSvg, traceMask } from "@/lib/stencil-svg";
import {
  applyRenderMode,
  DEFAULT_STENCIL,
  exportTiledPdf,
  stencilValue,
  type ExportImage,
  type RenderMode,
} from "@/lib/pdf-export";
import { SAMPLE_PRESETS, type SamplePreset } from "@/lib/sample-presets";

type Status =
  | { kind: "progress"; message: string }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }
  | null;

const supportedTypes = new Set(["image/jpeg", "image/png"]);

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
        <dt>{tr(locale, "最终尺寸", "Final size")}</dt>
        <dd>
          {localDecimal(locale, formatMeasurement(plan.targetWidthMm, unit))} × {localDecimal(locale, formatMeasurement(plan.targetHeightMm, unit))}
        </dd>
      </div>
      <div>
        <dt>{tr(locale, "纸张方向", "Paper orientation")}</dt>
        <dd>
          {plan.paper.label} · {plan.orientation === "portrait" ? tr(locale, "纵向", "Portrait") : tr(locale, "横向", "Landscape")}
        </dd>
      </div>
      <div>
        <dt>{tr(locale, "可打印区域", "Printable area")}</dt>
        <dd>
          {localDecimal(locale, formatMeasurement(plan.printableWidthMm, unit))} × {localDecimal(locale, formatMeasurement(plan.printableHeightMm, unit))}
        </dd>
      </div>
      <div>
        <dt>{tr(locale, "分页结果", "Tiling result")}</dt>
        <dd>
          {tr(locale, "{c} 列 × {r} 行 · {n} 页", "{c} columns × {r} rows · {n} pages", {
            c: plan.columns,
            r: plan.rows,
            n: plan.tiles.length,
          })}
        </dd>
      </div>
    </dl>
  );
}

function TilePreview({
  image,
  displayUrl,
  plan,
  locale,
}: {
  image: ExportImage | null;
  displayUrl: string | null;
  plan: TilePlan | null;
  locale: Locale;
}) {
  if (!plan) {
    return (
      <div className="preview-empty">
        <span className="preview-empty-mark" aria-hidden="true">
          +
        </span>
        <p>{tr(locale, "填写有效尺寸后，这里会显示分页布局。", "Enter a valid size to see the tiling layout here.")}</p>
      </div>
    );
  }

  const ratio = plan.targetWidthMm / plan.targetHeightMm;
  return (
    <div className="tile-preview-wrap">
      <div className="tile-preview" style={{ aspectRatio: String(ratio) }}>
        {image ? (
          <img src={displayUrl ?? image.dataUrl} alt={tr(locale, "已选择图片：{name}", "Selected image: {name}", { name: image.name })} />
        ) : (
          <div className="preview-placeholder">
            <span>{tr(locale, "本地图片预览", "Local image preview")}</span>
          </div>
        )}
        <div
          className="tile-grid"
          aria-label={tr(locale, "{r} 行 {c} 列的分页预览", "Tiling preview with {r} rows and {c} columns", {
            r: plan.rows,
            c: plan.columns,
          })}
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
        <span>{tr(locale, "起点", "Origin")}</span>
        <span>{tr(locale, "末页保留真实边缘尺寸", "Final tiles keep the true remaining edge size")}</span>
      </div>
    </div>
  );
}

export type AppIntro = {
  eyebrow: string;
  heading: string;
  copy: string;
};

export type AppDefaults = {
  renderMode?: RenderMode;
  widthCm?: number;
  heightCm?: number;
  /** Start with automatic stencil bridges on (cut-out stencil pages). */
  bridges?: boolean;
  /** Initial bridge width in mm (default 2). */
  bridgeMm?: number;
  /** Initial paper (default A4); Mexico and most of Latin America print on Letter ("tamaño carta"). */
  paperSize?: PaperSize;
};

type HubCard = { route: SiteRoute; icon: string; title: [string, string]; body: [string, string]; cta: [string, string] };

const HUB_CARDS: HubCard[] = [
  { route: "photoToStencil", icon: "✂️", title: ["照片转镂空模板", "Photo to Stencil Maker"], body: ["把照片变成可调黑白分界的镂空模板，按真实尺寸分页打印。", "Turn any photo into an adjustable black-and-white stencil and print it at actual size."], cta: ["开始制作 →", "Make a stencil →"] },
  { route: "pumpkinStencil", icon: "🎃", title: ["南瓜雕刻模板生成器", "Pumpkin Stencil Maker"], body: ["用任意照片做万圣节南瓜雕刻模板，按南瓜实际大小打印。", "Make a custom pumpkin carving stencil from any photo, sized to your pumpkin."], cta: ["制作南瓜模板 →", "Make a pumpkin stencil →"] },
  { route: "cricutStencil", icon: "✂️", title: ["Cricut 刻字机模板", "Cricut Stencil Maker"], body: ["照片转可切割 SVG，自带连接桥，按毫米标注尺寸。", "Photo to cut-ready SVG with bridges, sized for Cricut and laser cutters."], cta: ["制作 SVG 模板 →", "Make an SVG stencil →"] },
  { route: "sprayPaintStencil", icon: "🎨", title: ["喷漆模板", "Spray Paint Stencil Maker"], body: ["照片或标志做成喷漆模板，含双层模板做法。", "Photo or logo to a spray paint stencil, including two-layer stencils."], cta: ["制作喷漆模板 →", "Make a spray paint stencil →"] },
  { route: "woodBurningStencil", icon: "🔥", title: ["烙画图样", "Wood Burning Stencil Maker"], body: ["照片转烙画轮廓，按木板大小打印，附转印方法。", "Photo to pyrography outlines at the size of your board, with transfer methods."], cta: ["制作烙画图样 →", "Make a wood burning pattern →"] },
  { route: "airbrushStencil", icon: "💨", title: ["喷笔模板", "Airbrush Stencil Maker"], body: ["一键切换正片和负片，做喷笔模板和遮罩。", "Positive and negative airbrush stencils and masks from any image."], cta: ["制作喷笔模板 →", "Make an airbrush stencil →"] },
  { route: "halloweenStencils", icon: "🎃", title: ["免费万圣节模板", "Free Halloween Stencils"], body: ["南瓜脸、蝙蝠、骷髅、蜘蛛网等，已加连接桥，免费下载 PDF。", "Pumpkin faces, bats, skulls, spider webs and more, with bridges. Free PDF downloads."], cta: ["下载免费模板 →", "Get free stencils →"] },
  { route: "christmasStencils", icon: "❄️", title: ["免费圣诞模板", "Free Christmas Stencils"], body: ["雪花、星星、圣诞树、驯鹿等，已加连接桥，免费下载 PDF。", "Snowflakes, stars, trees, reindeer and more, with bridges. Free PDF downloads."], cta: ["下载免费模板 →", "Get free stencils →"] },
  { route: "flowerStencils", icon: "🌼", title: ["免费花朵模板", "Free Flower Stencils"], body: ["雏菊、玫瑰、蝴蝶、叶子等，已加连接桥，免费下载 PDF。", "Daisies, roses, butterflies, leaves and more, with bridges. Free PDF downloads."], cta: ["下载免费模板 →", "Get free stencils →"] },
  { route: "animalStencils", icon: "🐾", title: ["免费动物模板", "Free Animal Stencils"], body: ["狗、猫、狼、马、独角兽、恐龙等，已加连接桥，免费下载 PDF。", "Dogs, cats, wolves, horses, unicorns, dinosaurs and more. Free PDF downloads."], cta: ["下载免费模板 →", "Get free stencils →"] },
  { route: "letterStencils", icon: "🔠", title: ["字母模板生成器", "Letter Stencil Generator"], body: ["输入文字，生成任意大小的镂空字母和数字，分页打印。", "Type any word and print stencil letters or numbers at any size across pages."], cta: ["生成字母模板 →", "Make letter stencils →"] },
  { route: "tattooStencil", icon: "🖋️", title: ["纹身转印模板", "Tattoo Stencil Maker"], body: ["把图案转成清晰线稿，按身体部位的真实尺寸打印。", "Turn a design into a clean stencil and print it at the exact size for the placement."], cta: ["制作纹身模板 →", "Make a tattoo stencil →"] },
  { route: "gridDrawing", icon: "▦", title: ["网格画法工具", "Drawing Grid Maker"], body: ["给参考照片加上编号方格，算好画布上每格画多大。", "Add numbered squares to a reference photo and get the matching grid for your canvas or wall."], cta: ["打开网格工具 →", "Make a drawing grid →"] },
  { route: "posterGuide", icon: "🖼️", title: ["大图分页打印海报", "Multi-Page Poster Printing"], body: ["将高分辨率照片无损拆切为多张 A4/A3 拼接海报，支持自定义重叠与边距。", "Split high-resolution photos across standard A4/A3 sheets for giant wall posters."], cta: ["查看海报教程 →", "Read poster guide →"] },
  { route: "stencilGuide", icon: "🎨", title: ["墙绘与描摹模板放大", "Wall Stencils & Murals"], body: ["一键转为高对比度黑白线条，方便投影、复写纸描摹与艺术喷涂。", "Generate crisp high-contrast monochrome contours for mural transfers and tracing."], cta: ["查看墙绘教程 →", "Read mural guide →"] },
  { route: "patternGuide", icon: "📐", title: ["手工皮具与缝纫纸样 1:1 打印", "1:1 Craft & Sewing Patterns"], body: ["严格保留物理毫米精度，杜绝缩放形变，皮具木工开料不出错。", "Preserve exact physical mm scale for leathercraft, sewing blocks, and Cosplay."], cta: ["查看纸样教程 →", "Read pattern guide →"] },
  { route: "bannerGuide", icon: "🏷️", title: ["派对大字与活动长横幅", "Event Signs & Large Banners"], body: ["横向 A4 快速拼接数米长大字标语与节日条幅，排版省纸更平整。", "Tile multi-meter slogan banners horizontally across standard printer paper."], cta: ["查看横幅教程 →", "Read banner guide →"] },
  { route: "stainedGlassGuide", icon: "🪟", title: ["彩色玻璃与马赛克拼花纸样", "Stained Glass Patterns"], body: ["精准配合铅条和铜箔框架的 100% 比例线稿输出，十字对齐不跑位。", "Output 100% actual size line art tailored for foil and came assembly."], cta: ["查看玻璃教程 →", "Read stained glass guide →"] },
  { route: "scrollSawGuide", icon: "🪵", title: ["木工线锯与镂铣图纸等比打印", "Scroll Saw Woodworking"], body: ["直接贴在木料表面进行无形变曲线切割与雕刻，省墨下刀轮廓分明。", "Full-scale adhesive templates for precision scroll sawing and router engraving."], cta: ["查看木工教程 →", "Read scroll saw guide →"] },
  { route: "rasterbatorAlternative", icon: "⚡", title: ["The Rasterbator 高清替代", "The Rasterbator Alternative"], body: ["无波点网格与像素化杂点，保留原图高清细节，1:1 毫米级厘米尺寸物理切片。", "Tile print large posters with original clarity and zero halftone dot pixelation."], cta: ["查看对比说明 →", "Read comparison →"] },
  { route: "acrobatAlternative", icon: "🖨️", title: ["免 Adobe Acrobat 多页打印", "Print Without Adobe Acrobat"], body: ["告别昂贵订阅与复杂打印设置，在浏览器免费生成带对齐重叠线的多页 PDF。", "Free visual multi-sheet tiling without paying for Adobe Acrobat Pro."], cta: ["查看免费指南 →", "Read free guide →"] },
  { route: "blockpostersAlternative", icon: "🖼️", title: ["Blockposters 免费替代", "Blockposters Alternative"], body: ["无页数限制与水印，免费将大图切片为多张 A4/A3 纸打印。", "Free multi-page poster tiling with zero watermarks and no 7-page limit."], cta: ["查看替代说明 →", "Read alternative guide →"] },
  { route: "a0SewingGuide", icon: "🧵", title: ["A0 服装纸样打印为 A4", "Print A0 Patterns on A4"], body: ["100% 实际大小切片打印 Etsy 电子纸样，带 10x10cm 校准方块。", "Tile large A0 sewing and cosplay patterns at 100% scale on home printers."], cta: ["查看纸样打印 →", "Read sewing guide →"] },
];

const PREVIEW_MAX_PX = 900;
/** Working resolution for stencil cleanup; also the resolution of a bridged export. */
const STENCIL_WORK_PX = 1800;
/** Cut-out details smaller than this (in mm) are removed as uncuttable specks. */
const SPECK_MM = 1.5;
/** White islands smaller than this (in mm) are filled rather than bridged (photo texture). */
const MIN_ISLAND_MM = 3;

type StencilBuild = {
  /** Shown on screen; islands tinted red when bridges are off. */
  previewUrl: string;
  /** Present only when bridges are on: the cleaned stencil used for export. */
  exportImage: ExportImage | null;
  islands: number;
  bridged: number;
  unbridged: number;
  specksRemoved: number;
  /** The final black-and-white mask (1 = black, cut away), kept for SVG export. */
  mask: Uint8Array;
  maskWidth: number;
  maskHeight: number;
};

function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("stencil"));
    element.src = dataUrl;
  });
}

/** Threshold the image, then either bridge islands or tint them red so they are visible. */
async function buildStencil(
  image: ExportImage,
  threshold: number,
  invert: boolean,
  targetWidthMm: number,
  bridgeMm: number | null,
): Promise<StencilBuild> {
  const source = await loadImageElement(image.dataUrl);
  const scale = Math.min(1, STENCIL_WORK_PX / Math.max(image.widthPx, image.heightPx));
  const width = Math.max(1, Math.round(image.widthPx * scale));
  const height = Math.max(1, Math.round(image.heightPx * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("stencil");
  context.drawImage(source, 0, 0, width, height);

  const pixels = context.getImageData(0, 0, width, height);
  const mask = new Uint8Array(width * height);
  for (let i = 0, o = 0; i < mask.length; i++, o += 4) {
    const luminance = Math.round(pixels.data[o] * 0.2126 + pixels.data[o + 1] * 0.7152 + pixels.data[o + 2] * 0.0722);
    mask[i] = stencilValue(luminance, { threshold, invert }) === 0 ? 1 : 0;
  }

  const pxPerMm = width / Math.max(1, targetWidthMm);
  let finalMask: Uint8Array = mask;
  let islandLabels: Int32Array | null = null;
  let islandIds: number[] = [];
  let bridged = 0;
  let unbridged = 0;
  let specksRemoved = 0;
  let islands: number;
  if (bridgeMm !== null) {
    const result = cleanupStencil(mask, width, height, {
      bridgePx: Math.max(1, Math.round(bridgeMm * pxPerMm)),
      minAreaPx: Math.round((SPECK_MM * pxPerMm) ** 2),
      minIslandPx: Math.round((MIN_ISLAND_MM * pxPerMm) ** 2),
    });
    finalMask = result.mask;
    islands = result.islands;
    bridged = result.bridged;
    unbridged = result.unbridged;
    specksRemoved = result.specksRemoved;
  } else {
    const found = findIslands(mask, width, height);
    islandLabels = found.labels;
    islandIds = found.islandIds;
    islands = islandIds.length;
  }

  const isIsland = new Set(islandIds);
  for (let i = 0, o = 0; i < finalMask.length; i++, o += 4) {
    const red = islandLabels !== null && islandLabels[i] !== 0 && isIsland.has(islandLabels[i]);
    const value = finalMask[i] === 1 ? 0 : 255;
    pixels.data[o] = red ? 230 : value;
    pixels.data[o + 1] = red ? 60 : value;
    pixels.data[o + 2] = red ? 40 : value;
    pixels.data[o + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  const dataUrl = canvas.toDataURL("image/png");
  return {
    previewUrl: dataUrl,
    exportImage: bridgeMm !== null ? { dataUrl, widthPx: width, heightPx: height, name: image.name } : null,
    mask: finalMask,
    maskWidth: width,
    maskHeight: height,
    islands,
    bridged,
    unbridged,
    specksRemoved,
  };
}

/** Downscaled copy of the image with the export effect applied, for the on-screen preview only. */
async function renderPreview(
  image: ExportImage,
  mode: RenderMode,
  threshold: number,
  invert: boolean,
): Promise<string> {
  const source = new Image();
  await new Promise<void>((resolve, reject) => {
    source.onload = () => resolve();
    source.onerror = () => reject(new Error("preview"));
    source.src = image.dataUrl;
  });
  const scale = Math.min(1, PREVIEW_MAX_PX / Math.max(image.widthPx, image.heightPx));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.widthPx * scale));
  canvas.height = Math.max(1, Math.round(image.heightPx * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("preview");
  }
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  applyRenderMode(context, mode, { threshold, invert });
  return canvas.toDataURL("image/png");
}

function stencilReport(build: StencilBuild, bridgesOn: boolean, locale: Locale): string {
  if (locale === "pt-BR" || locale === "es") return stencilReportLocal(build, bridgesOn, locale);
  const en = locale === "en";
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
  if (bridgesOn) {
    if (build.unbridged > 0) {
      return en
        ? `Added ${plural(build.bridged, "bridge")}, but ${plural(build.unbridged, "piece")} still could fall out. The background is too busy: move the threshold, or crop to the subject.`
        : `已加 ${build.bridged} 条连接桥，但还有 ${build.unbridged} 块可能会掉。背景太杂了：调一下阈值，或者把照片裁到只剩主体。`;
    }
    if (build.bridged === 0 && build.specksRemoved === 0) {
      return en ? "Nothing will fall out. Ready to cut." : "没有会掉下来的部分，可以直接刻。";
    }
    return en
      ? `Added ${plural(build.bridged, "bridge")} and removed ${plural(build.specksRemoved, "speck")} too small to cut.`
      : `已加 ${build.bridged} 条连接桥，清除 ${build.specksRemoved} 个刻不出来的碎点。`;
  }
  if (build.islands === 0) {
    return en ? "Nothing will fall out when cut." : "没有会掉下来的部分。";
  }
  return en
    ? `${plural(build.islands, "piece")} (red) will fall out when cut. Turn on bridges to keep them.`
    : `有 ${build.islands} 块（红色）刻完会掉下来。打开连接桥即可保住。`;
}

function stencilReportLocal(build: StencilBuild, bridgesOn: boolean, locale: "pt-BR" | "es"): string {
  const pt = locale === "pt-BR";
  const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
  const bridges = (n: number) => (pt ? count(n, "ponte", "pontes") : count(n, "puente", "puentes"));
  const pieces = (n: number) => (pt ? count(n, "pedaço", "pedaços") : count(n, "pieza", "piezas"));
  const specks = (n: number) => (pt ? count(n, "pontinho", "pontinhos") : count(n, "puntito", "puntitos"));
  if (bridgesOn) {
    if (build.unbridged > 0) {
      return pt
        ? `Adicionamos ${bridges(build.bridged)}, mas ${pieces(build.unbridged)} ainda pode${build.unbridged === 1 ? "" : "m"} cair. O fundo está muito carregado: mexa no limite ou recorte a foto só no tema principal.`
        : `Agregamos ${bridges(build.bridged)}, pero ${pieces(build.unbridged)} todavía se puede${build.unbridged === 1 ? "" : "n"} caer. El fondo tiene demasiado detalle: mueve el umbral o recorta la foto al motivo principal.`;
    }
    if (build.bridged === 0 && build.specksRemoved === 0) {
      return pt ? "Nenhuma parte vai cair. Pronto para cortar." : "No se va a caer ninguna parte. Listo para cortar.";
    }
    return pt
      ? `Adicionamos ${bridges(build.bridged)} e tiramos ${specks(build.specksRemoved)} pequenos demais para cortar.`
      : `Agregamos ${bridges(build.bridged)} y quitamos ${specks(build.specksRemoved)} demasiado pequeños para cortar.`;
  }
  if (build.islands === 0) {
    return pt ? "Nenhuma parte vai cair ao cortar." : "No se va a caer ninguna parte al cortar.";
  }
  return pt
    ? `${pieces(build.islands)} (em vermelho) ${build.islands === 1 ? "vai" : "vão"} cair ao cortar. Ative as pontes para segurar.`
    : `${pieces(build.islands)} (en rojo) se caerá${build.islands === 1 ? "" : "n"} al cortar. Activa los puentes para sostenerlas.`;
}

export function TileStencilApp({
  locale = "zh-CN",
  intro,
  defaults,
  source = "image",
  route = "home",
  children,
}: {
  locale?: Locale;
  /** This page, so the language switch links to the same page in the other languages. */
  route?: SiteRoute;
  intro?: AppIntro;
  defaults?: AppDefaults;
  /** "text" swaps the photo upload for the stencil lettering generator. */
  source?: "image" | "text";
  children?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<ExportImage | null>(null);
  const [unit, setUnit] = useState<MeasurementUnit>("cm");
  const [widthInput, setWidthInput] = useState(String(defaults?.widthCm ?? 30));
  const [heightInput, setHeightInput] = useState(String(defaults?.heightCm ?? 20));
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [paperSize, setPaperSize] = useState<PaperSize>(defaults?.paperSize ?? "a4");
  const [orientation, setOrientation] = useState<PageOrientation>("portrait");
  const [marginInput, setMarginInput] = useState("0.8");
  const [overlapInput, setOverlapInput] = useState("0.5");
  const [renderMode, setRenderMode] = useState<RenderMode>(defaults?.renderMode ?? "original");
  const [threshold, setThreshold] = useState(DEFAULT_STENCIL.threshold);
  const [invert, setInvert] = useState(DEFAULT_STENCIL.invert);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [bridgesOn, setBridgesOn] = useState(defaults?.bridges ?? false);
  const [bridgeMm, setBridgeMm] = useState(defaults?.bridgeMm ?? 2);
  const [stencilBuild, setStencilBuild] = useState<StencilBuild | null>(null);
  // null until the server says whether SVG export is paid; the button waits for it.
  const [svgPayment, setSvgPayment] = useState<SvgPaymentConfig | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  // One payment unlocks the current image (any threshold, size, or bridge setting).
  const [unlockedImage, setUnlockedImage] = useState<ExportImage | null>(null);

  useEffect(() => {
    void loadSvgPaymentConfig().then(setSvgPayment);
  }, []);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const t = (chinese: string, english: string, vars?: Record<string, string | number>) => tr(locale, chinese, english, vars);

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

  const targetWidthMm = planResult.plan?.targetWidthMm ?? 0;

  useEffect(() => {
    if (!image || renderMode === "original") {
      setPreviewUrl(null);
      setStencilBuild(null);
      return undefined;
    }
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const work =
        renderMode === "template" && targetWidthMm > 0
          ? buildStencil(image, threshold, invert, targetWidthMm, bridgesOn ? bridgeMm : null).then((build) => {
              if (cancelled) return;
              setStencilBuild(build);
              setPreviewUrl(build.previewUrl);
            })
          : renderPreview(image, renderMode, threshold, invert).then((url) => {
              if (cancelled) return;
              setStencilBuild(null);
              setPreviewUrl(url);
            });
      work.catch(() => {
        if (!cancelled) {
          setPreviewUrl(null);
          setStencilBuild(null);
        }
      });
    }, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [image, renderMode, threshold, invert, bridgesOn, bridgeMm, targetWidthMm]);

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

  // Gallery links open a free design straight in the tool: ?design=/stencils/<category>/<name>.png
  useEffect(() => {
    if (source !== "image") return;
    const design = new URLSearchParams(window.location.search).get("design");
    if (!design || !/^\/stencils\/[a-z0-9-]+\/[a-z0-9-]+\.png$/.test(design)) return;
    void fetch(design)
      .then((response) => (response.ok ? response.blob() : Promise.reject(new Error(String(response.status)))))
      .then((blob) => {
        setRenderMode("template");
        return acceptImage(new File([blob], design.split("/").pop() ?? "stencil.png", { type: "image/png" }));
      })
      .catch(() => undefined);
    // Runs once on load; acceptImage reads the current size inputs itself.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The lettering generator keeps the callback from its first render, so read live values via refs.
  const widthRef = useRef(widthInput);
  const keepAspectRef = useRef(keepAspectRatio);
  widthRef.current = widthInput;
  keepAspectRef.current = keepAspectRatio;

  function acceptGeneratedImage(next: ExportImage | null): void {
    setImage(next);
    setStatus(null);
    const width = Number(widthRef.current);
    if (next && keepAspectRef.current && width > 0) {
      setHeightInput(cleanNumber(width / (next.widthPx / next.heightPx)));
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

  function requestSvgExport(): void {
    if (!svgPayment) return;
    if (svgPayment.paid === "unknown") {
      setStatus({
        kind: "error",
        message: t("暂时无法确认 SVG 的价格，请刷新页面再试。", "Could not check SVG pricing. Refresh the page and try again."),
      });
      return;
    }
    if (svgPayment.paid && unlockedImage !== image) {
      setPaywallOpen(true);
      return;
    }
    handleSvgExport();
  }

  function handleSvgExport(): void {
    if (!stencilBuild || !planResult.plan || !image) return;
    const trace = traceMask(stencilBuild.mask, stencilBuild.maskWidth, stencilBuild.maskHeight);
    const svg = stencilSvg(
      trace,
      stencilBuild.maskWidth,
      stencilBuild.maskHeight,
      planResult.plan.targetWidthMm,
      planResult.plan.targetHeightMm,
    );
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    const link = document.createElement("a");
    const base = image.name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "") || "stencil";
    link.href = url;
    link.download = `${base}-stencil.svg`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
    setStatus({
      kind: "success",
      message: t("SVG 已生成：{paths} 条切割路径，尺寸 {w} × {h} 厘米。", "SVG ready: {paths} cut paths at {w} × {h} cm.", {
        paths: trace.loops,
        w: cleanNumber(planResult.plan.targetWidthMm / 10),
        h: cleanNumber(planResult.plan.targetHeightMm / 10),
      }),
    });
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
      // With bridges on, export the cleaned stencil (already black and white).
      const bridgedImage = renderMode === "template" && bridgesOn ? stencilBuild?.exportImage ?? null : null;
      await exportTiledPdf({
        image: bridgedImage ?? image,
        plan: planResult.plan,
        mode: renderMode,
        stencil: bridgedImage ? DEFAULT_STENCIL : { threshold, invert },
        onProgress: (completed, total) => {
          setStatus({
            kind: "progress",
            message: t("正在生成第 {done}/{total} 页…", "Generating page {done}/{total}…", { done: completed, total }),
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
      <SiteHeader locale={locale} route={route} />

      <main id="workspace" className="workspace">
        <section className="intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">{intro?.eyebrow ?? "LOCAL PRINT WORKBENCH"}</p>
            <h1 id="page-title">
              {intro?.heading ?? t("把一张图，准确拼成纸面大图。", "Turn one image into an accurately assembled paper poster.")}
            </h1>
            <p className="intro-copy">
              {intro?.copy ??
                t(
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
            {source === "text" ? (
              <section className="settings-section" aria-labelledby="source-heading">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">{t("文字", "LETTERING")}</p>
                    <h2 id="source-heading">{t("输入要做成模板的文字", "Type your stencil text")}</h2>
                  </div>
                </div>
                <LetterStencilSource locale={locale} onImage={acceptGeneratedImage} />
              </section>
            ) : (
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
                        {image.widthPx.toLocaleString(LOCALE_TAG[locale])} × {image.heightPx.toLocaleString(LOCALE_TAG[locale])} px
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
                        {t(preset.label.zh, preset.label.en)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              {fileError ? <p className="field-error" role="alert">{fileError}</p> : null}
            </section>
            )}

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
                    <option value="letter">{t("US Letter · 8.5 × 11 in", "US Letter · 8.5 × 11 in")}</option>
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
                {t("当前纸张：{w} × {h} mm。", "Current paper: {w} × {h} mm.", { w: cleanNumber(paper.widthMm), h: cleanNumber(paper.heightMm) })}
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
              {renderMode === "template" ? (
                <div className="stencil-controls">
                  <label className="stencil-threshold">
                    <span>
                      {t("黑白分界", "Stencil threshold")} <output>{threshold}</output>
                    </span>
                    <input
                      type="range"
                      min={20}
                      max={235}
                      step={1}
                      value={threshold}
                      onChange={(event) => setThreshold(Number(event.target.value))}
                    />
                    <small>
                      {t(
                        "往左：更多白色、线条更细；往右：更多黑色、细节更多。看着预览调到轮廓清楚为止。",
                        "Left keeps more white and thinner lines; right adds more black and detail. Adjust until the outline reads clearly in the preview.",
                      )}
                    </small>
                  </label>
                  <label className="stencil-invert">
                    <input type="checkbox" checked={invert} onChange={(event) => setInvert(event.target.checked)} />
                    <span>{t("黑白反转", "Invert black and white")}</span>
                  </label>
                  <div className="stencil-bridges">
                    <label className="stencil-invert">
                      <input type="checkbox" checked={bridgesOn} onChange={(event) => setBridgesOn(event.target.checked)} />
                      <span>
                        {t("自动加连接桥，做成真正能刻的镂空模板", "Add bridges automatically for a stencil you can actually cut")}
                      </span>
                    </label>
                    {bridgesOn ? (
                      <label className="stencil-threshold">
                        <span>
                          {t("连接桥宽度", "Bridge width")} <output>{bridgeMm} mm</output>
                        </span>
                        <input
                          type="range"
                          min={1}
                          max={6}
                          step={0.5}
                          value={bridgeMm}
                          onChange={(event) => setBridgeMm(Number(event.target.value))}
                        />
                      </label>
                    ) : null}
                    {image && stencilBuild ? (
                      <p
                        className={(stencilBuild.islands > 0 && !bridgesOn) || stencilBuild.unbridged > 0 ? "stencil-report is-warning" : "stencil-report"}
                        role="status"
                      >
                        {stencilReport(stencilBuild, bridgesOn, locale)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </section>
          </section>

          <aside className="output-panel" aria-label={t("分页预览与导出", "Tiling preview and export")}>
            <div className="output-card">
              <div className="output-heading">
                <div>
                  <p className="section-kicker">{t("分页预览", "TILING PREVIEW")}</p>
                  <h2>{t("这会是你的拼接顺序", "This will be your assembly order")}</h2>
                </div>
                {planResult.plan ? <span className="page-badge">{t("{n} 页", "{n} pages", { n: planResult.plan.tiles.length })}</span> : null}
              </div>
              <TilePreview image={image} displayUrl={previewUrl} plan={planResult.plan} locale={locale} />
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
              {renderMode === "template" ? (
                <button
                  className="secondary-button export-button svg-export-button"
                  type="button"
                  onClick={requestSvgExport}
                  disabled={!image || !planResult.plan || !stencilBuild || !svgPayment}
                >
                  {t("导出 SVG（刻字机 / 激光切割）", "Export SVG for Cricut / laser cutters")}
                  {svgPayment?.paid === true && unlockedImage !== image ? t(" · ${price}", " · ${price}", { price: svgPayment.price }) : ""}
                </button>
              ) : null}
              {paywallOpen && svgPayment?.paid === true ? (
                <SvgPaywall
                  config={svgPayment}
                  locale={locale}
                  onClose={() => setPaywallOpen(false)}
                  onPaid={() => {
                    setUnlockedImage(image);
                    setPaywallOpen(false);
                    handleSvgExport();
                  }}
                />
              ) : null}
              {!image ? <p className="button-help">{t("选择一张图片后即可导出。", "Choose an image to enable export.")}</p> : null}
              {status ? (
                <p className={status.kind === "error" ? "status-message is-error" : (status.kind === "success" ? "status-message is-success" : "status-message is-progress")} role={status.kind === "error" ? "alert" : "status"} aria-live="polite">
                  {status.message}
                </p>
              ) : null}
            </div>
          </aside>
        </form>

        {children}

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
            {HUB_CARDS.filter((card) => hasPage(locale, card.route)).map((card) => (
              <Link className="guide-card" href={localizedPath(locale, card.route)} key={card.route}>
                <span className="guide-card-icon" aria-hidden="true">{card.icon}</span>
                <h3>{t(...card.title)}</h3>
                <p>{t(...card.body)}</p>
                <span className="guide-card-cta">{t(...card.cta)}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
