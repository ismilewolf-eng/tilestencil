/**
 * PDFs for the list tools: address labels on a label-sheet layout, and numbered raffle tickets.
 * Vector text in the PDF's built-in fonts, so files stay small even for thousands of labels.
 */
import {
  fitFontPt,
  LABEL_MAX_PT,
  LABEL_PAD_MM,
  labelPosition,
  LINE_SPACING,
  perSheet,
  PT_MM,
  ticketLayout,
  ticketNumber,
  ticketPosition,
  type LabelFormat,
  type TicketSpec,
} from "@/lib/sheets";

type Pdf = {
  addPage: (format: [number, number], orientation: "portrait" | "landscape") => void;
  setFont: (family: string, style?: string) => void;
  setFontSize: (size: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setLineWidth: (width: number) => void;
  setLineDashPattern: (dashArray: number[], dashPhase: number) => void;
  getTextWidth: (text: string) => number;
  text: (text: string, x: number, y: number, options?: { align?: "left" | "center" | "right"; angle?: number }) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  rect: (x: number, y: number, w: number, h: number, style?: string) => void;
  roundedRect: (x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string) => void;
  save: (name: string) => void;
};

async function newPdf(widthMm: number, heightMm: number): Promise<Pdf> {
  const { jsPDF } = await import("jspdf");
  return new jsPDF({ orientation: "portrait", unit: "mm", format: [widthMm, heightMm], compress: true, putOnlyUsedFonts: true }) as unknown as Pdf;
}

export type LabelFont = "helvetica" | "times" | "courier";

export interface LabelOptions {
  format: LabelFormat;
  labels: string[][];
  font: LabelFont;
  size: keyof typeof LABEL_MAX_PT;
  align: "left" | "center";
  /** Positions already used on the first sheet. */
  skip: number;
  /** Nudge the whole sheet, in mm, for printers that feed slightly off. */
  offsetX: number;
  offsetY: number;
  /** Draw the label edges: for a test print on plain paper. */
  outlines: boolean;
}

/** Returns the number of sheets. */
export async function exportLabelsPdf(options: LabelOptions): Promise<number> {
  const { format: f, labels, skip } = options;
  const pdf = await newPdf(f.pageW, f.pageH);
  const per = perSheet(f);
  const boxW = f.labelW - 2 * LABEL_PAD_MM;
  const boxH = f.labelH - 2 * Math.min(LABEL_PAD_MM, f.labelH * 0.12);
  let sheets = 1;

  const outline = (page: number) => {
    if (!options.outlines) return;
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.15);
    for (let slot = 0; slot < per; slot++) {
      const { x, y } = labelPosition(f, slot);
      pdf.roundedRect(x + options.offsetX, y + options.offsetY, f.labelW, f.labelH, 1.5, 1.5, "S");
    }
    void page;
  };
  outline(1);

  pdf.setTextColor(0, 0, 0);
  labels.forEach((lines, i) => {
    const position = i + skip;
    if (position > 0 && position % per === 0) {
      pdf.addPage([f.pageW, f.pageH], "portrait");
      sheets++;
      outline(sheets);
    }
    if (lines.length === 0) return;
    pdf.setFont(options.font, "normal");
    pdf.setFontSize(1);
    const pt = fitFontPt(lines, boxW, boxH, LABEL_MAX_PT[options.size], (line) => pdf.getTextWidth(line));
    pdf.setFontSize(pt);
    const step = pt * LINE_SPACING * PT_MM;
    const { x, y } = labelPosition(f, position);
    const blockH = lines.length * step;
    // Baseline of the first line: block centred in the label, baseline about 0.8 em below the line top.
    const first = y + options.offsetY + (f.labelH - blockH) / 2 + pt * PT_MM * 0.82;
    const tx = options.align === "center" ? x + f.labelW / 2 : x + LABEL_PAD_MM;
    lines.forEach((line, n) => pdf.text(line, tx + options.offsetX, first + n * step, { align: options.align }));
  });

  pdf.save(`address-labels-${f.id}-${labels.length}.pdf`);
  return sheets;
}

function fitted(pdf: Pdf, text: string, maxW: number, maxPt: number, minPt = 6): number {
  pdf.setFontSize(maxPt);
  const w = pdf.getTextWidth(text);
  return w <= maxW ? maxPt : Math.max(minPt, Math.floor(((maxPt * maxW) / w) * 2) / 2);
}

/** Returns the number of sheets. */
export async function exportTicketsPdf(spec: TicketSpec, paper: "letter" | "a4"): Promise<number> {
  const L = ticketLayout(paper);
  const pdf = await newPdf(L.pageW, L.pageH);
  const per = L.cols * L.rows;
  const sheets = Math.ceil(spec.count / per);
  const INK: [number, number, number] = [20, 20, 20];
  const GREY: [number, number, number] = [110, 110, 110];

  for (let sheet = 0; sheet < sheets; sheet++) {
    if (sheet > 0) pdf.addPage([L.pageW, L.pageH], "portrait");
    // Cut lines: the full grid, once per sheet.
    pdf.setDrawColor(...GREY);
    pdf.setLineWidth(0.2);
    pdf.setLineDashPattern([2.5, 1.5], 0);
    for (let c = 0; c <= L.cols; c++) pdf.line(L.marginX + c * L.ticketW, L.marginY, L.marginX + c * L.ticketW, L.pageH - L.marginY);
    for (let r = 0; r <= L.rows; r++) pdf.line(L.marginX, L.marginY + r * L.ticketH, L.pageW - L.marginX, L.marginY + r * L.ticketH);

    for (let slot = 0; slot < per; slot++) {
      const index = sheet * per + slot;
      if (index >= spec.count) break;
      const { x, y } = ticketPosition(L, index);
      const number = ticketNumber(spec, index);
      const pad = 4;

      // Tear line between stub and ticket.
      pdf.setLineDashPattern([0.6, 1.2], 0);
      pdf.setDrawColor(...GREY);
      pdf.line(x + L.stubW, y + 2, x + L.stubW, y + L.ticketH - 2);
      pdf.setLineDashPattern([], 0);

      // Stub: number, then lines to write on.
      pdf.setTextColor(...INK);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(fitted(pdf, `No. ${number}`, L.stubW - 2 * pad, 11));
      pdf.text(`No. ${number}`, x + pad, y + pad + 4);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(...GREY);
      pdf.setDrawColor(...GREY);
      pdf.setLineWidth(0.2);
      const fields = spec.stubFields.slice(0, 4);
      const top = y + pad + 10;
      const gap = fields.length ? Math.min(13, (L.ticketH - pad - 10 - pad) / fields.length) : 0;
      fields.forEach((field, n) => {
        const fy = top + n * gap;
        pdf.text(field, x + pad, fy + 3);
        pdf.line(x + pad, fy + gap - 2.5, x + L.stubW - pad, fy + gap - 2.5);
      });

      // Ticket body.
      const bx = x + L.stubW + pad;
      const bw = L.ticketW - L.stubW - 2 * pad;
      const cx = bx + bw / 2;
      pdf.setTextColor(...INK);
      pdf.setFont("helvetica", "bold");
      const titlePt = fitted(pdf, spec.title || "Raffle Ticket", bw, 17, 8);
      pdf.setFontSize(titlePt);
      pdf.text(spec.title || "Raffle Ticket", cx, y + L.ticketH * 0.3, { align: "center" });
      pdf.setFont("helvetica", "normal");
      let ly = y + L.ticketH * 0.3 + 7;
      for (const line of [spec.line2, spec.line3]) {
        if (!line) continue;
        pdf.setFontSize(fitted(pdf, line, bw, 9.5));
        pdf.text(line, cx, ly, { align: "center" });
        ly += 5.2;
      }
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(`No. ${number}`, bx + bw, y + L.ticketH - pad - 1, { align: "right" });
      if (spec.price) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fitted(pdf, spec.price, bw * 0.55, 10));
        pdf.text(spec.price, bx, y + L.ticketH - pad - 1);
      }
    }
  }
  pdf.setLineDashPattern([], 0);
  pdf.save(`raffle-tickets-${ticketNumber(spec, 0)}-to-${ticketNumber(spec, spec.count - 1)}.pdf`);
  return sheets;
}
