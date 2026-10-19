"use client";

import { useEffect, useRef, useState } from "react";
import { readFirstTouch, sourceTag } from "@/lib/attribution";
import type { Locale } from "@/lib/locale";

export type SvgPaymentConfig =
  | { paid: false }
  | { paid: true; clientId: string; price: string; currency: string; sandbox: boolean; waffo?: { test: boolean } }
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
  const waffo = useWaffoCheckout(locale, onPaid);

  useEffect(() => {
    let cancelled = false;
    let buttons: { close?: () => void } | null = null;
    loadSdk(config.clientId, config.currency)
      .then(() => {
        if (cancelled || !container.current || !window.paypal) return;
        buttons = window.paypal.Buttons({
          style: { layout: "vertical", shape: "rect", label: "pay", height: 44 },
          createOrder: async () => {
            const response = await fetch("/api/svg/order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ source: sourceTag(readFirstTouch(), location.pathname) }),
            });
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
      {config.waffo ? (
        <>
          <p className="svg-paywall-or" aria-hidden="true">
            {t("或", "or")}
          </p>
          <button type="button" className="svg-paywall-waffo" onClick={waffo.start} disabled={waffo.state.kind === "starting"}>
            {waffo.state.kind === "starting"
              ? t("正在打开付款页…", "Opening checkout…")
              : t("Apple Pay / Google Pay / 微信支付 / 银行卡", "Apple Pay, Google Pay, WeChat Pay or card")}
          </button>
          {config.waffo.test ? <p className="svg-paywall-note">{t("（这个付款方式在测试模式，不会真实扣款）", "(This option is in test mode: no real charge.)")}</p> : null}
          {waffo.state.kind === "waiting" ? (
            <p className="svg-paywall-message" role="status">
              {t("请在新打开的页面完成付款，付款确认后 SVG 会在这里自动下载。请不要关闭这个页面。", "Finish paying in the new tab. Your SVG downloads here as soon as the payment is confirmed, so keep this page open.")}{" "}
              {waffo.state.url ? (
                <a href={waffo.state.url} target="_blank" rel="noopener noreferrer">
                  {t("没看到付款页？点这里打开", "No new tab? Open checkout")}
                </a>
              ) : null}{" "}
              <button type="button" className="text-button" onClick={() => void waffo.checkNow()}>
                {t("我已付款，马上检查", "I've paid, check now")}
              </button>
              {waffo.state.notYet ? (
                <>
                  {" "}
                  {t("还没收到付款确认，付款完成后通常几秒内到账，请稍等。", "No payment yet. It usually shows up a few seconds after you pay.")}
                </>
              ) : null}
            </p>
          ) : null}
          {waffo.state.kind === "error" ? (
            <p className="svg-paywall-message" role="alert">
              {waffo.state.message}
            </p>
          ) : null}
        </>
      ) : null}
      {message ? <p className="svg-paywall-message" role="status">{message}</p> : null}
    </div>
  );
}

type WaffoState =
  | { kind: "idle" }
  | { kind: "starting" }
  | { kind: "waiting"; ref: string; url: string | null; notYet?: boolean }
  | { kind: "error"; message: string };

const POLL_MS = 3000;
const POLL_LIMIT_MS = 45 * 60 * 1000;

/**
 * Waffo hosted checkout: open it in a new tab (so this page keeps the user's image), then
 * poll our server until Waffo reports the order as paid.
 */
function useWaffoCheckout(locale: Locale, onPaid: (orderId: string) => void) {
  const t = (zh: string, en: string) => (locale === "en" ? en : zh);
  const [state, setState] = useState<WaffoState>({ kind: "idle" });
  const paidRef = useRef(onPaid);
  paidRef.current = onPaid;
  const checking = useRef(false);

  async function check(ref: string): Promise<boolean> {
    if (checking.current) return false;
    checking.current = true;
    try {
      const response = await fetch("/api/svg/waffo-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref }),
      });
      const result = (await response.json().catch(() => ({ ok: false }))) as { ok: boolean };
      if (result.ok) {
        setState({ kind: "idle" });
        paidRef.current(ref);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      checking.current = false;
    }
  }

  const waitingRef = state.kind === "waiting" ? state.ref : null;
  useEffect(() => {
    if (!waitingRef) return;
    const started = Date.now();
    let done = false;
    const stop = () => {
      done = true;
      window.clearInterval(timer);
    };
    const tick = async () => {
      if (done) return;
      if (Date.now() - started > POLL_LIMIT_MS || (await check(waitingRef))) stop();
    };
    const timer = window.setInterval(() => void tick(), POLL_MS);
    const onFocus = () => void tick();
    window.addEventListener("focus", onFocus);
    return () => {
      stop();
      window.removeEventListener("focus", onFocus);
    };
    // check() only reads refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waitingRef]);

  async function start() {
    // Open the tab inside the click so pop-up blockers allow it, then point it at the checkout.
    const tab = window.open("", "_blank");
    setState({ kind: "starting" });
    try {
      const response = await fetch("/api/svg/waffo-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: sourceTag(readFirstTouch(), location.pathname), locale }),
      });
      if (!response.ok) throw new Error("session");
      const { ref, url } = (await response.json()) as { ref: string; url: string };
      if (tab && !tab.closed) {
        tab.opener = null;
        tab.location.href = url;
      }
      setState({ kind: "waiting", ref, url });
    } catch {
      tab?.close();
      setState({ kind: "error", message: t("付款页打开失败，请重试，或改用上面的 PayPal。", "Checkout could not open. Try again, or use PayPal above.") });
    }
  }

  return {
    state,
    start: () => void start(),
    checkNow: async () => {
      if (state.kind !== "waiting") return;
      const current = state;
      if (!(await check(current.ref))) setState({ ...current, notYet: true });
    },
  };
}
