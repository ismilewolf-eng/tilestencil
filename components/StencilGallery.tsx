import Link from "next/link";
import { designFiles, LICENSE_URL, type GalleryCategory, type GalleryDesign, type GalleryGroup } from "@/lib/gallery";
import { absoluteLocalizedPath, localizedPath, type Locale } from "@/lib/locale";
import { SITE_URL } from "@/lib/site";

function text(locale: Locale, chinese: string, english: string): string {
  return locale === "en" ? english : chinese;
}

const THUMB = 360;

function thumbSize(design: GalleryDesign) {
  const scale = THUMB / Math.max(design.width, design.height);
  return { width: Math.round(design.width * scale), height: Math.round(design.height * scale) };
}

export function GalleryCard({ locale, design, group }: { locale: Locale; design: GalleryDesign; group: GalleryGroup }) {
  const files = designFiles(design);
  const name = locale === "en" ? design.name.en : design.name.zh;
  const resize = `${localizedPath(locale, group.tool)}?design=${encodeURIComponent(files.png)}`;
  return (
    <figure className="gallery-card" id={design.slug}>
      <a className="gallery-thumb" href={files.png} target="_blank" rel="noopener">
        <img src={files.webp} alt={text(locale, `${name}模板`, `${name} stencil`)} loading="lazy" decoding="async" {...thumbSize(design)} />
      </a>
      <figcaption>
        <strong>{name}</strong>
        <span className="gallery-actions">
          <a href={files.pdf} download>{text(locale, "免费 PDF", "Free PDF")}</a>
          <a href={files.png} download>PNG</a>
          <Link href={resize}>{text(locale, "改尺寸 / SVG", "Resize / SVG")}</Link>
        </span>
      </figcaption>
    </figure>
  );
}

/** ImageObject list so the designs can show in image search with their licence. */
export function GalleryJsonLd({ locale, category }: { locale: Locale; category: GalleryCategory }) {
  const page = absoluteLocalizedPath(locale, category.route);
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: category.designs.map((design, index) => {
      const files = designFiles(design);
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "ImageObject",
          name: `${design.name.en} stencil`,
          contentUrl: SITE_URL + files.png,
          thumbnailUrl: SITE_URL + files.webp,
          license: design.own ? `${page}#license` : LICENSE_URL[design.license ?? ""] ?? design.source,
          acquireLicensePage: `${page}#license`,
          creditText: design.own ? "TileStencil" : "Wikimedia Commons",
          creator: { "@type": "Organization", name: design.own ? "TileStencil" : "Wikimedia Commons contributors" },
          copyrightNotice: design.own ? "TileStencil – free for personal and commercial use" : `${design.license} – ${design.title}`,
        },
      };
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function GallerySections({ locale, category }: { locale: Locale; category: GalleryCategory }) {
  return (
    <>
      <nav className="gallery-jump" aria-label={text(locale, "图案分类", "Design groups")}>
        {category.groups.map((group) => (
          <a key={group.id} href={`#${group.id}`}>
            {locale === "en" ? group.heading.en : group.heading.zh}
          </a>
        ))}
      </nav>
      {category.groups.map((group) => {
        const designs = category.designs.filter((design) => design.group === group.id);
        if (designs.length === 0) return null;
        return (
          <section key={group.id} id={group.id}>
            <h2>{locale === "en" ? group.heading.en : group.heading.zh}</h2>
            <p>{locale === "en" ? group.tip.en : group.tip.zh}</p>
            <div className="gallery-grid">
              {designs.map((design) => (
                <GalleryCard key={design.slug} locale={locale} design={design} group={group} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}

export function GalleryCredits({ locale, category }: { locale: Locale; category: GalleryCategory }) {
  const borrowed = category.designs.filter((design) => !design.own);
  const ownNames = category.designs.filter((design) => design.own).map((design) => (locale === "en" ? design.name.en : design.name.zh));
  return (
    <section id="license">
      <h2>{text(locale, "版权和使用", "Licence and credits")}</h2>
      <p>
        {text(
          locale,
          "下面标明为 TileStencil 原创的图案可以免费用于个人和商业用途，比如做装饰、上课、卖手工成品；只是请不要把文件原样拿去转卖。其余图案来自维基共享资源，属于公有领域或 CC0，可以随意使用，我们只是把它们加上连接桥，变成能直接刻的模板。",
          "Designs marked below as drawn by TileStencil are free for personal and commercial use, such as decorations, classes, and handmade goods you sell. Please do not resell the files themselves. The other designs are public domain or CC0 artwork from Wikimedia Commons, free for any use; we added bridges so they can be cut.",
        )}
      </p>
      <ul className="gallery-credits">
        {ownNames.length > 0 ? (
          <li>
            {text(locale, "TileStencil 原创：", "Drawn by TileStencil: ")}
            {ownNames.join(locale === "en" ? ", " : "、")}
          </li>
        ) : null}
        {borrowed.map((design) => (
          <li key={design.slug}>
            {locale === "en" ? design.name.en : design.name.zh}:{" "}
            <a href={design.source} rel="nofollow noopener" target="_blank">
              {design.title}
            </a>{" "}
            ({design.license === "CC0" ? "CC0" : text(locale, "公有领域", "public domain")})
          </li>
        ))}
      </ul>
    </section>
  );
}
