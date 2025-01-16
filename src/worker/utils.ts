export async function runPDFWorker(
  pdfBuffer: Uint8Array
): Promise<Uint8Array[]> {
  const worker = new Worker(new URL("./pdf-worker.ts", import.meta.url).href, {
    type: "module",
  });

  try {
    const pages = await new Promise<Uint8Array[]>((resolve, reject) => {
      worker.onmessage = (evt) => {
        if (evt.data.error) {
          reject(new Error(evt.data.error));
        } else {
          resolve(evt.data);
        }
      };
      worker.onerror = (error) => reject(error);
      worker.postMessage(pdfBuffer);
    });

    return pages;
  } finally {
    worker.terminate();
  }
}
