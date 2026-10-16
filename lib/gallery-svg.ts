import { stencilSvg, traceMask } from "@/lib/stencil-svg";

/** Same rule as the stencil maker: a pixel is cut (black) when its luminance is below the threshold. */
export function maskFromRgba(data: Uint8ClampedArray | Uint8Array, width: number, height: number, threshold = 160): Uint8Array {
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2], a = data[i * 4 + 3];
    // Transparent pixels count as paper.
    const lum = a < 128 ? 255 : 0.2126 * r + 0.7152 * g + 0.0722 * b;
    mask[i] = lum < threshold ? 1 : 0;
  }
  return mask;
}

/** SVG document for a gallery design at the given physical width; height keeps the aspect ratio. */
export function svgFromMask(mask: Uint8Array, width: number, height: number, widthMm: number): string {
  return stencilSvg(traceMask(mask, width, height), width, height, widthMm, (widthMm * height) / width);
}

/** Browser only: fetch the design PNG and turn it into a cut-ready SVG. */
export async function gallerySvg(pngUrl: string, widthMm: number): Promise<string> {
  const image = new Image();
  image.decoding = "async";
  image.src = pngUrl;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("canvas");
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  return svgFromMask(maskFromRgba(data, canvas.width, canvas.height), canvas.width, canvas.height, widthMm);
}
