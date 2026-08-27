import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TileStencil - Free Multi-Page Poster & Stencil Printer",
    short_name: "TileStencil",
    description:
      "Split and print any JPG or PNG image across multiple A4, A3, or Letter pages at 100% actual size with tile overlap and cut marks.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f1e8",
    theme_color: "#a34f2b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
