"use client";

import Link from "next/link";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export default function PDFToTXTComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setErrorMsg("");
      setFile(selected);
      setFileName(selected.name);
      setExtractedText("");

      try {
        const fileBytes = await selected.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);
      } catch (err) {
        setErrorMsg("Không thể đọc tệp PDF này. PDF có thể đã bị khóa bảo vệ.");
      }
    }
  };

  const handleExtractText = async () => {
    if (!file || totalPages === 0) return;

    setIsProcessing(true);
    setErrorMsg("");
    setExtractedText("");
    setProgressMsg("Đang kết nối phân tích tài liệu...");

    try {
      const fileBytes = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
      const pdf = await loadingTask.promise;
      const count = pdf.numPages;

      let combinedText = "";

      for (let i = 1; i <= count; i++) {
        setProgressMsg(`Đang trích xuất chữ trang ${i}/${count}...`);
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");

        combinedText += `--- TRANG ${i} ---\n${pageText}\n\n`;
      }

      if (!combinedText.trim()) {
        setErrorMsg("Không tìm thấy văn bản dạng chữ trong file PDF này (Có thể PDF là một tấm ảnh scan thô).");
      } else {
        setExtractedText(combinedText);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi trong quá trình trích xuất văn bản.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cleanName}-extracted.txt`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/pdf"
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ PDF
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Bảo mật 100% - Phân tích tệp offline tại máy tính của bạn
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          🖨️ Lấy chữ từ PDF
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Đọc và sao chép văn bản bên trong file PDF, lưu trữ thành tệp văn bản thuần .txt để tiện ghi chú hoặc sửa đổi.
        </p>

        {!file ? (
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">🖨️</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả file PDF cần đọc chữ vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400 mt-2">Sao chép nhanh văn bản từ tài liệu PDF dạng text</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-855 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Trích xuất văn bản
              </h3>

              <p className="text-xs text-gray-500 leading-normal">
                Công cụ quét cấu trúc font nhúng trong tài liệu PDF để kéo ra phần nội dung văn bản text chính xác nhất mà không cần tải file lên mạng.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleExtractText}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
                >
                  {isProcessing ? "Đang trích xuất..." : "🖨️ Lấy chữ từ PDF"}
                </button>
              </div>

              <button
                onClick={() => setFile(null)}
                disabled={isProcessing}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn file khác
              </button>
            </div>

            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Văn bản đã quét được
              </h3>

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs w-full">
                  ⚠️ {errorMsg}
                </div>
              )}

              {isProcessing && (
                <div className="w-full p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-2xl text-center text-xs space-y-3 shadow-inner">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bold animate-pulse">{progressMsg}</p>
                </div>
              )}

              {!extractedText && !isProcessing && (
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center justify-center space-y-2 shadow-inner min-h-[220px]">
                  <span className="text-4xl">📄</span>
                  <div className="text-center">
                    <p className="font-bold text-xs text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</p>
                    <p className="text-[10px] text-gray-455 mt-1">
                      Tổng số trang: <strong>{totalPages} trang</strong>
                    </p>
                  </div>
                </div>
              )}

              {extractedText && (
                <div className="w-full space-y-4">
                  <textarea
                    value={extractedText}
                    readOnly
                    className="w-full h-64 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs font-mono text-gray-755 dark:text-gray-300 focus:outline-none focus:border-rose-500"
                  />
                  
                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải File Văn Bản (.txt)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
