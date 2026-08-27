import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { languageAlternates } from "@/lib/locale";

export const metadata: Metadata = {
  title: "大字横幅与活动标语分页打印：普通 A4 拼出大型标语",
  description:
    "将教室主题墙、生日派对横幅、展会标语或迎宾大字按长条比例拆分，导出带页码与裁切辅助线的 PDF，普通打印机轻松拼出数米长大字标语。",
  keywords: [
    "大字横幅打印",
    "标语分页打印",
    "A4拼接横幅",
    "教室主题墙大字",
    "生日横幅打印",
    "超长大字打印PDF",
  ],
  alternates: {
    canonical: "/zh/print-banner-letters",
    languages: languageAlternates("bannerGuide"),
  },
  openGraph: {
    title: "大字横幅与活动标语分页打印：普通 A4 拼出大型标语",
    description: "用普通打印纸拼接数米长的超大标语与活动横幅，带完整网格排版与接缝重叠。",
    url: "/zh/print-banner-letters",
  },
};

const howToSteps = [
  {
    name: "准备标语图片与测量悬挂空间",
    text: "将设计好的文字或横幅保存为 JPG/PNG，测量黑板、舞台或背景墙的实际安装长度（如 200cm）。",
  },
  {
    name: "选择横向纸张与设置拼接余量",
    text: "宽幅横幅通常推荐选择 A4 横向（Landscape），设置 8~10mm 的相邻页重叠量便于胶带贴合。",
  },
  {
    name: "导出 PDF 并按顺序横向拼接",
    text: "打印后按 A1、A2、A3 顺序沿虚线裁掉单边白边，快速串联拼出整幅长条大字标语。",
  },
];

const faqItems = [
  {
    question: "横幅很长但高度不高，应该选横向还是纵向纸张？",
    answer: "对于长条形横幅（如高 30cm、长 200cm），推荐选择 A4 横向（Landscape）。这样可以用最少的纸张张数覆盖长度，减少垂直拼缝数量，拼装起来更快更平整。",
  },
  {
    question: "怎样避免拼接处文字笔画出现断层或错位？",
    answer: "在 TileStencil 中设置 8mm 左右的重叠量（Overlap）。拼接时仅裁掉右边纸张的左白边，将文字笔画重叠压在左边纸张的对准线上，就能保证笔画平滑连贯无缝隙。",
  },
  {
    question: "如果打印出来的横幅太长，怎么快速理清顺序？",
    answer: "导出的 PDF 每页顶部和角落都自动印有网格坐标（如 A1 代表第 1 行第 1 张，A2 为第 1 行第 2 张）。在桌面上按字母和数字顺序排开即可快速理清拼装顺序。",
  },
];

export default function PrintBannerLettersPage() {
  return (
    <>
      <HowToJsonLd
        name="如何用普通打印机分页打印大字横幅与活动标语"
        description="将超长宽幅标语图片按真实米数比例分拆到 A4 纸张，打印后顺畅拼装成活动大字横幅。"
        steps={howToSteps}
      />
      <FaqJsonLd items={faqItems} />
      <GuideShell
        locale="zh-CN"
        route="bannerGuide"
        kicker="活动标语与横幅"
        title="大字标语与横幅分页打印，A4 拼出几米长巨幅文字。"
        lead="举办派对、学校班级布置、店面促销或临时展会时，用普通打印机就能把几个字或整句口号放大拼成长幅标语。"
      >
        <section>
          <h2>告别手绘大字：家用打印机制作专业横幅</h2>
          <p>
            无论是用 Photoshop、Canva 还是画图制作的标语图片，只需知道最终需要多宽（例如 1.5 米或 3 米），TileStencil 会自动根据纸张尺寸计算需要切成多少张 A4 纸横向相连。
          </p>
          <ul>
            <li>学校 & 幼儿园：节日黑板报、教室主题墙、迎新大字横幅。</li>
            <li>生日 & 派对：“HAPPY BIRTHDAY” 等超大个性化字母条幅。</li>
            <li>市集 & 门店：新品开业、节日打折临时招牌与指引标语。</li>
            <li>舞台 & 背景：发布会、团建活动背景墙大幅文字拼贴。</li>
          </ul>
        </section>

        <section>
          <h2>横幅大字打印三步流程</h2>
          <ol>
            <li><strong>确定总长度：</strong>输入横幅预期的总宽度（如 240 cm），开启等比例缩放，系统会自动计算高度与页数。</li>
            <li><strong>选横向 A4：</strong>长条标语选择 Landscape 横向纸张，通常 1 行 6~8 页即可完成整条长幅。</li>
            <li><strong>裁切单边：</strong>每页只裁掉右侧白边，压在下一页的重叠线上粘贴，十分钟即可完成整条横幅组装。</li>
          </ol>
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
          <p>需要制作等比例实体手作纸格或木工图纸？</p>
          <Link href="/zh/print-pattern-actual-size">查看纸样 1:1 等比例打印指南 →</Link>
        </aside>

        <Link className="guide-cta" href="/zh">
          打开 TileStencil，开始打印大字横幅
        </Link>
      </GuideShell>
    </>
  );
}
