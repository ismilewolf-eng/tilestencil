import { STENCIL_EXAMPLES, type ExampleKey, type StencilExample } from "@/lib/examples";
import type { Locale } from "@/lib/locale";

/** A before/after pair: the original photo and the stencil this tool made from it. */
function ExampleFigure({ locale, name }: { locale: Locale; name: ExampleKey }) {
  const example: StencilExample = STENCIL_EXAMPLES[name];
  const en = locale === "en";
  const subject = en ? example.alt.en : example.alt.zh;
  const size = { width: example.width, height: example.height };
  return (
    <figure className="stencil-example">
      <div className="stencil-example-pair">
        <div>
          <img src={`/examples/${name}-photo.webp`} alt={en ? `Original photo of ${subject}` : `原图：${subject}`} loading="lazy" decoding="async" {...size} />
          <span>{en ? "Original" : "原图"}</span>
        </div>
        <div>
          <img src={`/examples/${name}-stencil.webp`} alt={en ? `Stencil made from the photo of ${subject}` : `用这张图做出的模板：${subject}`} loading="lazy" decoding="async" {...size} />
          <span>{en ? `Stencil, threshold ${example.threshold}` : `模板，阈值 ${example.threshold}`}</span>
        </div>
      </div>
      <figcaption>
        {en ? "Made with this page in one step. Black areas are cut out. Photo: " : "用本页一步做出，黑色部分就是要刻掉的地方。图片来源："}
        <a href={example.source} rel="nofollow noopener" target="_blank">
          {example.author ? `${example.author}, ` : ""}Wikimedia Commons
        </a>
        {` (${example.license === "CC0" ? "CC0" : en ? "public domain" : "公有领域"})`}
      </figcaption>
    </figure>
  );
}

export function StencilExampleSection({ locale, name }: { locale: Locale; name: ExampleKey }) {
  return (
    <section>
      <h2>{locale === "en" ? "Example: photo to stencil" : "示例：从原图到模板"}</h2>
      <ExampleFigure locale={locale} name={name} />
    </section>
  );
}
