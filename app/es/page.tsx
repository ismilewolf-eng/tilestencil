import Link from "next/link";
import { OrganizationJsonLd, WebApplicationJsonLd, WebSiteJsonLd } from "@/components/JsonLd";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("es", "home", {
  title: "Imprimir Imagen en Varias Hojas Gratis (Tamaño Real) | TileStencil",
  description:
    "Divide cualquier imagen en varias hojas tamaño carta, A4 o A3 al tamaño exacto que quieras, con marcas de corte y traslape para armarla. Gratis, sin registro y sin marca de agua. La imagen no sale de tu navegador.",
  keywords: [
    "imprimir imagen en varias hojas",
    "imprimir imagen grande en varias hojas",
    "dividir imagen para imprimir",
    "dividir imagen en varias hojas",
    "imprimir póster en varias hojas",
    "imprimir imagen en varias hojas tamaño carta",
  ],
});

const howToSteps = [
  { name: "Elige la imagen", text: "Selecciona un JPG o PNG de tu computadora o celular. La imagen se procesa en el navegador y no se sube a ningún servidor." },
  { name: "Escribe el tamaño final", text: "Pon el ancho o el alto que debe tener el póster, en centímetros. La otra medida sigue la proporción de la imagen." },
  { name: "Elige el papel", text: "Tamaño carta, A4 o A3, vertical u horizontal. La herramienta te dice cuántas hojas vas a usar." },
  { name: "Imprime a tamaño real y arma", text: "Descarga el PDF, imprime en Tamaño real (100%), recorta en las marcas y pega las hojas siguiendo los códigos A1, A2, B1…" },
];

const faqItems = [
  {
    question: "¿Cómo imprimo una imagen en varias hojas?",
    answer:
      "Elige la imagen en esta página, escribe el tamaño final (por ejemplo, 60 × 84 cm), selecciona tamaño carta o A4 y descarga el PDF. Cada hoja sale numerada y con marcas de corte. Al imprimir, elige Tamaño real o 100%, nunca Ajustar a la página, para que el póster salga a la medida.",
  },
  {
    question: "¿De verdad es gratis?",
    answer:
      "Sí. Dividir la imagen y descargar el PDF es gratis, sin registro, sin marca de agua y sin límite de hojas. Solo el SVG para máquinas de corte (Cricut, Silhouette, láser) cuesta US$1.99 por imagen.",
  },
  {
    question: "¿Cuántas hojas necesito?",
    answer:
      "Depende del tamaño final y del margen de tu impresora. Con un margen de 8 mm, un póster de 60 × 84 cm usa 16 hojas tamaño carta en vertical. La herramienta te muestra el número exacto antes de descargar.",
  },
  {
    question: "¿La imagen pierde calidad al ampliarla?",
    answer:
      "La herramienta no comprime la imagen ni la convierte en puntitos: usa los píxeles originales. Pero una foto pequeña estirada a 1 metro se verá borrosa de cerca. Para pósteres grandes, usa la mayor resolución que tengas.",
  },
  {
    question: "¿Funciona en el celular?",
    answer: "Sí. La página funciona en Chrome y Safari del celular. El PDF lo puedes mandar a tu impresora o llevarlo a una papelería o a un centro de copiado.",
  },
];

export default function SpanishHomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd locale="es" />
      <WebApplicationJsonLd locale="es" />
      <StencilLanding
        locale="es"
        route="home"
        intro={{
          eyebrow: "PÓSTER EN VARIAS HOJAS",
          heading: "Imprime cualquier imagen en varias hojas, al tamaño exacto.",
          copy: "Elige un JPG o PNG, escribe el tamaño final en centímetros y descarga un PDF dividido en hojas tamaño carta, A4 o A3, con marcas de corte para armarlo. Gratis, y la imagen no sale de tu navegador.",
        }}
        defaults={{ widthCm: 60, heightCm: 40, paperSize: "letter" }}
        howToName="Cómo imprimir una imagen en varias hojas"
        howToDescription="Divide una imagen en varias hojas tamaño carta, A4 o A3 a tamaño real y arma un póster grande."
        howToSteps={howToSteps}
        quick={{
          heading: "Cómo imprimir una imagen grande en varias hojas",
          paragraphs: [
            <>
              Elige la imagen arriba, escribe el tamaño que debe tener el póster (por ejemplo, 60 × 84 cm), selecciona tamaño carta
              o A4 y haz clic en Exportar. El PDF sale con cada hoja numerada (A1, A2, B1…), marcas de corte y una franja de traslape para pegar. Imprime en <strong>Tamaño real / 100%</strong>. Es gratis, sin registro y sin marca de agua.
            </>,
            <>Ejemplo: un póster de 60 × 84 cm con margen de 8 mm usa 16 hojas tamaño carta en vertical (4 columnas × 4 filas).</>,
          ],
        }}
        sections={[
          {
            heading: "Para qué se usa",
            items: [
              <>
                Moldes de piñatas y figuras grandes: mira <Link href={localizedPath("es", "blockpostersAlternative")}>block posters gratis</Link>
              </>,
              "Pósters y murales para la pared sin pagar impresión en gran formato",
              "Plantillas para pintar paredes, letreros y bardas",
              "Patrones de costura y manualidades impresos a tamaño real",
              <>
                Stencil a partir de una foto: usa el <Link href={localizedPath("es", "photoToStencil")}>generador de stencil</Link>
              </>,
            ],
          },
          {
            heading: "Consejos para que el póster salga bien",
            items: [
              "En la ventana de impresión elige Tamaño real o 100%. Ajustar a la página encoge cada hoja y el póster no cuadra.",
              "Deja el traslape en 5 mm: así puedes encimar una hoja sobre otra sin que se note la unión.",
              "Recorta el margen blanco de un solo lado de cada hoja y pega por detrás con cinta.",
              <>
                ¿Buscas Rasterbator? Mira la <Link href={localizedPath("es", "rasterbatorAlternative")}>alternativa a Rasterbator</Link> sin
                puntitos.
              </>,
            ],
          },
        ]}
        faqItems={faqItems}
      />
    </>
  );
}
