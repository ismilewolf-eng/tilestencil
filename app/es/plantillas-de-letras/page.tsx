import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("es", "letterStencils", {
  title: "Plantillas de Letras para Imprimir en Cualquier Tamaño (Gratis)",
  description:
    "Escribe la palabra e imprime plantillas de letras grandes al tamaño exacto, de 5 cm a más de 1 metro, divididas en hojas tamaño carta o A4. Tres tipografías de stencil, gratis y sin registro.",
  keywords: [
    "plantillas de letras para imprimir",
    "letras grandes para imprimir",
    "moldes de letras para imprimir",
    "letras para recortar",
    "plantillas de números",
    "letras stencil",
  ],
});

const howToSteps = [
  { name: "Escribe el texto", text: "Una palabra, un nombre, el número de la casa o una frase corta. Usa Enter para cambiar de línea." },
  { name: "Elige la tipografía", text: "Hay tres tipografías de stencil, ya con los puentes que sostienen el centro de letras como A, B, O y 8." },
  { name: "Escribe el tamaño final", text: "El ancho total que debe tener el texto. Si es más grande que una hoja, se divide en varias." },
  { name: "Imprime, pega y recorta", text: "Imprime en Tamaño real (100%), pega las hojas siguiendo los códigos y recorta las letras." },
];

const faqItems = [
  {
    question: "¿Cómo imprimo letras grandes?",
    answer:
      "Escribe el texto en esta página, elige la tipografía y pon el ancho total, por ejemplo 90 cm para un letrero. El PDF divide las letras en hojas tamaño carta o A4 con marcas de corte. Imprime en Tamaño real (100%) y pega las hojas.",
  },
  {
    question: "¿Por qué las letras tienen cortes?",
    answer:
      "Son los puentes del stencil. Letras como A, B, D, O, P y R y los números 0, 4, 6, 8 y 9 tienen el centro cerrado; sin puentes, ese centro se caería al recortar. Si vas a recortar la letra completa en foami o cartulina de color, simplemente ignora los cortes.",
  },
  {
    question: "¿Funciona con acentos y ñ?",
    answer: "Sí. Las tres tipografías tienen las letras con acento (á, é, í, ó, ú, ü) y la ñ, así que puedes escribir nombres como SOFÍA o MUÑOZ.",
  },
  {
    question: "¿Tengo que imprimir todo el abecedario?",
    answer: "No. Escribes solo las letras que vas a usar y salen ya espaciadas y al tamaño correcto.",
  },
  {
    question: "¿Puedo usarlas para vender letreros y productos?",
    answer: "Sí. Las tipografías tienen licencia SIL Open Font License, que permite el uso comercial. El texto no sale de tu navegador.",
  },
  {
    question: "¿Se pueden exportar para Cricut o Silhouette?",
    answer: "Sí, con el SVG, que trae los trazos de corte y los puentes. Cuesta US$1.99 por diseño; el PDF sigue siendo gratis.",
  },
];

export default function SpanishLetterStencilsPage() {
  return (
    <StencilLanding
      locale="es"
      route="letterStencils"
      source="text"
      intro={{
        eyebrow: "PLANTILLAS DE LETRAS",
        heading: "Escribe la palabra e imprime la plantilla de letras al tamaño exacto.",
        copy: "Elige una tipografía de stencil, escribe el ancho final y descarga un PDF que divide las letras grandes en hojas tamaño carta, A4 o A3. Gratis, sin registro.",
      }}
      defaults={{ renderMode: "template", widthCm: 60, heightCm: 20, paperSize: "letter" }}
      howToName="Cómo imprimir plantillas de letras grandes en casa"
      howToDescription="Genera plantillas de letras en cualquier tamaño e imprímelas en varias hojas a tamaño real."
      howToSteps={howToSteps}
      quick={{
        heading: "Plantillas de letras en cualquier tamaño, sin descargar todo el abecedario",
        paragraphs: [
          <>
            Escribe la palabra arriba, elige la tipografía y pon el ancho total (por ejemplo, 90 cm). El PDF sale con las letras ya
            espaciadas y divididas en hojas tamaño carta. Imprime en <strong>Tamaño real / 100%</strong>, pega las hojas y recorta.
            Es gratis.
          </>,
        ],
      }}
      sections={[
        {
          heading: "Para qué sirve",
          items: [
            "Nombres para fiestas, mamparas y periódicos murales",
            "Número de la casa y nombre en el buzón",
            "Letreros de madera para negocio, rancho o jardín",
            "Rotulación en paredes, bardas, cajas y cajones de estacionamiento",
          ],
        },
        {
          heading: "Consejos para pintar con la plantilla",
          items: [
            "Fija la plantilla con cinta masking o pegamento en aerosol para que la pintura no se corra por debajo.",
            "Aplica la pintura a golpecitos con esponja o brocha de stencil; no la arrastres de lado.",
            "Retira la plantilla con la pintura todavía un poco húmeda para que el borde quede limpio.",
            <>
              ¿Quieres un dibujo o una foto en vez de letras? Usa el <Link href={localizedPath("es", "photoToStencil")}>stencil de una foto</Link>.
            </>,
          ],
        },
      ]}
      faqItems={faqItems}
    />
  );
}
