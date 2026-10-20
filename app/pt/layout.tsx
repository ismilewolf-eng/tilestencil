import type { Metadata } from "next";
import { CloudflareWebAnalytics } from "@/components/CloudflareWebAnalytics";
import { FirstTouch } from "@/components/FirstTouch";
import { DomainRedirect } from "@/components/DomainRedirect";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const TITLE = "Imprimir Imagem em Várias Folhas A4 Grátis | TileStencil";
const DESCRIPTION =
  "Divida qualquer imagem em várias folhas A4, A3 ou Carta no tamanho real, com marcas de corte e sobreposição. Grátis, sem cadastro e sem marca d'água. A imagem não sai do seu navegador.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | TileStencil",
  },
  description: DESCRIPTION,
  keywords: [
    "imprimir imagem em várias folhas",
    "dividir imagem para imprimir",
    "pôster em folhas A4",
    "ampliar imagem para imprimir em várias folhas",
    "rasterbator online",
    "estêncil",
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
    locale: "pt_BR",
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
    <html lang="pt-BR">
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
