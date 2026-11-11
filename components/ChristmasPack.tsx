"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadSvgPaymentConfig, SvgPaywall, type SvgPaymentConfig } from "@/components/SvgPaywall";
import { gallerySvg } from "@/lib/gallery-svg";
import { HOUSE_PRESETS } from "@/lib/gingerbread";
import { MAN_PRESETS } from "@/lib/gingerbreadman";
import type { Locale } from "@/lib/locale";
import { houseSvg, manSvg, stockingSvg } from "@/lib/pattern-svg";
import { STOCKING_SIZES } from "@/lib/stocking";
import { sheetFileName, sheetFormat } from "@/lib/stocking-sheet";
import { grantPack, grantSingle, hasPack, hasSingle, PACK_EVENT, saveFile } from "@/lib/unlock";
import type { Product } from "@/lib/waffo";
import { zipStore } from "@/lib/zip";

let configPromise: Promise<SvgPaymentConfig> | null = null;
const paymentConfig = () => (configPromise ??= loadSvgPaymentConfig());

export const STENCIL_COUNT = 28;
export const paymentConfigOnce = () => paymentConfig();
const ZIP_WIDTH_MM = 8 * 25.4;

type Design = { slug: string; png: string };

/** Every Christmas SVG in one archive: the gallery stencils at 8 in wide, the three patterns in their preset sizes. */
async function buildPackZip(designs: Design[], onProgress: (done: number) => void): Promise<Uint8Array> {
  const files: Array<{ name: string; text?: string; bytes?: Uint8Array }> = [];
  for (const size of STOCKING_SIZES) files.push({ name: `patterns/christmas-stocking-${size.id}.svg`, text: stockingSvg(size.id) });
  for (const preset of HOUSE_PRESETS) files.push({ name: `patterns/gingerbread-house-${preset.id}.svg`, text: houseSvg(preset.size, "gingerbread", true) });
  for (const preset of MAN_PRESETS) files.push({ name: `patterns/gingerbread-man-${preset.note.replace(/\s+/g, "")}.svg`, text: manSvg(preset.heightMm, true) });
  const { exportStockingSheetPdf } = await import("@/lib/stocking-pdf");
  for (const size of STOCKING_SIZES) {
    for (const paper of ["letter", "a4"] as const) {
      const bytes = await exportStockingSheetPdf({ size: size.id, paperSize: paper, save: false });
      if (bytes) files.push({ name: `patterns/print-shop/${sheetFileName(size.id, sheetFormat(size.id, paper))}`, bytes });
    }
  }
  let done = 0;
  for (const design of designs) {
    files.push({ name: `stencils/${design.slug}-8in.svg`, text: await gallerySvg(design.png, ZIP_WIDTH_MM) });
    onProgress(++done);
  }
  files.push({
    name: "README.txt",
    text: [
      "TileStencil Christmas SVG pack - tilestencil.com",
      "",
      "stencils/  Christmas stencils, 8 in wide, bridges included. Scale them in your cutting software,",
      "           or open tilestencil.com/free-stencils/christmas and download any design at an exact width.",
      "patterns/  Stocking, gingerbread house and gingerbread man. Sizes are true: 1 SVG unit = 1 mm.",
      "           Black lines are cut lines. Red lines (door, windows, eyes, buttons) are optional details:",
      "           set them to draw or score, or delete them. Cut each gingerbread house piece twice.",
      "           For another size, open the pattern page on tilestencil.com in the browser you paid in.",
      "patterns/print-shop/  The stocking pattern on one large sheet (24 x 36 in, 36 x 48 in, A1 or A0).",
      "           Take the PDF to a print shop and ask for it at 100%, not scaled to fit. Nothing to tape.",
      "",
      "Free for personal and commercial use. Please do not resell the files themselves.",
      "Questions or a refund within 14 days: tilestencil.com/refund-policy",
      "",
    ].join("\r\n"),
  });
  return zipStore(files);
}

export function PayDialog({
  title,
  config,
  product,
  locale,
  onPaid,
  dialog,
  open,
  onClose,
  children,
}: {
  title: string;
  config: SvgPaymentConfig | null;
  product: Product;
  locale: Locale;
  onPaid: (orderId: string, product: Product) => void;
  dialog: React.RefObject<HTMLDialogElement | null>;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <dialog ref={dialog} className="svg-dialog" onClose={onClose} aria-label={title}>
      {open ? (
        <>
          <div className="svg-dialog-head">
            <h3>{title}</h3>
            <button type="button" className="svg-dialog-close" onClick={() => dialog.current?.close()} aria-label="Close">
              ×
            </button>
          </div>
          <div className="svg-dialog-note">{children}</div>
          {config?.paid === true ? <SvgPaywall config={config} locale={locale} product={product} onPaid={onPaid} onClose={() => dialog.current?.close()} /> : null}
        </>
      ) : null}
    </dialog>
  );
}

/**
 * Under the free PDF button on a Christmas pattern page: the same pattern as a cut-ready SVG,
 * alone or as part of the Christmas pack.
 */
export function PatternSvgOffer({
  slug,
  fileName,
  makeSvg,
  disabled = false,
  fit,
}: {
  slug: string;
  fileName: string;
  makeSvg: () => string;
  disabled?: boolean;
  /** One honest line about what this size fits on (cutting mat, laser bed). */
  fit: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [config, setConfig] = useState<SvgPaymentConfig | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pack, setPack] = useState(false);
  const [buying, setBuying] = useState<Product | null>(null);
  const [done, setDone] = useState<"svg" | "pack" | null>(null);

  useEffect(() => {
    void paymentConfig().then(setConfig);
    const read = () => {
      setPack(hasPack());
      setUnlocked(hasSingle(slug) || hasPack());
    };
    read();
    window.addEventListener(PACK_EVENT, read);
    return () => window.removeEventListener(PACK_EVENT, read);
  }, [slug]);

  if (!config || config.paid === "unknown") return null;

  const free = config.paid === false;
  const canDownload = free || unlocked;
  const download = () => saveFile(fileName, makeSvg(), "image/svg+xml");

  function open(product: Product) {
    setDone(null);
    setBuying(product);
    dialog.current?.showModal();
  }

  function paid(orderId: string, product: Product) {
    if (product === "pack") grantPack(orderId);
    else grantSingle(slug, orderId);
    setUnlocked(true);
    setPack(product === "pack" || pack);
    setDone(product === "pack" ? "pack" : "svg");
    dialog.current?.close();
    download();
  }

  return (
    <div className="pattern-svg">
      <p className="pattern-svg-title">Cutting with a Cricut, Silhouette or laser?</p>
      {canDownload ? (
        <button className="secondary-button export-button" type="button" onClick={download} disabled={disabled}>
          {free ? "Download cut-ready SVG (free)" : "Download cut-ready SVG"}
        </button>
      ) : (
        <button className="secondary-button export-button" type="button" onClick={() => open("svg")} disabled={disabled}>
          <span>This pattern as SVG</span>
          <span className="pattern-svg-price">${config.price}</span>
        </button>
      )}
      {config.paid === true && config.pack && !pack ? (
        <button className="secondary-button export-button" type="button" onClick={() => open("pack")} disabled={disabled}>
          <span>Christmas pack: 3 patterns + {STENCIL_COUNT} stencils</span>
          <span className="pattern-svg-price">${config.pack.price}</span>
        </button>
      ) : null}
      <p className="pattern-svg-fit">{fit}</p>
      {done === "svg" ? (
        <p className="pattern-svg-done" role="status">
          Downloaded. Change the size and download again as often as you like in this tab, at no extra charge.
        </p>
      ) : null}
      {done === "pack" || (pack && config.paid === true) ? (
        <p className="pattern-svg-done" role="status">
          Christmas pack unlocked in this browser. <Link href="/free-stencils/christmas/#pack">Download every file as one zip</Link>.
        </p>
      ) : null}
      <PayDialog
        title={buying === "pack" ? `3 patterns + ${STENCIL_COUNT} stencils` : "This pattern, ready to cut"}
        config={config}
        product={buying ?? "svg"}
        locale="en"
        onPaid={paid}
        dialog={dialog}
        open={buying !== null}
        onClose={() => setBuying(null)}
      >
        {buying === "pack" ? (
          <>
            The stocking, gingerbread house and gingerbread man patterns in any size, plus all {STENCIL_COUNT} Christmas stencils, as SVG files that
            open in Cricut Design Space, Silhouette Studio and laser software.
          </>
        ) : (
          <>The pattern in the size you chose, as closed cut lines at true size. It opens in Cricut Design Space, Silhouette Studio and laser software.</>
        )}
      </PayDialog>
    </div>
  );
}

type ZipState = { kind: "idle" } | { kind: "working"; done: number } | { kind: "done" } | { kind: "error" };

/** Top of the Christmas stencil gallery: buy the pack, or (once bought) download everything as one zip. */
export function ChristmasPackBanner({ locale, designs }: { locale: Locale; designs: Design[] }) {
  const t = (zh: string, en: string) => (locale === "en" ? en : zh);
  const dialog = useRef<HTMLDialogElement>(null);
  const [config, setConfig] = useState<SvgPaymentConfig | null>(null);
  const [owned, setOwned] = useState(false);
  const [open, setOpen] = useState(false);
  const [zip, setZip] = useState<ZipState>({ kind: "idle" });

  useEffect(() => {
    void paymentConfig().then(setConfig);
    const read = () => setOwned(hasPack());
    read();
    window.addEventListener(PACK_EVENT, read);
    return () => window.removeEventListener(PACK_EVENT, read);
  }, []);

  if (!config || config.paid !== true || !config.pack) return null;

  async function downloadZip() {
    setZip({ kind: "working", done: 0 });
    try {
      const bytes = await buildPackZip(designs, (done) => setZip({ kind: "working", done }));
      saveFile("tilestencil-christmas-svg-pack.zip", bytes as BlobPart, "application/zip");
      setZip({ kind: "done" });
    } catch {
      setZip({ kind: "error" });
    }
  }

  function paid(orderId: string, product: Product) {
    dialog.current?.close();
    if (product !== "pack") return;
    grantPack(orderId);
    setOwned(true);
    void downloadZip();
  }

  return (
    <aside className="pack-banner" id="pack">
      <div className="pack-banner-text">
        <strong>{owned ? t("圣诞全套 SVG 已解锁", "Your Christmas SVG pack") : t("圣诞全套 SVG", "Christmas SVG pack")}</strong>
        <span>
          {t(
            `本页全部 ${designs.length} 张模板，加上圣诞袜、姜饼屋、姜饼人三个纸样，都是可直接切割的 SVG，打包成一个文件下载。`,
            `All ${designs.length} stencils on this page plus the stocking, gingerbread house and gingerbread man patterns, as cut-ready SVG files in one zip.`,
          )}
        </span>
      </div>
      {owned ? (
        <button type="button" className="pack-banner-button" onClick={() => void downloadZip()} disabled={zip.kind === "working"}>
          {zip.kind === "working" ? t(`正在生成 ${zip.done}/${designs.length}…`, `Making files ${zip.done}/${designs.length}…`) : t("下载全部（zip）", "Download all (zip)")}
        </button>
      ) : (
        <button
          type="button"
          className="pack-banner-button"
          onClick={() => {
            setOpen(true);
            dialog.current?.showModal();
          }}
        >
          {t(`全套 $${config.pack.price}`, `Get the pack · $${config.pack.price}`)}
        </button>
      )}
      {zip.kind === "done" ? (
        <p className="pack-banner-status" role="status">
          {t("已下载。下面每张模板也可以单独按你要的宽度下载，不再收费。", "Downloaded. Every design below can also be downloaded at an exact width, at no extra charge.")}
        </p>
      ) : null}
      {zip.kind === "error" ? (
        <p className="pack-banner-status is-error" role="alert">
          {t("打包失败，请刷新页面再试，不会重复收费。", "The zip could not be made. Refresh and try again; you will not be charged twice.")}
        </p>
      ) : null}
      <PayDialog title={t(`${designs.length} 张模板 + 3 个纸样`, `${designs.length} stencils + 3 patterns`)} config={config} product="pack" locale={locale} onPaid={paid} dialog={dialog} open={open} onClose={() => setOpen(false)}>
        {t(
          `${designs.length} 张圣诞模板（已加连接桥）和三个纸样，可导入 Cricut Design Space、Silhouette Studio 和激光切割软件。`,
          `${designs.length} Christmas stencils with bridges in place, and three patterns, as SVG files that open in Cricut Design Space, Silhouette Studio and laser software.`,
        )}
      </PayDialog>
    </aside>
  );
}
