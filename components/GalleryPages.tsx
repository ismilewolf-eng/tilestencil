import type { ReactNode } from "react";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd } from "@/components/JsonLd";
import { GalleryCard, GalleryCredits, GalleryJsonLd, GallerySections } from "@/components/StencilGallery";
import { GALLERY_CATEGORIES, type GalleryCategory } from "@/lib/gallery";
import { localizedPath, type Locale } from "@/lib/locale";

function text(locale: Locale, chinese: string, english: string): string {
  return locale === "en" ? english : chinese;
}

type FaqItem = { question: string; answer: string };
type CategoryCopy = { kicker: string; title: string; lead: string; uses: ReactNode[]; faq: FaqItem[] };

function sharedFaq(locale: Locale, count: number): FaqItem[] {
  return locale === "en"
    ? [
        {
          question: "Are these stencils really free?",
          answer: `Yes. All ${count} designs can be downloaded as a PDF or PNG with no account and no watermark, and you can use them for decorations, classes, and things you make and sell.`,
        },
        {
          question: "How do I make a stencil bigger or smaller?",
          answer: "Click Resize / SVG under the design. It opens in the stencil maker, where you enter the exact width in cm or inches; designs larger than one sheet are split across several pages with alignment marks.",
        },
        {
          question: "What are the thin white lines across some designs?",
          answer: "They are bridges. Without them, enclosed pieces (the eyes of a skull, the white baubles on a tree) would fall out when you cut the stencil. Every design here already has them where they are needed.",
        },
        {
          question: "Can I get an SVG file for my Cricut or Silhouette?",
          answer: "Yes. Click Resize / SVG, set the size, and download the SVG. Printing and the PDF are free; the cut-ready SVG costs $1.99 per design.",
        },
      ]
    : [
        {
          question: "这些模板真的免费吗？",
          answer: `是的。全部 ${count} 个图案都能免费下载 PDF 或 PNG，不用注册、没有水印，可以用来做装饰、上课，也可以做成手工成品卖。`,
        },
        {
          question: "怎么把模板放大或缩小？",
          answer: "点图案下面的“改尺寸 / SVG”，会在模板工具里打开，填上想要的宽度（厘米或英寸）就行；超过一张纸会自动分页，带拼接标记。",
        },
        {
          question: "有些图案上的细白线是什么？",
          answer: "那是连接桥。没有它们，封闭的部分（比如骷髅的眼睛、圣诞树上的白色小球）刻完就会掉下来。这里每个图案需要的地方都已经加好了。",
        },
        {
          question: "能拿到刻字机用的 SVG 吗？",
          answer: "可以。点“改尺寸 / SVG”，设好尺寸后下载 SVG。打印和 PDF 免费，可直接切割的 SVG 每个图案 1.99 美元。",
        },
      ];
}

function categoryCopy(category: GalleryCategory, locale: Locale): CategoryCopy {
  const n = category.designs.length;
  const t = (zh: string, en: string) => text(locale, zh, en);
  const makeYourOwn = (
    <>
      {t("想要的图案这里没有？用", "Want a design that is not here? Turn any picture into a stencil with the ")}
      <Link href={localizedPath(locale, "photoToStencil")}>{t("照片转模板工具", "photo to stencil maker")}</Link>
      {t("把任意图片做成模板，或者用", ", or print words with the ")}
      <Link href={localizedPath(locale, "letterStencils")}>{t("字母模板生成器", "letter stencil generator")}</Link>
      {category.id === "halloween"
        ? t("做 “BOO”“Happy Halloween” 字样。", " for “BOO” or “Happy Halloween”.")
        : t("做 “Merry Christmas”“Noel” 字样。", " for “Merry Christmas” or “Noel”.")}
    </>
  );
  const printing = t("打印时选“实际大小”或 100%，不要选“适合页面”。", "Print at Actual Size or 100%, not Fit to Page.");

  if (category.id === "halloween") {
    return {
      kicker: t("免费万圣节模板", "FREE HALLOWEEN STENCILS"),
      title: t("免费万圣节模板，打印就能刻", "Free Halloween stencils, ready to print and cut"),
      lead: t(
        `${n} 个免费万圣节镂空模板：南瓜脸、蝙蝠、黑猫、幽灵、骷髅、蜘蛛网、乌鸦和女巫。每个都已加好连接桥，刻完不会掉块。可以直接下载 PDF 打印，也可以一键放进模板工具改成南瓜、墙面或 T 恤需要的尺寸。`,
        `${n} free printable Halloween stencils: pumpkin faces, bats, black cats, ghosts, skulls, spider webs, ravens, and witches. Every design already has bridges, so nothing falls out when you cut it. Download the free PDF, or open any design in the stencil maker to resize it for your pumpkin, wall, window, or shirt.`,
      ),
      uses: [
        printing,
        t("黑色部分是要刻掉的地方；灰色只是参考线，不用刻。", "Black areas are cut out. Grey lines are only guides and are not cut."),
        t("南瓜用普通打印纸就行；要反复喷漆，用卡纸或 Mylar 膜；做 T 恤用冷冻纸熨上。", "Plain printer paper is fine for pumpkins. For repeated spray painting, use card stock or mylar; for shirts, cut freezer paper and iron it on."),
        makeYourOwn,
      ],
      faq: [
        ...sharedFaq(locale, n),
        locale === "en"
          ? {
              question: "How do I transfer a pumpkin stencil to a pumpkin?",
              answer: "Print at Actual Size, tape the sheet to the pumpkin, prick along the black shapes every few millimetres with a pin or poking tool, peel the paper off, and carve along the dots. Rubbing a little flour into the holes makes them easier to see.",
            }
          : {
              question: "南瓜模板怎么转到南瓜上？",
              answer: "按实际大小打印，把纸贴在南瓜上，用针沿黑色形状每隔几毫米扎一个孔，揭掉纸后沿着孔刻。往孔里抹一点面粉会更容易看清。",
            },
      ],
    };
  }

  return {
    kicker: t("免费圣诞模板", "FREE CHRISTMAS STENCILS"),
    title: t("免费圣诞模板，打印就能刻", "Free Christmas stencils, ready to print and cut"),
    lead: t(
      `${n} 个免费圣诞镂空模板：雪花、星星、圣诞树、彩球、驯鹿、雪人、姜饼人、圣诞袜和礼物。每个都已加好连接桥。下载 PDF 直接打印，或一键放进模板工具，改成窗户、木牌、贺卡或饼干需要的尺寸。`,
      `${n} free printable Christmas stencils: snowflakes, stars, Christmas trees, ornaments, reindeer, a snowman, a gingerbread man, stockings, and gifts. Every design already has bridges. Download the free PDF, or open any design in the stencil maker to size it for windows, wood signs, cards, or cookies.`,
    ),
    uses: [
      printing,
      t("黑色部分是要刻掉的地方，颜料从这里透过去。", "Black areas are cut out; that is where the paint goes through."),
      t("窗户和镜子用喷雪或玻璃颜料，事后能擦掉；木牌用丙烯颜料和海绵拍，薄拍几次边缘才干净。", "On windows and mirrors use snow spray or glass paint, which wipes off later. On wood signs, dab acrylic paint with a sponge in thin coats for clean edges."),
      t("要做很多张贺卡或礼物标签，用 Mylar 膜或塑料文件夹刻一张，可以反复用。", "Making a stack of cards or gift tags? Cut the stencil once from mylar or a plastic folder and reuse it."),
      makeYourOwn,
    ],
    faq: [
      ...sharedFaq(locale, n),
      locale === "en"
        ? {
            question: "How do I stencil snowflakes on a window?",
            answer: "Print the snowflake at the size you want, cut it from card or plastic, hold it flat against the glass with low-tack tape, and spray artificial snow or dab white glass paint in light layers. Lift the stencil straight off before it dries.",
          }
        : {
            question: "怎么在窗户上喷雪花？",
            answer: "按想要的大小打印雪花，用卡纸或塑料片刻好，用低黏胶带平贴在玻璃上，薄薄地喷几层人造雪或拍白色玻璃颜料，趁没干时垂直揭下模板。",
          },
    ],
  };
}

export function CategoryGalleryPage({ locale, category }: { locale: Locale; category: GalleryCategory }) {
  const copy = categoryCopy(category, locale);
  return (
    <>
      <GalleryJsonLd locale={locale} category={category} />
      <FaqJsonLd items={copy.faq} />
      <GuideShell locale={locale} route={category.route} kicker={copy.kicker} title={copy.title} lead={copy.lead}>
        <GallerySections locale={locale} category={category} />

        <section>
          <h2>{text(locale, "怎么用这些模板", "How to use these stencils")}</h2>
          <ul>
            {copy.uses.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{text(locale, "更多免费模板", "More free stencils")}</h2>
          <ul>
            {GALLERY_CATEGORIES.filter((other) => other.id !== category.id).map((other) => (
              <li key={other.id}>
                <Link href={localizedPath(locale, other.route)}>{locale === "en" ? other.label.en : other.label.zh}</Link>
                {text(locale, `：${other.blurb.zh}。`, `: ${other.blurb.en}.`)}
              </li>
            ))}
            <li>
              <Link href={localizedPath(locale, "freeStencils")}>{text(locale, "全部免费模板", "All free stencils")}</Link>
            </li>
          </ul>
        </section>

        <section>
          <h2>{text(locale, "常见问题", "Frequently asked questions")}</h2>
          {copy.faq.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </section>

        <GalleryCredits locale={locale} category={category} />
      </GuideShell>
    </>
  );
}

export function FreeStencilsHubPage({ locale }: { locale: Locale }) {
  const total = GALLERY_CATEGORIES.reduce((sum, category) => sum + category.designs.length, 0);
  const faq =
    locale === "en"
      ? [
          {
            question: "Are the stencils free to download?",
            answer: "Yes. Every design has a free PDF and PNG with no sign-up and no watermark. Only the cut-ready SVG for cutting machines is paid ($1.99 per design).",
          },
          {
            question: "Can I print a stencil at a custom size?",
            answer: "Yes. Click Resize / SVG under any design to open it in the stencil maker and enter the exact width. Large stencils are split across A4, A3, or Letter pages with alignment marks.",
          },
          {
            question: "Can I make a stencil from my own picture?",
            answer: "Yes. The photo to stencil maker turns any JPG or PNG into a black-and-white stencil with automatic bridges, right in your browser.",
          },
        ]
      : [
          {
            question: "这些模板可以免费下载吗？",
            answer: "可以。每个图案都有免费的 PDF 和 PNG，不用注册、没有水印。只有给刻字机用的 SVG 收费（每个 1.99 美元）。",
          },
          {
            question: "能按自己想要的尺寸打印吗？",
            answer: "能。点任意图案下面的“改尺寸 / SVG”，在模板工具里填宽度即可。大尺寸会自动分成 A4、A3 或 Letter 多页，带拼接标记。",
          },
          {
            question: "能用自己的图片做模板吗？",
            answer: "能。照片转模板工具可以把任意 JPG 或 PNG 变成带自动连接桥的黑白模板，全程在浏览器里完成。",
          },
        ];
  return (
    <>
      <FaqJsonLd items={faq} />
      <GuideShell
        locale={locale}
        route="freeStencils"
        kicker={text(locale, "免费模板", "FREE STENCILS")}
        title={text(locale, "免费可打印镂空模板", "Free printable stencils")}
        lead={text(
          locale,
          `${total} 个免费镂空模板，已加好连接桥，下载 PDF 就能打印、刻、喷。每个图案都能一键放进工具改尺寸，大图自动分页打印。`,
          `${total} free stencils with bridges already in place: download the PDF, print, cut, and paint. Any design can be opened in the stencil maker to print at the exact size you need, split across pages if it is large.`,
        )}
      >
        {GALLERY_CATEGORIES.map((category) => {
          const preview = category.groups.flatMap((group) => {
            const design = category.designs.find((item) => item.group === group.id);
            return design ? [{ group, design }] : [];
          });
          const label = locale === "en" ? category.label.en : category.label.zh;
          return (
            <section key={category.id}>
              <h2>
                <Link href={localizedPath(locale, category.route)}>{label}</Link>
              </h2>
              <p>
                {text(locale, `${category.blurb.zh}，`, `${category.blurb.en}: `)}
                <Link href={localizedPath(locale, category.route)}>
                  {text(locale, `查看全部 ${category.designs.length} 个 →`, `see all ${category.designs.length} →`)}
                </Link>
              </p>
              <div className="gallery-grid">
                {preview.map(({ group, design }) => (
                  <GalleryCard key={design.slug} locale={locale} design={design} group={group} />
                ))}
              </div>
            </section>
          );
        })}

        <section>
          <h2>{text(locale, "自己做模板", "Make your own stencil")}</h2>
          <ul>
            <li><Link href={localizedPath(locale, "photoToStencil")}>{text(locale, "照片转模板", "Photo to stencil maker")}</Link>{text(locale, "：任意图片转成带连接桥的模板。", ": any picture to a stencil with bridges.")}</li>
            <li><Link href={localizedPath(locale, "pumpkinStencil")}>{text(locale, "南瓜雕刻模板", "Pumpkin stencil maker")}</Link>{text(locale, "：照片做成南瓜雕刻图样。", ": turn a photo into a pumpkin carving pattern.")}</li>
            <li><Link href={localizedPath(locale, "letterStencils")}>{text(locale, "字母模板", "Letter stencils")}</Link>{text(locale, "：输入文字生成镂空字母。", ": type a word and print stencil letters.")}</li>
            <li><Link href={localizedPath(locale, "stencilGuide")}>{text(locale, "大型墙绘模板", "Large wall stencils")}</Link>{text(locale, "：按墙面真实尺寸分页打印。", ": print a mural stencil at full wall size.")}</li>
          </ul>
        </section>

        <section>
          <h2>{text(locale, "常见问题", "Frequently asked questions")}</h2>
          {faq.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </section>
      </GuideShell>
    </>
  );
}
