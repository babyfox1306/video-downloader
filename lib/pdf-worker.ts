import * as pdfjsLib from "pdfjs-dist";

// Match worker to installed pdfjs-dist (package.json)
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();
}

export { pdfjsLib };
