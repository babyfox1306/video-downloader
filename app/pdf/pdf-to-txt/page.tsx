"use client";

import dynamic from "next/dynamic";

const PDFToTXTComponent = dynamic(
  () => import("./PDFToTXTComponent"),
  { ssr: false }
);

export default function PDFToTXTPage() {
  return <PDFToTXTComponent />;
}
