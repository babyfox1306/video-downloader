"use client";

import dynamic from "next/dynamic";

const WordToPDFComponent = dynamic(
  () => import("./WordToPDFComponent"),
  { ssr: false }
);

export default function WordToPDFPage() {
  return <WordToPDFComponent />;
}
