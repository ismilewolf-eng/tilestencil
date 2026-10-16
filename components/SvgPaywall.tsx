"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locale";

export type SvgPaymentConfig =
  | { paid: false }
  | { paid: true; clientId: string; price: string; currency: string; sandbox: boolean }
  /** The check failed on the live site: do not hand out the paid export, ask for a refresh. */
  | { paid: "unknown" };

type PaypalButtons = {
  Buttons: (options: {
    style?: Record<string, string | number>;
    createOrder: () => Promise<string>;
    onApprove: (data: { orderID: string }) => Promise<void>;
    onError?: (error: unknown) => void;
    onCancel?: () => void;
  }) => { render: (element: HTMLElement) => Promise<void>; close?: () => void };
};

declare global {
  interface Window {
    paypal?: PaypalButtons;
  }
}

const isLocalPreview = () => ["localhost", "127.0.0.1"].includes(window.location.hostname);

/**
 * Fetch whether SVG export is paid. On a local preview without Functions a failure means free;
 * on the real site it fails closed, so blocking the request cannot unlock paid exports.
 */
export async function loadSvgPaymentConfig(): Promise<SvgPaymentConfig> {
  const failed: SvgPaymentConfig = isLocalPreview() ? { paid: false } : { paid: "unknown" };
  try {
    const response = await fetch("/api/svg/config", { cache: "no-store" });
    if (!response.ok) return failed;
    const config = (await response.json()) as SvgPaymentConfig;
    return config.paid === true ? config : { paid: false };
  } catch {
    return failed;
  }
}

let sdkPromise: Promise<void> | null = null;

/** Load PayPal's script only when someone actually opens the checkout. */
function loadSdk(clientId: string, currency: string): Promise<void> {
  if (window.paypal) return Promise.resolve();
  sdkPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${currency}&intent=capture&components=buttons`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("paypal sdk"));
    };
    document.head.appendChild(script);
  });
  return sdkPromise;
}

export function SvgPaywall({
  config,
  locale,
  onPaid,
  onClose,
}: {
  config: Extract<SvgPaymentConfig, { paid: true }>;
  locale: Locale;
  onPaid: (orderId: string) => void;
  onClose: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const t = (zh: string, en: string) => (locale === "en" ? en : zh);

  useEffect(() => {
    let cancelled = false;
    let buttons: { close?: () => void } | null = null;
    loadSdk(config.clientId, config.currency)
      .then(() => {
        if (cancelled || !container.current || !window.paypal) return;
        buttons = window.paypal.Buttons({
          style: { layout: "vertical", shape: "rect", label: "pay", height: 44 },
          createOrder: async () => {
            const response = await fetch("/api/svg/order", { method: "POST" });
            if (!response.ok) throw new Error("order");
            return ((await response.json()) as { id: string }).id;
          },
          onApprove: async ({ orderID }) => {
            setMessage(t("正在确认付款…", "Confirming your payment…"));
            const response = await fetch("/api/svg/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: orderID }),
            });
            const result = (await response.json().catch(() => ({ ok: false }))) as { ok: boolean };
            if (result.ok) onPaid(orderID);
            else setMessage(t("付款没有确认成功，没有扣款请重试；已扣款请发邮件联系我们。", "The payment could not be confirmed. If you were charged, email us and we will sort it out."));
          },
          onError: () => setMessage(t("付款出错了，请重试。", "Something went wrong with the payment. Please try again.")),
        });
        return (buttons as { render: (el: HTMLElement) => Promise<void> }).render(container.current);
      })
      .catch(() => {
        if (!cancelled) setMessage(t("PayPal 加载失败，请检查网络后重试。", "PayPal could not load. Check your connection and try again."));
      });
    return () => {
      cancelled = true;
      buttons?.close?.();
    };
    // Rendered once per opening.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="svg-paywall" role="dialog" aria-label={t("购买 SVG", "Buy SVG")}>
      <p className="svg-paywall-title">
        <strong>{t(`可切割 SVG · $${config.price}`, `Cut-ready SVG · $${config.price}`)}</strong>
        <button type="button" className="text-button" onClick={onClose}>
          {t("关闭", "Close")}
        </button>
      </p>
      <p className="svg-paywall-note">
        {t(
          "一次付款，这张图之后可以随时重新导出（调阈值、改尺寸都不再收费）。14 天内不满意可全额退款。",
          "One payment unlocks this image: re-export as often as you like while you adjust it. 14-day money-back guarantee.",
        )}
        {config.sandbox ? t("（测试模式，不会真实扣款）", " (Test mode: no real charge.)") : null}
      </p>
      <div ref={container} />
      {message ? <p className="svg-paywall-message" role="status">{message}</p> : null}
    </div>
  );
}
