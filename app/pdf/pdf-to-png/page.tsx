"use client";

import dynamic from "next/dynamic";

const PDFToPNGComponent = dynamic(
  () => import("./PDFToPNGComponent"),
  { ssr: false }
);

export default function PDFToPNGPage() {
  return <PDFToPNGComponent />;
}
