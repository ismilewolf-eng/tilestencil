import type { ReactNode } from "react";
import { FaqJsonLd, HowToJsonLd } from "@/components/JsonLd";
import { TileStencilApp, type AppDefaults, type AppIntro } from "@/components/TileStencilApp";
import { StencilExampleSection } from "@/components/StencilExample";
import type { ExampleKey } from "@/lib/examples";
import type { Locale } from "@/lib/locale";

export type LandingSection = { heading: string; body?: ReactNode; items?: ReactNode[] };
export type FaqItem = { question: string; answer: string };

/** A use-case landing page: the stencil tool on top, then guidance specific to that craft. */
export function StencilLanding({
  locale,
  intro,
  defaults,
  howToName,
  howToDescription,
  howToSteps,
  sections,
  faqItems,
  example,
}: {
  locale: Locale;
  intro: AppIntro;
  defaults: AppDefaults;
  howToName: string;
  howToDescription: string;
  howToSteps: Array<{ name: string; text: string }>;
  sections: LandingSection[];
  faqItems: FaqItem[];
  example?: ExampleKey;
}) {
  return (
    <>
      <HowToJsonLd name={howToName} description={howToDescription} steps={howToSteps} />
      <FaqJsonLd items={faqItems} />
      <TileStencilApp locale={locale} intro={intro} defaults={defaults}>
        <article className="app-guide">
          {example ? <StencilExampleSection locale={locale} name={example} /> : null}
          {sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body ? <p>{section.body}</p> : null}
              {section.items ? (
                <ul>
                  {section.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          <h2>{locale === "en" ? "Frequently asked questions" : "常见问题"}</h2>
          {faqItems.map((item) => (
            <div className="guide-faq-item" key={item.question}>
              <h3 className="guide-faq-question">{item.question}</h3>
              <p className="guide-faq-answer">{item.answer}</p>
            </div>
          ))}
        </article>
      </TileStencilApp>
    </>
  );
}
