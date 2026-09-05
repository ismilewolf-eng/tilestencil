import type { Metadata } from "next";
import { CloudflareWebAnalytics } from "@/components/CloudflareWebAnalytics";
import { DomainRedirect } from "@/components/DomainRedirect";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TileStencil | Free Multi-Page Poster Printer (A4, A3, Letter) - 100% Actual Size",
    template: "%s | TileStencil",
  },
  description:
    "Free online tool to split and print large images across multiple A4, A3, or Letter pages at 100% actual size. Accurate scaling, overlap alignment lines, and multi-page PDF export. 100% private in-browser.",
  keywords: [
    "print image on multiple pages",
    "tile print pdf",
    "free poster printer online",
    "rasterbator alternative",
    "print large photo on a4 sheets",
    "print pattern actual size 100%",
    "multi page stencil maker",
    "tile image for printing",
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
    locale: "en_US",
    title: "TileStencil | Free Multi-Page Poster & Stencil Printer",
    description: "Create 100% actual size, tile-ready multi-page PDFs for A4, A3, or US Letter in your browser.",
    siteName: "TileStencil",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "TileStencil - Free Multi-Page Poster and Stencil Printer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TileStencil | Free Multi-Page Poster & Stencil Printer",
    description: "Split and print any image across multiple sheets of paper at true 1:1 scale.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="help" type="text/markdown" href={`${SITE_URL}/llms.txt`} title="LLM Documentation" />
      </head>
      <body>
        <DomainRedirect />
        {children}
        <CloudflareWebAnalytics />
      </body>
    </html>
  );
}
