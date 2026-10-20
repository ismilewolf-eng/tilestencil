import type { Metadata } from "next";
import { CloudflareWebAnalytics } from "@/components/CloudflareWebAnalytics";
import { FirstTouch } from "@/components/FirstTouch";
import { DomainRedirect } from "@/components/DomainRedirect";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const TITLE = "Imprimir Imagen en Varias Hojas Gratis | TileStencil";
const DESCRIPTION =
  "Divide cualquier imagen en varias hojas tamaño carta, A4 o A3 a tamaño real, con marcas de corte y superposición. Gratis, sin registro y sin marca de agua. La imagen no sale de tu navegador.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | TileStencil",
  },
  description: DESCRIPTION,
  keywords: [
    "imprimir imagen en varias hojas",
    "block posters gratis",
    "dividir imagen para imprimir",
    "imprimir póster en varias hojas",
    "rasterbator",
    "stencil",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    title: TITLE,
    description: DESCRIPTION,
    siteName: "TileStencil",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "TileStencil" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="help" type="text/markdown" href={`${SITE_URL}/llms.txt`} title="LLM Documentation" />
      </head>
      <body>
        <DomainRedirect />
        {children}
        <CloudflareWebAnalytics />
        <FirstTouch />
      </body>
    </html>
  );
}
