import type { Locale } from "@/lib/locale";
import { SITE_URL } from "@/lib/site";

export function WebApplicationJsonLd({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TileStencil",
    alternateName: isEn ? ["Tile Stencil", "Tile Print Tool", "Multi-Page Poster Printer"] : ["图片分页打印工具", "A4拼接海报生成器"],
    url: isEn ? SITE_URL : `${SITE_URL}/zh`,
    applicationCategory: "DesignApplication",
    applicationSubCategory: "Printing & Imaging",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript. Requires HTML5 Canvas.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description: isEn
      ? "Free browser-based multi-page poster and stencil printer. Split JPG and PNG images across multiple A4, A3, or US Letter pages at 100% actual physical size with alignment marks and tile overlap."
      : "在浏览器本地把 JPG 或 PNG 按真实尺寸拆成 A4、A3 或 US Letter 多页 PDF，带页码、裁切标记和拼接提示。图片不会上传。",
    featureList: isEn
      ? [
          "Browser-local client-side image processing",
          "Custom physical size in cm or in",
          "A4, A3, and US Letter paper with margins and overlap",
          "Original, Grayscale, and Black-and-white template modes",
          "Download multi-page PDF ready for tiling and assembly",
          "Zero upload privacy guarantee",
          "100% actual scale print alignment markers",
        ]
      : [
          "浏览器本地离线处理图片，不上传服务器",
          "支持厘米(cm)与英寸(in)真实尺寸设定",
          "支持 A4、A3、US Letter 纸张规格与边距重叠微调",
          "原图、灰度、高对比黑白描摹模板三种渲染模式",
          "一键导出带定位裁切标记与页码的多页拼接 PDF",
          "绝不上传图片保障隐私",
          "100% 实际大小对齐辅助线",
        ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd({ locale }: { locale: Locale }) {
  const isEn = locale === "en";
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TileStencil",
    url: isEn ? SITE_URL : `${SITE_URL}/zh`,
    inLanguage: isEn ? "en-US" : "zh-CN",
    description: isEn
      ? "Free online multi-page poster and stencil printing tool for A4, A3, and Letter sheets."
      : "免费在线大图分页打印与 1:1 物理尺寸拼接工具。",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export type HowToStep = {
  name: string;
  text: string;
};

export function HowToJsonLd({
  name,
  description,
  steps,
}: {
  name: string;
  description: string;
  steps: HowToStep[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
