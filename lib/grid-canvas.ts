/**
 * Browser-only drawing for the drawing grid maker: the photo with its grid (and square names in a
 * white margin, so they never cover the picture), for the on-screen preview and the PNG download.
 */
import { columnLabel, linePositions, LINE_RGB, LINE_SHARE, rowLabel, rowTakesDiagonals, type Grid, type GridStyle } from "@/lib/grid";

/** Large enough to print sharply, small enough for phone browsers (iOS caps a canvas near 16.7 MP). */
export const DOWNLOAD_MAX_SIDE = 3600;
const DOWNLOAD_MAX_AREA = 16_000_000;

const LABEL_INK = "#3d3933";
const MARGIN_FILL = "#ffffff";

function toGray(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number): void {
  const pixels = context.getImageData(x, y, width, height);
  const { data } = pixels;
  for (let o = 0; o < data.length; o += 4) {
    const luminance = Math.round(data[o] * 0.2126 + data[o + 1] * 0.7152 + data[o + 2] * 0.0722);
    data[o] = luminance;
    data[o + 1] = luminance;
    data[o + 2] = luminance;
  }
  context.putImageData(pixels, x, y);
}

/** Scale that keeps the photo within a longest side and a pixel budget, never enlarging it. */
export function fitScale(widthPx: number, heightPx: number, maxSide: number, maxArea = DOWNLOAD_MAX_AREA): number {
  return Math.min(1, maxSide / Math.max(widthPx, heightPx), Math.sqrt(maxArea / (widthPx * heightPx)));
}

/**
 * Draws the photo and its grid into `canvas`, resizing it. The photo is scaled by `scale`; with
 * labels on, a white margin above and to the left carries the column numbers and row letters.
 */
export function drawGridImage(canvas: HTMLCanvasElement, photo: CanvasImageSource, grid: Grid, style: GridStyle, scale: number): void {
  const photoWidth = Math.max(1, Math.round(grid.widthPx * scale));
  const photoHeight = Math.max(1, Math.round(grid.heightPx * scale));
  const longSide = Math.max(photoWidth, photoHeight);
  const cell = Math.min(grid.cellWidthPx, grid.cellHeightPx) * scale;
  // Labels follow the square size, within a readable range for the picture's size.
  const fontPx = Math.min(Math.max(12, longSide * 0.03), Math.max(cell * 0.34, 10, longSide * 0.016));
  const rowsLabelChars = rowLabel(grid.rows - 1).length;
  const top = style.labels ? Math.round(fontPx * 1.9) : 0;
  const left = style.labels ? Math.round(fontPx * (0.75 * rowsLabelChars + 1.2)) : 0;

  canvas.width = left + photoWidth;
  canvas.height = top + photoHeight;
  const context = canvas.getContext("2d", { willReadFrequently: style.grayscale });
  if (!context) throw new Error("This browser cannot draw the grid.");
  context.fillStyle = MARGIN_FILL;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingQuality = "high";
  context.drawImage(photo, left, top, photoWidth, photoHeight);
  if (style.grayscale) toGray(context, left, top, photoWidth, photoHeight);

  const { xs, ys } = linePositions(grid);
  const px = xs.map((x) => left + x * scale);
  const py = ys.map((y) => top + y * scale);
  const [r, g, b] = LINE_RGB[style.color];
  const lineWidth = Math.max(1, longSide * LINE_SHARE[style.weight]);

  context.save();
  context.beginPath();
  context.rect(left, top, photoWidth, photoHeight);
  context.clip();
  context.strokeStyle = `rgb(${r} ${g} ${b} / 0.92)`;
  context.lineWidth = lineWidth;
  context.beginPath();
  for (const x of px) {
    context.moveTo(x, top);
    context.lineTo(x, top + photoHeight);
  }
  for (const y of py) {
    context.moveTo(left, y);
    context.lineTo(left + photoWidth, y);
  }
  context.stroke();
  if (style.diagonals) {
    context.strokeStyle = `rgb(${r} ${g} ${b} / 0.7)`;
    context.lineWidth = Math.max(1, lineWidth * 0.6);
    context.beginPath();
    for (let row = 0; row < py.length - 1; row++) {
      if (!rowTakesDiagonals(grid, ys[row + 1] - ys[row])) continue;
      for (let column = 0; column < px.length - 1; column++) {
        context.moveTo(px[column], py[row]);
        context.lineTo(px[column + 1], py[row + 1]);
        context.moveTo(px[column + 1], py[row]);
        context.lineTo(px[column], py[row + 1]);
      }
    }
    context.stroke();
  }
  context.restore();

  if (style.labels) {
    context.fillStyle = LABEL_INK;
    context.font = `600 ${Math.round(fontPx)}px ui-monospace, "Cascadia Mono", "SFMono-Regular", Consolas, monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    for (let column = 0; column < px.length - 1; column++) {
      context.fillText(columnLabel(column), (px[column] + px[column + 1]) / 2, top / 2);
    }
    for (let row = 0; row < py.length - 1; row++) {
      context.fillText(rowLabel(row), left / 2, (py[row] + py[row + 1]) / 2);
    }
  }
}

/** The photo alone (black and white if asked), as a JPEG data URL for the one-page PDF. */
export function photoJpeg(photo: CanvasImageSource, widthPx: number, heightPx: number, grayscale: boolean, maxSide = 2400): string {
  const scale = fitScale(widthPx, heightPx, maxSide);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(widthPx * scale));
  canvas.height = Math.max(1, Math.round(heightPx * scale));
  const context = canvas.getContext("2d", { willReadFrequently: grayscale });
  if (!context) throw new Error("This browser cannot prepare the photo.");
  context.fillStyle = MARGIN_FILL;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(photo, 0, 0, canvas.width, canvas.height);
  if (grayscale) toGray(context, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}
