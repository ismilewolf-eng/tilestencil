import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("es", "photoToStencil", {
  title: "Hacer un Stencil de una Foto Gratis (con Puentes, a Tamaño Real)",
  description:
    "Convierte una foto en un stencil para recortar: la herramienta agrega puentes para que no se caigan las piezas y lo imprime al tamaño exacto en varias hojas. Gratis; SVG para Cricut y láser por US$1.99. Sin subir la foto.",
  keywords: ["stencil", "hacer stencil", "stencil de una foto", "cómo hacer un stencil", "convertir foto en stencil", "esténcil"],
});

const howToSteps = [
  { name: "Elige la foto", text: "Funciona mejor una foto con un motivo principal y fondo sencillo. No se sube nada." },
  { name: "Ajusta el umbral", text: "Mueve el control viendo la vista previa hasta que el contorno se lea claro. Usa Invertir si quieres recortar el motivo en vez del fondo." },
  { name: "Escribe el tamaño final", text: "El ancho que debe tener el stencil en la pared, la playera o la madera, en centímetros." },
  { name: "Imprime a tamaño real y recorta", text: "Imprime en Tamaño real (100%), pega las hojas y recorta las partes negras con un cúter." },
];

const faqItems = [
  {
    question: "¿Cómo hago un stencil a partir de una foto?",
    answer:
      "Elige la foto en esta página, deja activado el modo blanco y negro y mueve el umbral hasta que el dibujo se vea claro en la vista previa. Escribe el tamaño final y descarga el PDF. Es gratis y la foto no sale de tu navegador.",
  },
  {
    question: "¿Qué son los puentes de un stencil?",
    answer:
      "Son tiras delgadas que sostienen las partes cerradas, como el centro de una O o lo blanco de un ojo. Sin ellas, esas piezas se caen al recortar. La herramienta encuentra cada una y traza el puente más corto automáticamente.",
  },
  {
    question: "¿Puedo hacer un stencil más grande que la hoja?",
    answer:
      "Sí. Escribe el tamaño final, por ejemplo 120 cm de ancho para una pared, y el stencil se divide en hojas numeradas con marcas para alinearlas.",
  },
  {
    question: "¿Sirve para Cricut, Silhouette o láser?",
    answer:
      "Sí, con el SVG: trae los trazos de corte y los puentes listos, con la medida en milímetros. El SVG cuesta US$1.99 por imagen; el PDF para imprimir sigue siendo gratis.",
  },
  {
    question: "¿En qué material recorto el stencil?",
    answer:
      "Para usarlo una vez, basta con el mismo papel pegado con cinta masking. Para pintar muchas veces, pasa el dibujo a acetato, cartulina gruesa o plástico delgado y recórtalo con un cúter.",
  },
];

export default function SpanishPhotoStencilPage() {
  return (
    <StencilLanding
      locale="es"
      route="photoToStencil"
      intro={{
        eyebrow: "STENCIL DE UNA FOTO",
        heading: "Convierte una foto en un stencil e imprímelo al tamaño que necesitas.",
        copy: "Ajusta el blanco y negro viendo la vista previa, deja que los puentes automáticos sostengan las piezas y descarga el stencil dividido en hojas tamaño carta, A4 o A3. Todo en el navegador.",
      }}
      defaults={{ renderMode: "template", bridges: true, widthCm: 40, heightCm: 30, paperSize: "letter" }}
      example="photo-to-stencil"
      howToName="Cómo hacer un stencil a partir de una foto"
      howToDescription="Convierte una foto en un stencil en blanco y negro con puentes e imprímelo a tamaño real en varias hojas."
      howToSteps={howToSteps}
      quick={{
        heading: "Cómo convertir una foto en un stencil",
        paragraphs: [
          <>
            Elige la foto arriba, mueve el umbral hasta que el contorno se vea claro y deja los puentes activados para que no se
            caigan las piezas. Escribe el tamaño final y descarga el PDF: imprime en <strong>Tamaño real / 100%</strong> y recorta
            las partes negras. El PDF es gratis; el SVG para Cricut y láser cuesta US$1.99.
          </>,
        ],
      }}
      sections={[
        {
          heading: "Consejos para un stencil limpio",
          items: [
            "Usa fotos con contraste: una cara iluminada de lado, un objeto oscuro sobre fondo claro.",
            "Recorta la foto al motivo antes de elegirla: un fondo con mucho detalle se vuelve manchitas.",
            "Puentes de 2 mm sirven para papel; usa 3 a 4 mm en acetato que vas a pintar muchas veces.",
            "Usa Invertir cuando quieras pintar el motivo y no el fondo.",
          ],
        },
        {
          heading: "Usos comunes",
          items: [
            "Pintura en aerosol para paredes, muebles y letreros",
            "Playeras y bolsas con pintura textil",
            "Pirograbado y trabajos en madera",
            <>
              Letras y números: usa las <Link href={localizedPath("es", "letterStencils")}>plantillas de letras</Link>
            </>,
          ],
        },
      ]}
      faqItems={faqItems}
    />
  );
}
