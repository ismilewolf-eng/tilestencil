import type { Metadata } from "next";
import Link from "next/link";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { QuickAnswer } from "@/components/QuickAnswer";
import { RaffleTicketApp } from "@/components/RaffleTicketApp";
import { languageAlternates, localizedPath } from "@/lib/locale";

// 2026-11-12: "printable raffle tickets" 3,600/mo, "ticket template" 3,600, "raffle ticket template" 2,400,
// "raffle tickets template word" 2,400 (US). First page is blank templates (Canva, Adobe, Pinterest);
// none of them numbers the tickets.
const TITLE = "Printable Raffle Tickets – Free Numbered Raffle Ticket Template (PDF)";
const DESCRIPTION =
  "Free raffle ticket template that numbers every ticket for you. Add your event, choose how many, and print 8 per sheet with tear-off stubs on US Letter or A4.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "raffle ticket template",
    "printable raffle tickets",
    "numbered raffle tickets",
    "free printable raffle tickets",
    "raffle tickets template word",
    "raffle ticket maker",
    "ticket template",
  ],
  alternates: { canonical: "/raffle-ticket-template", languages: languageAlternates("raffleTickets") },
  openGraph: { locale: "en_US", title: TITLE, description: DESCRIPTION, url: "/raffle-ticket-template" },
};

const howToSteps = [
  { name: "Fill in the event", text: "Type the raffle name, the prize, and the date and place of the drawing. Add a price such as $5 each if you want it on the ticket." },
  { name: "Set the numbers", text: "Enter how many tickets you need and the first number. Every ticket and its stub get the same number, in order." },
  { name: "Print on card stock", text: "Download the PDF and print it at 100% (Actual Size) on card stock or heavy paper. There are eight tickets on each sheet." },
  { name: "Cut and crease", text: "Cut along the dashed lines with a paper trimmer. Fold each ticket on the dotted line so the stub tears off cleanly, or run a perforating wheel along it." },
];

const faqItems = [
  {
    question: "How do I number raffle tickets without typing each one?",
    answer:
      "Enter the first number and how many tickets you need. The template prints a different number on every ticket and repeats it on that ticket's stub, so you never set up a mail merge or type numbers by hand. Numbers are padded with zeros (001, 002) so they sort and read cleanly.",
  },
  {
    question: "How many raffle tickets fit on a page?",
    answer: "Eight: two across and four down, on US Letter or A4. Each ticket is about 4 inches wide and 2.6 inches tall, with a stub for the buyer's name and phone number on the left. 200 tickets take 25 sheets.",
  },
  {
    question: "What should be printed on a raffle ticket?",
    answer:
      "The name of the organization or event, the prize, the date and place of the drawing, the price, and a ticket number that also appears on the stub. The stub needs room for the buyer's name and a phone number or email so you can reach the winner. Some places require more, such as a licence number; add it to the details line.",
  },
  {
    question: "Do raffle tickets have to be numbered?",
    answer:
      "Numbering is how you match the winning ticket to its stub. Rules for raffles differ from place to place and some call for consecutively numbered tickets, so check with your state or local gaming authority before you sell tickets.",
  },
  {
    question: "Can I print a second batch later?",
    answer: "Yes. Set First number to the one after your last ticket. If the first batch ended at 200, start the next at 201 and the numbers carry on with no repeats.",
  },
  {
    question: "Is it free?",
    answer:
      "Up to 100 tickets at a time are free, with no sign-up and no watermark. For a bigger run, the full PDF is a one-time $2.99, which covers the tool for 7 days so you can change the details and print again.",
  },
];

export default function RaffleTicketTemplatePage() {
  return (
    <>
      <HowToJsonLd name="How to make numbered raffle tickets" description="Fill in the event, set the numbers, print on card stock and cut." steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <RaffleTicketApp>
        <article className="app-guide">
          <QuickAnswer heading="Printable raffle tickets, already numbered">
            <p>
              This raffle ticket template prints eight tickets to a sheet, each with a tear-off stub, and puts a different number on every ticket. You
              type the event details once and choose how many tickets you need.
            </p>
            <p>
              Up to 100 tickets at a time are free. A bigger run is $2.99 once. For example, a school raffle with 500 tickets numbered 001 to 500 is
              one PDF of 63 sheets.
            </p>
          </QuickAnswer>

          <section>
            <h2>How to make the tickets</h2>
            <ol>
              {howToSteps.map((step) => (
                <li key={step.name}>
                  <b>{step.name}.</b> {step.text}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2>Paper, cutting and tearing</h2>
            <ul>
              <li>
                <b>Paper:</b> 65 lb card stock feeds through most home printers and feels like a real ticket. Coloured card makes copies harder to fake.
              </li>
              <li>
                <b>Cutting:</b> stack three or four sheets and cut them together on a paper trimmer. The tickets share edges, so each cut finishes two rows.
              </li>
              <li>
                <b>Stubs:</b> a rotary perforating blade (sold for paper trimmers) makes the stub tear off cleanly. Without one, fold on the dotted line
                and tear, or simply cut the stub off when the ticket is sold.
              </li>
              <li>
                <b>Books:</b> staple the stub ends of 10 tickets together to hand sellers a book they can account for.
              </li>
            </ul>
            <p>
              Need a big sign for the raffle table? <Link href={localizedPath("en", "bannerGuide")}>Print banner letters</Link> across several sheets.
            </p>
          </section>

          <h2>Frequently asked questions</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </article>
      </RaffleTicketApp>
    </>
  );
}
