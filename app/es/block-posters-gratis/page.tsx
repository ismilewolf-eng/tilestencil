import Link from "next/link";
import { StencilLanding } from "@/components/StencilLanding";
import { localMetadata } from "@/lib/local-metadata";
import { localizedPath } from "@/lib/locale";

export const metadata = localMetadata("es", "blockpostersAlternative", {
  title: "Block Posters Gratis en Español: Imprime una Imagen en Varias Hojas",
  description:
    "Haz un block poster gratis: divide cualquier imagen en varias hojas tamaño carta o A4 al tamaño exacto, sin límite de hojas y sin marca de agua. Ideal para moldes de piñatas y murales. Sin registro.",
  keywords: [
    "block posters",
    "block posters gratis",
    "block poster en español",
    "block posters online",
    "moldes de piñatas block poster",
    "alternativa a block posters",
  ],
});

const howToSteps = [
  { name: "Elige la imagen", text: "JPG o PNG, desde la computadora o el celular. No se sube a ningún servidor." },
  { name: "Escribe el tamaño final", text: "En centímetros. La otra medida sigue la proporción de la imagen." },
  { name: "Elige el papel", text: "Tamaño carta, A4 o A3, vertical u horizontal. Ves cuántas hojas vas a usar." },
  { name: "Descarga, imprime y arma", text: "Imprime en Tamaño real (100%) y pega las hojas siguiendo los códigos de la cuadrícula." },
];

const faqItems = [
  {
    question: "¿Esta página es Block Posters?",
    answer:
      "No. Block Posters (blockposters.com) es otro sitio. TileStencil hace lo mismo, dividir una imagen en varias hojas para armar un póster, y es una alternativa gratis.",
  },
  {
    question: "¿Tiene límite de hojas o marca de agua?",
    answer:
      "No. Puedes dividir en todas las hojas que necesites y el PDF sale sin marca de agua. La versión gratis de Block Posters ha tenido límites de hojas y de resolución; revisa sus condiciones actuales en su sitio.",
  },
  {
    question: "¿Cómo hago el molde de una piñata con un block poster?",
    answer:
      "Elige el dibujo del personaje, escribe la altura que quieres que tenga la piñata (por ejemplo, 80 cm) y descarga el PDF. Imprime en Tamaño real, pega las hojas, recorta la silueta y úsala como molde sobre el cartón. Para un molde que solo marque el contorno, activa el modo blanco y negro y ahorras tinta.",
  },
  {
    question: "¿Puedo poner el tamaño en centímetros?",
    answer: "Sí. Escribes el ancho o el alto final en centímetros (o pulgadas) y el póster impreso sale con esa medida si imprimes en Tamaño real (100%).",
  },
  {
    question: "¿Cuánto cuesta?",
    answer: "El PDF es gratis. Solo el SVG para máquinas de corte (Cricut, Silhouette, láser) cuesta US$1.99 por imagen.",
  },
];

export default function SpanishBlockPostersPage() {
  return (
    <StencilLanding
      locale="es"
      route="blockpostersAlternative"
      intro={{
        eyebrow: "BLOCK POSTERS GRATIS",
        heading: "Block poster gratis: tu imagen en varias hojas, al tamaño exacto.",
        copy: "Elige la imagen, escribe el tamaño final en centímetros y descarga el PDF dividido en hojas tamaño carta, A4 o A3. Sin límite de hojas, sin marca de agua y sin registro.",
      }}
      defaults={{ widthCm: 60, heightCm: 84, paperSize: "letter" }}
      howToName="Cómo hacer un block poster gratis"
      howToDescription="Divide una imagen en varias hojas a tamaño real y arma un póster o molde grande."
      howToSteps={howToSteps}
      quick={{
        heading: "Cómo hacer un block poster gratis",
        paragraphs: [
          <>
            Elige la imagen arriba, escribe el tamaño final (por ejemplo, 60 × 84 cm), selecciona tamaño carta y descarga el PDF.
            Cada hoja sale numerada, con marcas de corte y traslape. Imprime en <strong>Tamaño real / 100%</strong> y pega las
            hojas. No hay límite de hojas ni marca de agua.
          </>,
          <>Ejemplo: 60 × 84 cm en hojas tamaño carta verticales son 16 hojas (4 × 4).</>,
        ],
      }}
      sections={[
        {
          heading: "Lo que puedes hacer aquí",
          items: [
            "Tamaño final exacto en centímetros o pulgadas",
            "Hojas tamaño carta, A4 o A3, vertical u horizontal",
            "Margen de la impresora y traslape ajustables",
            "Modo gris y modo blanco y negro para ahorrar tinta o hacer moldes",
            "La imagen se queda en tu navegador: no se sube nada",
          ],
        },
        {
          heading: "Ideas",
          items: [
            "Moldes de piñatas de personajes al tamaño que quieras",
            "Pósters y murales para fiestas y salones de clase",
            <>
              Letras grandes para decorar: usa las <Link href={localizedPath("es", "letterStencils")}>plantillas de letras</Link>
            </>,
            <>
              ¿Quieres el efecto de puntitos? Mira la <Link href={localizedPath("es", "rasterbatorAlternative")}>comparación con Rasterbator</Link>
            </>,
          ],
        },
      ]}
      faqItems={faqItems}
    />
  );
}
