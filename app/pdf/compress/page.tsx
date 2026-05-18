"use client";

import dynamic from "next/dynamic";

const PDFCompressComponent = dynamic(
  () => import("./CompressComponent"),
  { ssr: false }
);

export default function PDFCompressPage() {
  return <PDFCompressComponent />;
}
