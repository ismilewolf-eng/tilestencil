import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("es", "rasterbatorAlternative", {
  title: "Alternativa a Rasterbator en Español: Póster en Varias Hojas sin Puntitos",
  description:
    "¿Quieres un póster gigante como con Rasterbator, pero con la foto nítida? Divide la imagen en varias hojas al tamaño exacto en centímetros, sin convertirla en puntitos. Gratis, en español y sin subir la imagen.",
  keywords: ["rasterbator", "rasterbator en español", "rasterbator online", "alternativa a rasterbator", "rasterbator gratis"],
});

const howToSteps = [
  { name: "Elige la imagen", text: "Selecciona un JPG o PNG. La foto conserva sus píxeles originales: nada se convierte en puntitos." },
  { name: "Define el tamaño en centímetros", text: "Escribe el ancho o el alto final del mural. Se mantiene la proporción." },
  { name: "Elige el papel y descarga el PDF", text: "Tamaño carta, A4 o A3. Cada hoja sale numerada, con marcas de corte y traslape." },
  { name: "Imprime a tamaño real y arma", text: "Imprime en Tamaño real (100%) y pega las hojas siguiendo los códigos de la cuadrícula." },
];

const faqItems = [
  {
    question: "¿Esta herramienta es Rasterbator?",
    answer:
      "No. TileStencil es una herramienta independiente que hace el mismo trabajo de dividir una imagen en varias hojas, pero sin el efecto de puntitos (rasterizado). El Rasterbator original sigue en rasterbator.net.",
  },
  {
    question: "¿Qué cambia respecto a Rasterbator?",
    answer:
      "Rasterbator es famoso por convertir la foto en puntitos de distintos tamaños que de lejos forman la imagen. Aquí la foto queda tal cual, nítida, y tú defines el tamaño final exacto en centímetros. Si lo que quieres es justo ese efecto de puntitos, Rasterbator es la herramienta indicada.",
  },
  {
    question: "¿Hay que descargar algún programa?",
    answer: "No. Todo funciona en el navegador, también en el celular. La imagen no se sube a ningún servidor.",
  },
  {
    question: "¿Es gratis?",
    answer:
      "Sí. Dividir la imagen y descargar el PDF es gratis, sin registro, sin marca de agua y sin límite de hojas. Solo el SVG para máquinas de corte cuesta US$1.99 por imagen.",
  },
  {
    question: "¿Cuántas hojas lleva un mural de 1 metro?",
    answer:
      "Un mural de 100 × 70 cm en hojas tamaño carta horizontales, con margen de 8 mm y traslape de 5 mm, lleva 16 hojas (4 × 4). La herramienta te muestra el número exacto para tu tamaño antes de descargar.",
  },
];

export default function SpanishRasterbatorPage() {
  return (
    <StencilLanding
      locale="es"
      route="rasterbatorAlternative"
      intro={{
        eyebrow: "ALTERNATIVA A RASTERBATOR",
        heading: "Un póster gigante en varias hojas, como con Rasterbator, pero con la foto nítida.",
        copy: "Divide la imagen en varias hojas al tamaño exacto en centímetros, sin convertirla en puntitos. Gratis, en español, y la imagen no sale de tu navegador.",
      }}
      defaults={{ widthCm: 100, heightCm: 70, paperSize: "letter" }}
      howToName="Cómo hacer un póster en varias hojas sin el efecto de puntitos"
      howToDescription="Divide una foto en varias hojas a tamaño real, manteniendo la imagen nítida."
      howToSteps={howToSteps}
      quick={{
        heading: "Una alternativa a Rasterbator que mantiene la foto nítida",
        paragraphs: [
          <>
            Si quieres el efecto de puntitos, usa Rasterbator. Si quieres la foto tal cual, al tamaño exacto, usa esta página: elige
            la imagen, escribe el tamaño final en centímetros, elige tamaño carta o A4 y descarga el PDF dividido en hojas
            numeradas. Es gratis, sin registro y sin marca de agua.
          </>,
          <>Ejemplo: un mural de 100 × 70 cm en hojas tamaño carta horizontales lleva 16 hojas (4 × 4).</>,
        ],
      }}
      sections={[
        {
          heading: "TileStencil y Rasterbator: qué cambia",
          items: [
            <>
              <strong>Sin puntitos:</strong> la imagen conserva sus píxeles originales, así que caras, textos y dibujos se ven
              bien de cerca.
            </>,
            <>
              <strong>Tamaño exacto:</strong> escribes el ancho en centímetros y el póster impreso sale con esa medida.
            </>,
            <>
              <strong>Fácil de armar:</strong> cada hoja lleva un código (A1, A2, B1…), marcas de corte y una franja de traslape para pegar.
            </>,
            <>
              <strong>Privado:</strong> la división y el PDF se hacen en tu navegador; la imagen no se sube.
            </>,
            <>
              <strong>También moldes:</strong> el modo blanco y negro convierte la foto en un{" "}
              <Link href={localizedPath("es", "photoToStencil")}>stencil para recortar</Link>.
            </>,
          ],
        },
        {
          heading: "Otras opciones gratis",
          body: (
            <>
              <Link href={localizedPath("es", "blockpostersAlternative")}>Block Posters</Link> (en línea) y PosteRazor (programa
              para Windows, Mac y Linux) también dividen imágenes en varias hojas.
            </>
          ),
        },
      ]}
      faqItems={faqItems}
    />
  );
}
