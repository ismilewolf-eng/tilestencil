import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "彩色玻璃图纸100%等比打印 | 线稿分页拼接工具 - TileStencil",
  description: "免费在线工具，将彩色玻璃(Stained Glass)与马赛克拼花图纸按真实物理尺寸(cm/in)分页打印，自动生成重叠对齐标记与十字裁切定位线，纯浏览器本地运行无需上传，确保玻璃裁切100%贴合铅条框架。",
  keywords: ["彩色玻璃图纸打印","stained glass pattern打印","玻璃拼花线稿等比打印","1:1图纸分页拼接","玻璃裁切定位标","came foil拼接图纸","马赛克拼花打印工具","线稿实际尺寸打印"],
  alternates: {
    canonical: "/zh/print-stained-glass-patterns",
    languages: languageAlternates("stainedGlassGuide"),
  },
  openGraph: {
    title: "彩色玻璃图纸100%等比打印 | 线稿分页拼接工具 - TileStencil",
    description: "免费在线工具，将彩色玻璃(Stained Glass)与马赛克拼花图纸按真实物理尺寸(cm/in)分页打印，自动生成重叠对齐标记与十字裁切定位线，纯浏览器本地运行无需上传，确保玻璃裁切100%贴合铅条框架。",
    url: "/zh/print-stained-glass-patterns",
  },
};

const howToSteps = [
  {
    "name": "上传彩色玻璃线稿",
    "text": "在浏览器中直接拖入你的 Cartoon 线稿图片(JPG/PNG)，图片不会上传到服务器，全部在本地处理，保护你的原创设计。"
  },
  {
    "name": "设置真实物理尺寸",
    "text": "输入成品玻璃嵌板的实际宽高(cm或in)，选择A4/Letter纸张，TileStencil 自动计算分页数量并生成带重叠区和十字定位标的多页布局。"
  },
  {
    "name": "打印并拼接裁切",
    "text": "关闭打印机的「适合页面」缩放，选择100%/实际尺寸打印，按十字标记裁边拼接成完整图纸，直接用于玻璃裁切或过灯箱描线。"
  }
];

const faqItems = [
  {
    "question": "打印出来的图纸真的是100%实际尺寸吗？如何验证？",
    "answer": "是的。TileStencil 在每页图纸上会打印一条标注厘米/英寸刻度的校准标尺(Calibration Ruler)。打印后用直尺量一下这条标尺，如果长度与标注完全一致，就说明打印机没有做任何缩放，整张图纸是真实物理尺寸。如果不一致，请检查打印设置中是否勾选了「适合页面」或「缩放至可打印区域」，务必选择「实际尺寸/100%/无缩放」。"
  },
  {
    "question": "多页拼接后边缘对不齐怎么办？",
    "answer": "TileStencil 会在每页边缘自动生成固定宽度的重叠区(默认可在设置中调整)，并打印十字裁切标记。正确做法是：沿外侧十字标记裁掉多余白边，保留重叠区域内侧，用重叠区里的十字标记作为两页对齐的基准点粘贴，而不是直接拼接纸张边缘，这样能抵消打印和裁剪产生的微小误差。"
  },
  {
    "question": "彩色的线稿图片需要先转黑白吗？工具能处理照片吗？",
    "answer": "不需要手动处理，TileStencil 内置高对比度黑白转换功能，会自动识别线条并去除底色、渐变和阴影，即使上传的是手绘照片或扫描件也能生成清晰的黑白线稿。如果原图线条较细或对比度低，建议在设置中调高对比度阈值，避免细节丢失导致裁切时看不清转角处的线条。"
  }
];

export default function StainedGlassZhPage() {
  return (
    <>
      <HowToJsonLd
        name="如何将彩色玻璃图纸100%等比分页打印"
        description="免费在线工具，将彩色玻璃(Stained Glass)与马赛克拼花图纸按真实物理尺寸(cm/in)分页打印，自动生成重叠对齐标记与十字裁切定位线，纯浏览器本地运行无需上传，确保玻璃裁切100%贴合铅条框架。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="stainedGlassGuide"
        kicker="彩色玻璃工艺 · 实际尺寸打印"
        title="彩色玻璃与拼花嵌板图纸，100%实际尺寸分页打印"
        lead="彩色玻璃(Stained Glass)裁切最怕的就是打印缩放。哪怕偏差1%，玻璃片也拼不进铅条(Came)或锡箔(Foil)框架。TileStencil 在浏览器本地把你的线稿(Cartoon)按厘米/英寸真实尺寸分页，自动加上重叠区和十字裁切定位标，A4/Letter打印机也能出大幅面精确图纸，全程不上传图片。"
      >
        <section>
          <h2>为什么普通打印会毁掉一整块玻璃</h2>
          <p>家用打印机默认按「适合页面」缩放，图纸看起来完整，但实际尺寸已经悄悄变了。玻璃是不可逆材料，裁多一毫米就整块报废，尤其是复杂拼花(Mosaic)图案里几十块玻璃要严丝合缝拼接，缩放误差会逐块累加。</p>
          <ul>
            <li>关闭浏览器/打印机的自动缩放，TileStencil 强制输出真实物理尺寸(100%/Actual Size)</li>
            <li>支持厘米(cm)与英寸(in)双单位切换，适配公制/英制打印机与量尺</li>
            <li>整张图纸自动分页平铺(Tiling)到多张A4/Letter，拼接后完全等比</li>
          </ul>
        </section>

        <section>
          <h2>高对比黑白线稿，省墨又清晰</h2>
          <p>彩色玻璃图纸最终是要透过灯箱或玻璃台描线裁切的，线条必须黑白分明、无灰阶噪点，才能在玻璃表面看清切割路径。</p>
          <ul>
            <li>一键转换为高对比度黑白线条，去除底色与阴影干扰</li>
            <li>省墨模式，大幅面图纸也不会印到没墨</li>
            <li>线条粗细可调，适配油性笔勾线或直接透玻璃描图</li>
          </ul>
        </section>

        <section>
          <h2>重叠对齐区 + 十字裁切标，拼接不跑偏</h2>
          <p>多页拼接最大的风险是「拼错格子」或「拼歪」。TileStencil 在每页边缘自动生成可见的重叠区域和十字定位标记，剪刀沿十字线对齐粘贴，整幅图纸严丝合缝。</p>
          <ul>
            <li>每页自动生成重叠边距，用透明胶带拼接时有冗余对齐空间</li>
            <li>十字裁切标记(Cross Marks)标出精确页边界，剪掉多余部分即可拼合</li>
            <li>支持预览整体拼接效果，打印前就能确认无形变</li>
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
          <p>需要制作木工线锯模板或皮具实体纸样？</p>
          <Link href="/zh/print-scroll-saw-patterns">查看木工线锯图纸1:1等比打印指南 →</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil，开始打印玻璃线稿
        </Link>
      </GuideShell>
    </>
  );
}
