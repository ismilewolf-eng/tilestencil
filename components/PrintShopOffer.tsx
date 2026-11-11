"use client";

import { useEffect, useRef, useState } from "react";
import { PayDialog, paymentConfigOnce } from "@/components/ChristmasPack";
import type { SvgPaymentConfig } from "@/components/SvgPaywall";
import type { PaperSize } from "@/lib/geometry";
import type { StockingSize } from "@/lib/stocking";
import { sheetFormat } from "@/lib/stocking-sheet";
import { grantPack, grantSingle, hasPack, hasSingle, PACK_EVENT } from "@/lib/unlock";
import type { Product } from "@/lib/waffo";

const SLUG = "christmas-sheet-stocking";

/**
 * Shown once the free tiled PDF has been downloaded: the same pattern on one large sheet for a
 * print shop, so there is nothing to trim and tape. Stays visible after it has been bought.
 */
export function PrintShopOffer({ size, paperSize, sheets, afterDownload }: { size: StockingSize; paperSize: PaperSize; sheets: number; afterDownload: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [config, setConfig] = useState<SvgPaymentConfig | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "working" | "done" | "error">("idle");

  useEffect(() => {
    void paymentConfigOnce().then(setConfig);
    const read = () => setUnlocked(hasSingle(SLUG) || hasPack());
    read();
    window.addEventListener(PACK_EVENT, read);
    return () => window.removeEventListener(PACK_EVENT, read);
  }, []);

  if (!config || config.paid === "unknown") return null;
  const free = config.paid === false;
  const offer = config.paid === true ? config.sheet : undefined;
  const canDownload = free || unlocked;
  if (!canDownload && (!offer || !afterDownload)) return null;

  const format = sheetFormat(size, paperSize);

  async function download() {
    setState("working");
    try {
      const { exportStockingSheetPdf } = await import("@/lib/stocking-pdf");
      await exportStockingSheetPdf({ size, paperSize });
      setState("done");
    } catch {
      setState("error");
    }
  }

  function paid(orderId: string, product: Product) {
    if (product === "pack") grantPack(orderId);
    else grantSingle(SLUG, orderId);
    setUnlocked(true);
    dialog.current?.close();
    void download();
  }

  return (
    <div className="print-shop" role="region" aria-label="Print-shop version">
      <p className="print-shop-title">{sheets > 1 ? `Rather not tape ${sheets} sheets together?` : "Want it on one big sheet?"}</p>
      <p className="print-shop-text">
        Get the whole pattern on one {format.label} sheet. Take the PDF to a print shop, ask for 100% scale, and cut. Nothing to trim or tape.
      </p>
      {canDownload ? (
        <button className="secondary-button export-button" type="button" onClick={() => void download()} disabled={state === "working"}>
          {state === "working" ? "Making the PDF…" : `Download the ${format.label} PDF`}
        </button>
      ) : (
        <button
          className="secondary-button export-button"
          type="button"
          onClick={() => {
            setOpen(true);
            dialog.current?.showModal();
          }}
        >
          <span>One-sheet print-shop PDF</span>
          <span className="pattern-svg-price">${offer?.price}</span>
        </button>
      )}
      {state === "done" ? (
        <p className="pattern-svg-done" role="status">
          Downloaded. Change the size above and download again as often as you like in this tab, at no extra charge.
        </p>
      ) : null}
      {state === "error" ? (
        <p className="print-shop-error" role="alert">
          The PDF could not be made. Reload the page and try again; you will not be charged twice.
        </p>
      ) : null}
      <PayDialog title="The whole pattern on one sheet" config={config} product="sheet" locale="en" onPaid={paid} dialog={dialog} open={open} onClose={() => setOpen(false)}>
        The same pattern at actual size on one {format.label} sheet, in all three stocking sizes. Print shops call this size an engineering or
        large-format print.
      </PayDialog>
    </div>
  );
}
