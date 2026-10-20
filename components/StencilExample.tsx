import { STENCIL_EXAMPLES, type ExampleKey, type StencilExample } from "@/lib/examples";
import { tr, type Locale } from "@/lib/locale";

/** A before/after pair: the original photo and the stencil this tool made from it. */
function ExampleFigure({ locale, name }: { locale: Locale; name: ExampleKey }) {
  const example: StencilExample = STENCIL_EXAMPLES[name];
  const t = (zh: string, en: string, vars?: Record<string, string>) => tr(locale, zh, en, vars);
  const subject = t(example.alt.zh, example.alt.en);
  const size = { width: example.width, height: example.height };
  return (
    <figure className="stencil-example">
      <div className="stencil-example-pair">
        <div>
          <img src={`/examples/${name}-photo.webp`} alt={t("原图：{subject}", "Original photo of {subject}", { subject })} loading="lazy" decoding="async" {...size} />
          <span>{t("原图", "Original")}</span>
        </div>
        <div>
          <img src={`/examples/${name}-stencil.webp`} alt={t("用这张图做出的模板：{subject}", "Stencil made from the photo of {subject}", { subject })} loading="lazy" decoding="async" {...size} />
          <span>{t("模板，阈值 {n}", "Stencil, threshold {n}", { n: String(example.threshold) })}</span>
        </div>
      </div>
      <figcaption>
        {t("用本页一步做出，黑色部分就是要刻掉的地方。图片来源：", "Made with this page in one step. Black areas are cut out. Photo: ")}
        <a href={example.source} rel="nofollow noopener" target="_blank">
          {example.author ? `${example.author}, ` : ""}Wikimedia Commons
        </a>
        {` (${example.license === "CC0" ? "CC0" : t("公有领域", "public domain")})`}
      </figcaption>
    </figure>
  );
}

export function StencilExampleSection({ locale, name }: { locale: Locale; name: ExampleKey }) {
  return (
    <section>
      <h2>{tr(locale, "示例：从原图到模板", "Example: photo to stencil")}</h2>
      <ExampleFigure locale={locale} name={name} />
    </section>
  );
}
