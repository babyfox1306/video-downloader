"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function CleanTextPage() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [tabsToSpaces, setTabsToSpaces] = useState(true);
  const [normalizePunctuation, setNormalizePunctuation] = useState(false);
  const [removeSpecialChars, setRemoveSpecialChars] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutput(processCleanText(text));
  }, [text, trimLines, removeEmptyLines, tabsToSpaces, normalizePunctuation, removeSpecialChars]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cleaned-text-${Date.now()}.txt`;
    link.click();
  };

  function processCleanText(raw: string): string {
    if (!raw) return "";
    let res = raw;

    // Convert tabs to spaces
    if (tabsToSpaces) {
      res = res.replace(/\t/g, "    ");
    }

    // Split into lines
    let lines = res.split("\n");

    // Trim lines
    if (trimLines) {
      lines = lines.map((line) => line.trim());
    }

    // Remove empty lines
    if (removeEmptyLines) {
      lines = lines.filter((line) => line.length > 0);
    }

    res = lines.join("\n");

    // Normalize Vietnamese punctuation spacing (e.g. "chữ , nghĩa ." -> "chữ, nghĩa.")
    if (normalizePunctuation) {
      res = res
        .replace(/\s+([.,!?;:])\s*/g, "$1 ") // Put punctuation immediately after word
        .replace(/\s+/g, " ")                // Collapse consecutive spaces
        .replace(/\n\s+/g, "\n");            // Remove space at start of line
    }

    // Remove special characters (keep Vietnamese chars, alphanumeric, basic punctuation)
    if (removeSpecialChars) {
      res = res.replace(/[^a-zA-Z0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÂÊÔƠƯưăâêôơư\s.,!?;:\-_]/g, "");
    }

    return res;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Xử lý offline - Dữ liệu văn bản tuyệt đối an toàn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🧹 Dọn dẹp văn bản
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Chuẩn hóa văn bản bị lỗi khoảng trắng, xóa dòng trống thừa, sửa lỗi khoảng cách trước dấu câu hoặc loại bỏ ký tự lạ.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Options Panel (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-6">
            <div>
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-150 dark:border-gray-750 pb-2 mb-4">
                Tùy chọn dọn dẹp
              </h3>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={trimLines}
                    onChange={(e) => setTrimLines(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                  />
                  Xóa khoảng trắng đầu/cuối dòng
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={removeEmptyLines}
                    onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                  />
                  Xóa bỏ toàn bộ dòng trắng thừa
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={tabsToSpaces}
                    onChange={(e) => setTabsToSpaces(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                  />
                  Đổi Tab sang khoảng trắng
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={normalizePunctuation}
                    onChange={(e) => setNormalizePunctuation(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                  />
                  Chuẩn hóa dấu câu tiếng Việt
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={removeSpecialChars}
                    onChange={(e) => setRemoveSpecialChars(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
                  />
                  Xóa tất cả ký tự đặc biệt
                </label>
              </div>
            </div>

            {/* Upload block */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Hoặc nạp file văn bản (.txt)
              </label>
              <div className="relative border border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-900/35 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-xl mb-1 block">📁</span>
                <p className="text-xs font-bold text-gray-500">Tải file .txt từ máy tính</p>
              </div>
            </div>
          </div>

          {/* Editors Grid (col: 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Input textarea */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-5 space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Văn bản gốc cần xử lý
              </label>
              <textarea
                placeholder="Nhập hoặc dán văn bản bị lỗi, lộn xộn vào đây..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-44 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-150 leading-relaxed font-sans"
              />
            </div>

            {/* Output textarea */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-5 space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Văn bản sạch sau khi dọn dẹp
                </label>
                {output && (
                  <span className="text-[10px] text-gray-400">
                    Đã giảm: <strong>{text.length - output.length}</strong> ký tự dư thừa
                  </span>
                )}
              </div>

              <textarea
                readOnly
                value={output}
                placeholder="Văn bản sạch sẽ tự động xuất hiện tại đây..."
                className="w-full h-52 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs text-gray-800 dark:text-gray-100 leading-relaxed font-sans focus:outline-none"
              />

              {output && (
                <div className="flex gap-3 justify-end pt-1">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    {copied ? "✓ Đã copy" : "📋 Sao chép"}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    📥 Tải file .txt sạch
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
