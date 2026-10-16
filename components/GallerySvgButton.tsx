"use client";

import { useEffect, useRef, useState } from "react";
import { loadSvgPaymentConfig, SvgPaywall, type SvgPaymentConfig } from "@/components/SvgPaywall";
import { gallerySvg } from "@/lib/gallery-svg";
import type { Locale } from "@/lib/locale";

// One config request per page, shared by every card.
let configPromise: Promise<SvgPaymentConfig> | null = null;
const paymentConfig = () => (configPromise ??= loadSvgPaymentConfig());

const unlockKey = (slug: string) => `tilestencil:svg-unlocked:${slug}`;

type Unit = "cm" | "in";
type Status = { kind: "idle" } | { kind: "working" } | { kind: "done" } | { kind: "error"; message: string };

/** "SVG · $1.99" on a gallery card: pick a size, pay once, download a cut-ready SVG of that design. */
export function GallerySvgButton({ slug, name, png, locale }: { slug: string; name: string; png: string; locale: Locale }) {
  const t = (zh: string, en: string) => (locale === "en" ? en : zh);
  const dialog = useRef<HTMLDialogElement>(null);
  const [config, setConfig] = useState<SvgPaymentConfig | null>(null);
  const [open, setOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [unit, setUnit] = useState<Unit>(locale === "en" ? "in" : "cm");
  const [size, setSize] = useState(locale === "en" ? "8" : "20");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    void paymentConfig().then(setConfig);
    setUnlocked(Boolean(window.sessionStorage.getItem(unlockKey(slug))));
  }, [slug]);

  const widthMm = Number(size) * (unit === "in" ? 25.4 : 10);
  const sizeValid = Number.isFinite(widthMm) && widthMm >= 20 && widthMm <= 3000;
  const free = config?.paid === false;
  const label = config?.paid === true && !unlocked ? `SVG · $${config.price}` : free ? t("免费 SVG", "Free SVG") : "SVG";

  function show() {
    setStatus({ kind: "idle" });
    setOpen(true);
    dialog.current?.showModal();
  }

  function close() {
    dialog.current?.close();
    setOpen(false);
  }

  async function download() {
    if (!sizeValid) return;
    setStatus({ kind: "working" });
    try {
      const svg = await gallerySvg(png, widthMm);
      const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}-stencil-${size}${unit}.svg`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      setStatus({ kind: "done" });
    } catch {
      setStatus({ kind: "error", message: t("SVG 生成失败，请刷新页面再试。已付款不会重复收费。", "The SVG could not be made. Refresh and try again; you will not be charged twice.") });
    }
  }

  function paid(orderId: string) {
    window.sessionStorage.setItem(unlockKey(slug), orderId);
    setUnlocked(true);
    void download();
  }

  const canDownload = free || unlocked;

  return (
    <>
      <button type="button" className="gallery-svg-button" onClick={show} disabled={!config} aria-haspopup="dialog">
        {label}
      </button>
      <dialog ref={dialog} className="svg-dialog" onClose={() => setOpen(false)} aria-labelledby={`svg-${slug}-title`}>
        <div className="svg-dialog-head">
          <h3 id={`svg-${slug}-title`}>{t(`${name} · 可切割 SVG`, `${name} · cut-ready SVG`)}</h3>
          <button type="button" className="svg-dialog-close" onClick={close} aria-label={t("关闭", "Close")}>
            ×
          </button>
        </div>
        <p className="svg-dialog-note">
          {t(
            "连接桥已经加好，可直接导入 Cricut Design Space、Silhouette 或激光切割软件，导入后就是下面设定的宽度。",
            "Bridges are already in place. It imports into Cricut Design Space, Silhouette Studio or laser software at the width you set below.",
          )}
        </p>
        <label className="svg-dialog-size">
          <span>{t("宽度", "Width")}</span>
          <input type="number" min={unit === "in" ? 1 : 2} max={unit === "in" ? 118 : 300} step="any" inputMode="decimal" value={size} onChange={(event) => setSize(event.target.value)} />
          <select value={unit} onChange={(event) => setUnit(event.target.value as Unit)} aria-label={t("单位", "Unit")}>
            <option value="in">in</option>
            <option value="cm">cm</option>
          </select>
        </label>
        {!sizeValid ? (
          <p className="svg-dialog-error">
            {unit === "in" ? t("请输入 1 到 118 英寸之间的宽度。", "Enter a width between 1 and 118 inches.") : t("请输入 2 到 300 厘米之间的宽度。", "Enter a width between 2 and 300 cm.")}
          </p>
        ) : null}

        {config?.paid === "unknown" ? (
          <p className="svg-dialog-error">{t("暂时无法确认付款设置，请刷新页面再试。", "We could not check the payment settings. Refresh the page and try again.")}</p>
        ) : canDownload ? (
          <button type="button" className="svg-dialog-download" onClick={download} disabled={!sizeValid || status.kind === "working"}>
            {status.kind === "working" ? t("正在生成…", "Making your SVG…") : t("下载 SVG", "Download SVG")}
          </button>
        ) : config?.paid === true && open && sizeValid ? (
          <SvgPaywall config={config} locale={locale} onPaid={paid} onClose={close} />
        ) : null}

        {status.kind === "done" ? (
          <p className="svg-dialog-done" role="status">
            {t("已下载。想要别的尺寸，改宽度后再点下载，本次不再收费。", "Downloaded. Need another size? Change the width and download again at no extra charge.")}
          </p>
        ) : null}
        {status.kind === "error" ? <p className="svg-dialog-error" role="alert">{status.message}</p> : null}
      </dialog>
    </>
  );
}
