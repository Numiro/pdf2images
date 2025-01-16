/// <reference lib="deno.worker" />

import * as mupdfjs from "mupdf/mupdfjs";

self.onmessage = (e: MessageEvent<Uint8Array>) => {
  try {
    const pdfBuffer = e.data;
    const pages = convertPDFToImages(pdfBuffer);
    self.postMessage(pages);
  } catch (error: unknown) {
    self.postMessage({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

function convertPDFToImages(pdfBuffer: Uint8Array) {
  const doc = mupdfjs.PDFDocument.openDocument(pdfBuffer, "application/pdf");
  const count = doc.countPages();

  const pages: Uint8Array[] = [];
  for (let i = 0; i < count; i++) {
    const page = doc.loadPage(i);
    const scale = 2.0;
    const pixmap = page.toPixmap(
      mupdfjs.Matrix.scale(scale, scale),
      mupdfjs.ColorSpace.DeviceRGB,
      false,
      true
    );
    const buffer = pixmap.asPNG();

    pages.push(buffer);
  }

  return pages;
}
