"use client";

import { useEffect, useRef, useState } from "react";
import { PayDialog, paymentConfigOnce } from "@/components/ChristmasPack";
import type { SvgPaymentConfig } from "@/components/SvgPaywall";
import { grantTimed, hasTimed } from "@/lib/unlock";

export interface ListAccess {
  /** Payment settings are known. */
  ready: boolean;
  /** No limit applies: payments are off, or this tool has been paid for. */
  unlimited: boolean;
  /** Price of the full file, when it is on sale. */
  price: string | null;
  config: SvgPaymentConfig | null;
  markPaid: (orderId: string) => void;
}

/** Whether this browser may download the full file of a list tool, and what it costs if not. */
export function useListAccess(slug: string): ListAccess {
  const [config, setConfig] = useState<SvgPaymentConfig | null>(null);
  const [paid, setPaid] = useState(false);
  useEffect(() => {
    void paymentConfigOnce().then(setConfig);
    setPaid(hasTimed(slug));
  }, [slug]);
  const price = config?.paid === true ? (config.list?.price ?? null) : null;
  return {
    ready: config !== null,
    // If the full file is not on sale here, nothing is held back.
    unlimited: paid || (config !== null && config.paid !== "unknown" && price === null),
    price,
    config,
    markPaid: (orderId) => {
      grantTimed(slug, orderId);
      setPaid(true);
    },
  };
}

/** Under the free download when the list is longer than the free amount: the whole list in one file. */
export function FullListOffer({
  access,
  total,
  free,
  noun,
  onPaid,
}: {
  access: ListAccess;
  total: number;
  free: number;
  /** "labels" or "tickets". */
  noun: string;
  onPaid: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  if (!access.ready || access.unlimited || access.price === null || total <= free) return null;
  return (
    <div className="print-shop" role="region" aria-label={`All ${total} ${noun}`}>
      <p className="print-shop-title">
        Your list has {total.toLocaleString("en-US")} {noun}. The first {free} are free.
      </p>
      <p className="print-shop-text">
        Get all {total.toLocaleString("en-US")} in one print-ready PDF. One payment covers this tool for 7 days: edit the list and download as often as you
        need.
      </p>
      <button
        className="secondary-button export-button"
        type="button"
        onClick={() => {
          setOpen(true);
          dialog.current?.showModal();
        }}
      >
        <span>
          All {total.toLocaleString("en-US")} {noun}
        </span>
        <span className="pattern-svg-price">${access.price}</span>
      </button>
      <PayDialog
        title={`All ${total.toLocaleString("en-US")} ${noun}, ready to print`}
        config={access.config}
        product="list"
        locale="en"
        onPaid={(orderId) => {
          access.markPaid(orderId);
          dialog.current?.close();
          onPaid();
        }}
        dialog={dialog}
        open={open}
        onClose={() => setOpen(false)}
      >
        The free file has the first {free} {noun}. Paying unlocks the full list, any number of times, for 7 days in this browser.
      </PayDialog>
    </div>
  );
}
