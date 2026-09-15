import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Blockposters 免费替代工具 | 无水印、无分页限制的大图拼接打印",
  description:
    "寻找好用的 Blockposters 替代软件？TileStencil 免费将大幅照片与海报切片为多张 A4、A3 或 Letter 纸张打印，无页数限制、无水印、无需注册充值。纯本地浏览器运行，保护照片隐私。",
  keywords: [
    "Blockposters替代",
    "A4拼接海报生成器",
    "大图分页打印软件",
    "多张A4纸拼海报免水印",
    "免费海报切片打印",
    "照片切成多页打印",
  ],
  alternates: {
    canonical: "/zh/blockposters-alternative",
    languages: languageAlternates("blockpostersAlternative"),
  },
  openGraph: {
    title: "Blockposters 免费替代工具 | 无水印、无分页限制的大图拼接打印",
    description: "突破 Blockposters 7页限制与水印困扰，本地免上传生成高质量多页拼接 PDF。",
    url: "/zh/blockposters-alternative",
  },
};

const howToSteps = [
  {
    name: "上传本地图片",
    text: "选择任意 JPG 或 PNG 格式照片。纯浏览器内存计算，绝不将照片上传至任何外部服务器。",
  },
  {
    name: "设置真实毫米级物理尺寸",
    text: "直接输入成品的最终长宽（厘米 cm 或英寸 in），TileStencil 会严格等比例运算，防止画面变形。",
  },
  {
    name: "调整纸张与边缘重叠辅助线",
    text: "支持 A4、A3 与 US Letter，可自由设置打印边距及 5~10mm 的相邻重叠区，拼接时无需悬空粘贴。",
  },
  {
    name: "导出多页 PDF 并按 100% 打印",
    text: "一键生成含裁切十字标记与网格坐标的 PDF。打印时选择'实际大小'或 100% 比例即可完美拼版。",
  },
];

const faqItems = [
  {
    question: "为什么大家需要寻找 Blockposters 的替代品？",
    answer:
      "Blockposters 免费版仅支持有限分辨率，且限制最多切片 7 张纸，超过需支付 5 美元解锁，同时需要将图片上传到国外服务器。TileStencil 彻底打破限制：无页数上限、无任何水印、完全免费开源、纯本地离线运行保护隐私。",
  },
  {
    question: "打印出的拼接海报会有 TileStencil 的 Logo 或水印吗？",
    answer:
      "完全不会。TileStencil 生成的 PDF 页面仅在不可避免的装订边距处包含极简的定位十字线和网格坐标（如 A1、A2），画面本身 100% 纯净，没有任何商业广告或水印。",
  },
  {
    question: "最大支持切多少张纸？",
    answer:
      "系统没有硬性页数限制。无论是拼成 4 张的小幅海报，还是拼接数十张纸的舞台背景长横幅，TileStencil 都能在你的电脑端高效完成几何拆解与 PDF 编译。",
  },
];

export default function BlockpostersAlternativeZhPage() {
  return (
    <>
      <HowToJsonLd
        name="如何免受 Blockposters 限制拼接打印大幅海报"
        description="使用 TileStencil 免费无水印将任意大图切片打印到多张 A4 纸的分步教程。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="blockpostersAlternative"
        kicker="BLOCKPOSTERS 替代"
        title="无页数限制、无水印、纯本地的大图拼接打印工具。"
        lead="寻找新一代 Blockposters 替代方案？TileStencil 支持将任意照片、插画或设计图精确切片至多张 A4、A3 或 Letter 纸张，毫米级尺寸控制，零水印，不上传服务器，全流程免费。"
      >
        <section>
          <h2>TileStencil 与 Blockposters 核心特性对比</h2>
          <p>
            Blockposters 曾是很多人的海报启蒙工具，但现在的付费墙、页数限制与隐私顾虑让很多创作者转向 TileStencil：
          </p>
          <ul>
            <li><strong>解除 7 页限制：</strong>轻松输出几十张纸拼成的大型展板或墙绘，没有任何人为限制。</li>
            <li><strong>100% 零水印：</strong>画面纯净无杂质，仅保留必要的拼接坐标标记。</li>
            <li><strong>完全免费与本地隐私：</strong>基于 MIT 开源协议构建，图片不离开你的设备。</li>
            <li><strong>直观物理尺寸输入：</strong>直接按厘米（cm）输入期望成品大小，无需盲猜排版张数。</li>
          </ul>
        </section>

        <section className="guide-faq">
          <h2>常见问题解答 (FAQ)</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </section>

        <aside className="guide-callout">
          <p>需要制作手工皮具或 1:1 纸样？</p>
          <Link href="/zh/print-pattern-actual-size">查看 1:1 实尺纸样打印指南 &rarr;</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil 开始制作
        </Link>
      </GuideShell>
    </>
  );
}

