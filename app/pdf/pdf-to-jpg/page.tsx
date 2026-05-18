"use client";

import dynamic from "next/dynamic";

const PDFToJPGComponent = dynamic(
  () => import("./PDFToJPGComponent"),
  { ssr: false }
);

export default function PDFToJPGPage() {
  return <PDFToJPGComponent />;
}
