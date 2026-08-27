import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "线锯木工图纸1:1等比打印 | 镂铣雕刻分页拼接工具 - TileStencil",
  description: "免费在线工具，将线锯(Scroll Saw)、镂铣(Routing)与木雕图纸按真实物理尺寸(cm/in)分页打印，黑白省墨线条零形变，直接喷胶贴板加工。纯浏览器本地运行，无需上传图片。",
  keywords: ["线锯图纸打印","scroll saw pattern打印","木工图纸等比打印","1:1图纸分页拼接","镂铣图纸打印","木雕图纸实际尺寸","喷胶贴图打印","省墨黑白图纸打印"],
  alternates: {
    canonical: "/zh/print-scroll-saw-patterns",
    languages: languageAlternates("scrollSawGuide"),
  },
  openGraph: {
    title: "线锯木工图纸1:1等比打印 | 镂铣雕刻分页拼接工具 - TileStencil",
    description: "免费在线工具，将线锯(Scroll Saw)、镂铣(Routing)与木雕图纸按真实物理尺寸(cm/in)分页打印，黑白省墨线条零形变，直接喷胶贴板加工。纯浏览器本地运行，无需上传图片。",
    url: "/zh/print-scroll-saw-patterns",
  },
};

const howToSteps = [
  {
    "name": "上传线锯/镂铣图纸",
    "text": "在浏览器中直接拖入图纸图片(JPG/PNG)，图片不会上传到服务器，全部在本地处理，方便使用自己设计或购买的付费图纸。"
  },
  {
    "name": "设置木料实际加工尺寸",
    "text": "输入成品的实际长宽(cm或in)，选择A4/Letter纸张，TileStencil 自动计算分页数量并生成带重叠区和十字定位标的多页布局。"
  },
  {
    "name": "打印、拼接后喷胶贴板",
    "text": "关闭打印机的「适合页面」缩放，选择100%/实际尺寸打印，按十字标记裁边拼接成完整图纸，喷胶贴在木料表面即可直接锯切或镂铣加工。"
  }
];

const faqItems = [
  {
    "question": "打印出来的木工图纸真的是1:1实际尺寸吗？",
    "answer": "是的。每页图纸上都会打印一条带厘米/英寸刻度的校准标尺(Calibration Ruler)，打印后用卷尺或直尺量一下这条标尺，长度一致就说明没有缩放。如果不一致，检查打印设置里是否开启了「适合页面」或「缩放至可打印区域」，务必手动选择「实际尺寸/100%/无缩放」再打印，否则下料尺寸会全部偏差。"
  },
  {
    "question": "喷胶贴板后图纸会不会因为纸张拼接而产生形变？",
    "answer": "不会。TileStencil 在每页边缘生成固定宽度的重叠区并标注十字裁切定位标，正确的拼接方式是沿外侧十字标记裁掉多余白边，用重叠区内的十字标记作为相邻页对齐基准粘贴，而不是直接对齐纸张边缘。这样可以抵消裁剪和打印本身的微小误差，保证拼接后长宽比例与原始设计一致，喷胶贴板后不会走样。"
  },
  {
    "question": "购买的付费线锯图纸(如PDF截图)能直接用吗？",
    "answer": "可以，只要能导出或截图为JPG/PNG格式即可上传使用。上传后TileStencil会自动进行黑白高对比度转换，去除底色和阴影干扰。需要注意的是，如果原始图纸本身带有比例尺信息，请以你手动输入的实际加工尺寸为准，上传的图片本身分辨率或DPI信息不会影响最终打印尺寸——TileStencil只按你设置的物理宽高和纸张类型计算分页与缩放。"
  }
];

export default function ScrollSawZhPage() {
  return (
    <>
      <HowToJsonLd
        name="如何将木工线锯图纸1:1等比分页打印"
        description="免费在线工具，将线锯(Scroll Saw)、镂铣(Routing)与木雕图纸按真实物理尺寸(cm/in)分页打印，黑白省墨线条零形变，直接喷胶贴板加工。纯浏览器本地运行，无需上传图片。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="scrollSawGuide"
        kicker="木工手作 · 实际尺寸打印"
        title="线锯与镂铣雕刻图纸，1:1实际尺寸分页打印"
        lead="线锯(Scroll Saw)和镂铣(Routing)加工前，图纸要直接喷胶贴在木料表面按线切割——任何形变或缩放误差都会让成品跑位、卡锯甚至报废木料。TileStencil 在浏览器本地把图纸按厘米/英寸真实尺寸分页输出，黑白省墨线条清晰不糊版，A4/Letter打印机也能出大幅面精确图纸，全程不上传图片。"
      >
        <section>
          <h2>为什么木工图纸必须绝对精确</h2>
          <p>木料一旦下刀就无法复原，图纸尺寸差1-2毫米，镶嵌件就装不进去，镂铣路径偏移可能直接切穿关键结构。普通打印的「自适应页面」缩放对纸张文档无伤大雅，但对下料图纸是致命的。</p>
          <ul>
            <li>TileStencil 强制100%/Actual Size输出，杜绝打印机自动缩放</li>
            <li>厘米(cm)/英寸(in)双单位切换，适配木工卷尺和数显卡尺</li>
            <li>大幅面图纸自动分页平铺，拼接后长宽误差趋近于零</li>
          </ul>
        </section>

        <section>
          <h2>黑白省墨线条，喷胶直接贴板作业</h2>
          <p>线锯与镂铣图纸大多是直接喷胶(Spray Adhesive)贴在木板表面锯切，油墨消耗大、线条易糊。清晰的黑白线条能让你在锯切时精准跟线，不会因为色块干扰视线。</p>
          <ul>
            <li>一键转换为高对比度黑白线条，去除底纹与灰阶，专为喷胶贴板设计</li>
            <li>省墨模式大幅降低多页图纸的墨水消耗</li>
            <li>线条粗细可调，适配细齿线锯的精细转角与镂铣大线条路径</li>
          </ul>
        </section>

        <section>
          <h2>零形变拼接，长宽尺寸绝对可信</h2>
          <p>多页图纸拼接最怕比例走样。TileStencil 保证每页之间的缩放比例完全一致，配合重叠对齐区和十字裁切定位标，拼出来的图纸和原始设计尺寸分毫不差，可以直接当作下料模板使用。</p>
          <ul>
            <li>每页自动生成重叠边距，拼接时留有对齐冗余，不会因裁剪误差累积变形</li>
            <li>十字裁切标记精确定位页边界，剪掉多余部分即可无缝拼合</li>
            <li>打印前可预览整体拼接效果，确认长宽比例与设计稿完全一致</li>
          </ul>
        </section>

        <section className="guide-faq">
          <h2>常见问题 (FAQ)</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </section>

        <aside className="guide-callout">
          <p>需要制作彩色玻璃镶嵌或马赛克拼花图纸？</p>
          <Link href="/zh/print-stained-glass-patterns">查看彩色玻璃线稿100%等比打印指南 →</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil，开始打印木工图纸
        </Link>
      </GuideShell>
    </>
  );
}
