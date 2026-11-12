import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { LabelMakerApp } from "@/components/LabelMakerApp";
import { QuickAnswer } from "@/components/QuickAnswer";
import { languageAlternates, localizedPath } from "@/lib/locale";

// 2026-11-12: "avery 5160 template" 27,100/mo, "print address labels" 8,100, "avery 8160 template" 5,400,
// "avery 5163 template" 4,400, "address label template" 2,900 (US). First page: the label maker's own
// pages and Google Docs add-ons that charge by the year; no paste-and-print web tool.
const TITLE = "Address Label Template for Avery 5160, 8160 & 5163 – Paste a List, Print";
const DESCRIPTION =
  "Free address label template: paste your addresses or spreadsheet rows and download a PDF aligned to Avery 5160, 8160, 5161, 5163, 5167 or A4 L7160 sheets. No mail merge.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "address label template",
    "avery 5160 template",
    "avery 8160 template",
    "avery 5163 template",
    "print address labels",
    "address labels from excel",
    "christmas card address labels",
    "return address label template",
  ],
  alternates: { canonical: "/address-label-template", languages: languageAlternates("addressLabels") },
  openGraph: { locale: "en_US", title: TITLE, description: DESCRIPTION, url: "/address-label-template" },
};

const howToSteps = [
  { name: "Paste your addresses", text: "Type or paste the addresses with a blank line between them, or copy the rows from Excel or Google Sheets and paste them in. Each row becomes one label." },
  { name: "Pick your label sheet", text: "Choose the sheet you bought, for example Avery 5160 or 8160 (30 labels, 1 × 2-5/8 in). The number is printed on the pack." },
  { name: "Print a test page on plain paper", text: "Download the test page with label outlines, print it at 100% and hold it against a label sheet up to the light. If it is off, nudge it by a millimetre or two." },
  { name: "Print the labels", text: "Download the labels PDF, load the label sheets the way your printer feeds them, and print at 100% or Actual Size." },
];

const faqItems = [
  {
    question: "What size is an Avery 5160 label?",
    answer:
      "Avery 5160 labels are 1 inch tall and 2-5/8 inches wide, 30 to a US Letter sheet in 3 columns of 10. The sheet has a 1/2 inch margin at the top and bottom and 3/16 inch at the sides, with 1/8 inch between columns. Avery 8160, 5260 and 8460 use the same layout, so one template fits all of them.",
  },
  {
    question: "How do I print address labels from Excel or Google Sheets?",
    answer:
      "Select the rows with your addresses, copy them, and paste them into the Addresses box on this page. Each row becomes one label, and a city, state and ZIP in separate columns are put back on one line. You can also save the sheet as a CSV file and open it here. There is no mail merge to set up.",
  },
  {
    question: "Why do my labels print out of line?",
    answer:
      "Almost always because the printer scaled the page. Print at 100% or Actual Size, never Fit to page. If the text is still off by the same amount on every label, your printer feeds the sheet slightly off; use Move right and Move down to shift everything by up to 5 mm, and check with the test page before using a label sheet.",
  },
  {
    question: "Can I use a sheet that already has some labels peeled off?",
    answer:
      "Yes. Open the option for a partly used sheet and enter how many labels are already gone, counting left to right from the top. Printing starts at the next label.",
  },
  {
    question: "Is it free?",
    answer:
      "Up to 30 labels at a time are free, with no sign-up and no watermark, and you can run it as often as you like. For a longer list, the full PDF is a one-time $2.99, which covers the tool for 7 days so you can fix a typo and print again.",
  },
  {
    question: "Are my addresses uploaded anywhere?",
    answer: "No. The list is read and the PDF is made inside your browser. Nothing you paste or open is sent to a server.",
  },
];

export default function AddressLabelTemplatePage() {
  return (
    <>
      <HowToJsonLd name="How to print address labels from a list" description="Paste a list of addresses, choose the label sheet, test on plain paper, then print." steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <LabelMakerApp>
        <article className="app-guide">
          <QuickAnswer heading="Address label template">
            <p>
              Paste a list of addresses and this page lays them out on a standard label sheet as a PDF. It fits Avery 5160 and 8160 (30 per sheet),
              5161 (20), 5163 (10), 5167 return-address labels (80) and A4 L7160 and L7163 sheets.
            </p>
            <p>
              Up to 30 labels at a time are free. A longer list is $2.99 once. For example, 75 Christmas card addresses copied from a spreadsheet
              become three sheets of 5160 labels in about a minute.
            </p>
          </QuickAnswer>

          <section>
            <h2>How to print address labels</h2>
            <ol>
              {howToSteps.map((step) => (
                <li key={step.name}>
                  <b>{step.name}.</b> {step.text}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2>Label sheets this template fits</h2>
            <ul>
              <li>
                <b>1 × 2-5/8 in, 30 per sheet:</b> Avery 5160, 5260, 8160, 8460. The usual address label.
              </li>
              <li>
                <b>1 × 4 in, 20 per sheet:</b> Avery 5161, 5261, 8161. Room for long names and company lines.
              </li>
              <li>
                <b>2 × 4 in, 10 per sheet:</b> Avery 5163, 5263, 8163. Shipping labels.
              </li>
              <li>
                <b>1/2 × 1-3/4 in, 80 per sheet:</b> Avery 5167, 5267, 8167. Return address labels; keep to three short lines.
              </li>
              <li>
                <b>A4:</b> L7160 and J8160 (63.5 × 38.1 mm, 21 per sheet), L7163 and J8163 (99.1 × 38.1 mm, 14 per sheet).
              </li>
            </ul>
            <p>Store-brand sheets that say &quot;same size as 5160&quot; on the pack use the same layout.</p>
          </section>

          <section>
            <h2>Tips for a clean print</h2>
            <ul>
              <li>Fan the label sheets before loading them and feed a few at a time, so they do not stick together.</li>
              <li>Laser sheets and inkjet sheets are different. Use the kind made for your printer or the ink will smear.</li>
              <li>Choose Centered for invitations and Left for everyday mail; long lines shrink on their own to stay inside the label.</li>
            </ul>
            <p>
              Printing something bigger than a sheet? See <Link href={localizedPath("en", "posterGuide")}>how to print an image across several pages</Link>.
            </p>
          </section>

          <h2>Frequently asked questions</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
          <p className="list-fits">
            Avery and its product numbers are trademarks of Avery Products Corporation. TileStencil is not affiliated with Avery; the numbers are used
            only to say which sheet layouts this template matches.
          </p>
        </article>
      </LabelMakerApp>
    </>
  );
}
