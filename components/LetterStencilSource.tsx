"use client";

import { useEffect, useState } from "react";
import { tr, type Locale } from "@/lib/locale";
import type { ExportImage } from "@/lib/pdf-export";

/** Open Font License stencil faces, self-hosted in /public/fonts (licences alongside). */
export const STENCIL_FONTS = [
  { id: "stardos", family: "TS Stardos Stencil", file: "/fonts/StardosStencil-Bold.ttf", label: "Stardos Stencil" },
  { id: "allerta", family: "TS Allerta Stencil", file: "/fonts/AllertaStencil-Regular.ttf", label: "Allerta Stencil" },
  { id: "saira", family: "TS Saira Stencil", file: "/fonts/SairaStencilOne-Regular.ttf", label: "Saira Stencil" },
] as const;

export type StencilFontId = (typeof STENCIL_FONTS)[number]["id"];

/** Rendered cap height in pixels; high enough that a 50 cm letter still prints sharply. */
const LETTER_PX = 600;
const MAX_CHARS = 60;

const loaded = new Map<string, Promise<void>>();

function loadFont(font: (typeof STENCIL_FONTS)[number]): Promise<void> {
  let pending = loaded.get(font.id);
  if (!pending) {
    pending = new FontFace(font.family, `url(${font.file})`).load().then((face) => {
      document.fonts.add(face);
    });
    loaded.set(font.id, pending);
  }
  return pending;
}

/** Split into lines, trimming and capping length so the canvas stays a sane size. */
export function stencilLines(text: string): string[] {
  return text
    .slice(0, MAX_CHARS)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 4);
}

async function renderText(text: string, fontId: StencilFontId): Promise<ExportImage | null> {
  const lines = stencilLines(text);
  if (lines.length === 0) {
    return null;
  }
  const font = STENCIL_FONTS.find((f) => f.id === fontId) ?? STENCIL_FONTS[0];
  await loadFont(font);

  const fontCss = `${LETTER_PX}px "${font.family}"`;
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) {
    throw new Error("canvas");
  }
  measure.font = fontCss;
  const lineHeight = Math.round(LETTER_PX * 1.15);
  const padding = Math.round(LETTER_PX * 0.12);
  const widest = Math.max(...lines.map((line) => measure.measureText(line).width));

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(widest + padding * 2);
  canvas.height = Math.ceil(lineHeight * lines.length + padding * 2);
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("canvas");
  }
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000000";
  context.font = fontCss;
  context.textAlign = "center";
  context.textBaseline = "middle";
  lines.forEach((line, index) => {
    context.fillText(line, canvas.width / 2, padding + lineHeight * (index + 0.5));
  });

  return {
    dataUrl: canvas.toDataURL("image/png"),
    widthPx: canvas.width,
    heightPx: canvas.height,
    name: `${lines.join("-").replace(/[^\w-]+/g, "").slice(0, 40) || "letters"}.png`,
  };
}

export function LetterStencilSource({
  locale,
  onImage,
}: {
  locale: Locale;
  onImage: (image: ExportImage | null) => void;
}) {
  // A sample word in the reader's language, without accents the stencil fonts may lack.
  const [text, setText] = useState(locale === "pt-BR" ? "FESTA" : locale === "es" ? "FIESTA" : "HELLO");
  const [fontId, setFontId] = useState<StencilFontId>("stardos");
  const [error, setError] = useState<string | null>(null);
  const t = (chinese: string, english: string, vars?: Record<string, string | number>) => tr(locale, chinese, english, vars);

  useEffect(() => {
    // Load every face once so the font picker previews render in the real typeface.
    STENCIL_FONTS.forEach((font) => {
      loadFont(font).catch(() => undefined);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      renderText(text, fontId)
        .then((image) => {
          if (cancelled) return;
          setError(null);
          onImage(image);
        })
        .catch(() => {
          if (cancelled) return;
          setError(t("字体加载失败，请刷新页面重试。", "The stencil font could not load. Refresh the page and try again."));
        });
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    // onImage is a stable state setter wrapper from the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, fontId]);

  return (
    <div className="letter-source">
      <label className="letter-text">
        <span>{t("要做成模板的文字", "Text for your stencil")}</span>
        <textarea
          value={text}
          rows={2}
          maxLength={MAX_CHARS}
          onChange={(event) => setText(event.target.value)}
          placeholder={t("输入字母、数字或单词，可换行", "Type letters, numbers, or words; new lines are allowed")}
        />
        <small>
          {t(
            "最多 {max} 个字符、4 行。模板字体只含拉丁字母和数字。",
            "Up to {max} characters and 4 lines. Stencil fonts cover Latin letters, numbers, and common punctuation.",
            { max: MAX_CHARS },
          )}
        </small>
      </label>
      <fieldset className="letter-fonts">
        <legend>{t("模板字体", "Stencil font")}</legend>
        {STENCIL_FONTS.map((font) => (
          <label key={font.id} className={fontId === font.id ? "letter-font is-selected" : "letter-font"}>
            <input
              type="radio"
              name="stencil-font"
              value={font.id}
              checked={fontId === font.id}
              onChange={() => setFontId(font.id)}
            />
            <span style={{ fontFamily: `"${font.family}", sans-serif` }}>ABC 123</span>
            <small>{font.label}</small>
          </label>
        ))}
      </fieldset>
      {error ? <p className="field-error" role="alert">{error}</p> : null}
    </div>
  );
}
