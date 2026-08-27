import type { TilePlan, TileRegion } from "@/lib/geometry";
import { getPixelCrop } from "@/lib/geometry";

export type RenderMode = "original" | "grayscale" | "template";

export interface ExportImage {
  dataUrl: string;
  widthPx: number;
  heightPx: number;
  name: string;
}

export interface ExportPdfOptions {
  image: ExportImage;
  plan: TilePlan;
  mode: RenderMode;
  onProgress?: (completed: number, total: number) => void;
}

type JsPdfInstance = {
  addPage: (format?: [number, number], orientation?: "portrait" | "landscape") => void;
  addImage: (
    imageData: string,
    format: "JPEG" | "PNG",
    x: number,
    y: number,
    width: number,
    height: number,
    alias?: string,
    compression?: "NONE" | "FAST" | "MEDIUM" | "SLOW",
  ) => void;
  setDrawColor: (red: number, green: number, blue: number) => void;
  setTextColor: (red: number, green: number, blue: number) => void;
  setLineWidth: (width: number) => void;
  setFontSize: (size: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  text: (text: string, x: number, y: number, options?: { align?: "left" | "center" | "right" }) => void;
  save: (filename: string) => void;
};

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The selected image could not be read."));
    image.src = dataUrl;
  });
}

function applyRenderMode(context: CanvasRenderingContext2D, mode: RenderMode): void {
  if (mode === "original") {
    return;
  }

  const imageData = context.getImageData(0, 0, context.canvas.width, context.canvas.height);
  const { data } = imageData;

  for (let offset = 0; offset < data.length; offset += 4) {
    const luminance = Math.round(
      data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722,
    );
    const next = mode === "grayscale" ? luminance : luminance >= 160 ? 255 : 0;
    data[offset] = next;
    data[offset + 1] = next;
    data[offset + 2] = next;
  }

  context.putImageData(imageData, 0, 0);
}

function createTileImage(
  source: HTMLImageElement,
  tile: TileRegion,
  plan: TilePlan,
  sourceInfo: ExportImage,
  mode: RenderMode,
): { dataUrl: string; format: "JPEG" | "PNG" } {
  const crop = getPixelCrop(
    tile,
    sourceInfo.widthPx,
    sourceInfo.heightPx,
    plan.targetWidthMm,
    plan.targetHeightMm,
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(crop.width));
  canvas.height = Math.max(1, Math.ceil(crop.height));
  const context = canvas.getContext("2d", { willReadFrequently: mode !== "original" });

  if (!context) {
    throw new Error("This browser cannot prepare the image tile.");
  }

  context.drawImage(
    source,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  applyRenderMode(context, mode);

  if (mode === "template") {
    return { dataUrl: canvas.toDataURL("image/png"), format: "PNG" };
  }

  return { dataUrl: canvas.toDataURL("image/jpeg", 0.92), format: "JPEG" };
}

function drawRegistrationMarks(pdf: JsPdfInstance, tile: TileRegion, plan: TilePlan): void {
  const x = tile.pageXmm;
  const y = tile.pageYmm;
  const right = x + tile.widthMm;
  const bottom = y + tile.heightMm;
  const mark = Math.min(4, Math.max(2, plan.marginMm * 0.6));

  pdf.setDrawColor(95, 89, 80);
  pdf.setLineWidth(0.25);

  pdf.line(x - mark, y, x - 0.7, y);
  pdf.line(x, y - mark, x, y - 0.7);
  pdf.line(right + 0.7, y, right + mark, y);
  pdf.line(right, y - mark, right, y - 0.7);
  pdf.line(x - mark, bottom, x - 0.7, bottom);
  pdf.line(x, bottom + 0.7, x, bottom + mark);
  pdf.line(right + 0.7, bottom, right + mark, bottom);
  pdf.line(right, bottom + 0.7, right, bottom + mark);
}

function drawPageGuidance(pdf: JsPdfInstance, tile: TileRegion, plan: TilePlan): void {
  const pageNumber = tile.index + 1;
  const totalPages = plan.tiles.length;
  const connections: string[] = [];

  if (tile.column > 0) {
    connections.push(`left: ${plan.tiles[tile.index - 1]?.label}`);
  }
  if (tile.row > 0) {
    connections.push(`above: ${plan.tiles[tile.index - plan.columns]?.label}`);
  }

  pdf.setTextColor(70, 65, 58);
  pdf.setFontSize(6.6);
  pdf.text("Print at 100% / Actual Size — do not fit to page", plan.paper.widthMm / 2, 3.8, {
    align: "center",
  });
  pdf.setFontSize(6.2);
  pdf.text(
    `Tile ${tile.label} · Page ${pageNumber}/${totalPages} · overlap ${plan.overlapMm.toFixed(1)} mm`,
    plan.paper.widthMm / 2,
    plan.paper.heightMm - Math.max(2.8, plan.marginMm / 2),
    { align: "center" },
  );

  if (connections.length > 0 && plan.marginMm >= 8) {
    pdf.setFontSize(5.8);
    pdf.text(
      `Align with ${connections.join(" · ")}`,
      plan.paper.widthMm / 2,
      Math.max(7.4, plan.marginMm - 1.2),
      { align: "center" },
    );
  }
}

function fileStem(filename: string): string {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  return withoutExtension
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "tilestencil";
}

export async function exportTiledPdf({ image, plan, mode, onProgress }: ExportPdfOptions): Promise<void> {
  const [{ jsPDF }, source] = await Promise.all([import("jspdf"), loadImage(image.dataUrl)]);
  const pdf = new jsPDF({
    orientation: plan.orientation,
    unit: "mm",
    format: [plan.paper.widthMm, plan.paper.heightMm],
    compress: true,
    putOnlyUsedFonts: true,
  }) as unknown as JsPdfInstance;

  for (const tile of plan.tiles) {
    if (tile.index > 0) {
      pdf.addPage([plan.paper.widthMm, plan.paper.heightMm], plan.orientation);
    }

    drawPageGuidance(pdf, tile, plan);
    const rendered = createTileImage(source, tile, plan, image, mode);
    pdf.addImage(
      rendered.dataUrl,
      rendered.format,
      tile.pageXmm,
      tile.pageYmm,
      tile.widthMm,
      tile.heightMm,
      undefined,
      "FAST",
    );
    drawRegistrationMarks(pdf, tile, plan);
    onProgress?.(tile.index + 1, plan.tiles.length);
  }

  pdf.save(`${fileStem(image.name)}-tiled-${plan.paper.label.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
