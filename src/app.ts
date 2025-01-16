import { Hono } from "hono";
import { runPDFWorker } from "./worker/utils.ts";
import sharp from "sharp";

// @ts-types="npm:@types/archiver"
import archiver from "archiver";

export const app = new Hono();

// Health check endpoint
app.get("/", (c) => c.text("ok"));

// Main PDF processing endpoint
app.post("/pdf-to-images", async (c) => {
  const formData = await c.req.formData();
  const pdfFile = formData.get("pdf");
  if (!pdfFile || !(pdfFile instanceof File)) {
    return c.json({ error: "No PDF file uploaded" }, 400);
  }

  try {
    const pdfBuffer = await pdfFile.bytes();
    const pngPages = await runPDFWorker(pdfBuffer);
    const webpPagesStreams = pngPages.map((png) => sharp(png).webp());

    const zipStream = archiver("zip", { store: true });
    webpPagesStreams.forEach((page, i) => {
      zipStream.append(page, { name: `page-${i + 1}.webp` });
    });
    zipStream.finalize();

    return c.body(zipStream, 200, {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=pages.zip",
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return c.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      500
    );
  }
});

export default app;
