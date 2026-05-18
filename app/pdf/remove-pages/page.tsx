"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function PDFRemovePagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [pagesInput, setPagesInput] = useState(""); // e.g. "2, 4, 7"

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [outputBlobUrl, setOutputBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setErrorMsg("");
      setFile(selected);
      setFileName(selected.name);
      setOutputBlobUrl(null);

      try {
        const fileBytes = await selected.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        setPagesInput("");
      } catch (err) {
        setErrorMsg("Không thể đọc tệp PDF này. PDF có thể đã bị mã hóa hoặc lỗi cấu trúc.");
      }
    }
  };

  const handleRemovePages = async () => {
    if (!file || totalPages === 0) return;

    if (!pagesInput.trim()) {
      setErrorMsg("Vui lòng nhập số trang cần xóa.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");
    setOutputBlobUrl(null);
    setProgressMsg("Đang đọc tệp tin PDF...");

    try {
      // Parse commas, spaces, dashes into unique page numbers
      const parsedPages = pagesInput
        .split(",")
        .map((p) => parseInt(p.trim()))
        .filter((num) => !isNaN(num) && num >= 1 && num <= totalPages);

      const uniquePages = Array.from(new Set(parsedPages));

      if (uniquePages.length === 0) {
        setErrorMsg("Các số trang đã nhập không hợp lệ.");
        setIsProcessing(false);
        return;
      }

      if (uniquePages.length >= totalPages) {
        setErrorMsg("Không thể xóa toàn bộ các trang. Tối thiểu phải giữ lại 1 trang.");
        setIsProcessing(false);
        return;
      }

      setProgressMsg(`Đang tiến hành loại bỏ ${uniquePages.length} trang thừa...`);
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);

      // Sort indices in descending order so that removing a page doesn't shift the indices of subsequent pages!
      const sortedIndices = uniquePages
        .map((p) => p - 1)
        .sort((a, b) => b - a);

      for (const idx of sortedIndices) {
        pdfDoc.removePage(idx);
      }

      setProgressMsg("Đang đóng gói và lưu tệp PDF mới...");
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      setOutputBlobUrl(URL.createObjectURL(blob));

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi loại bỏ các trang văn bản.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!outputBlobUrl || !file) return;
    const cleanName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const link = document.createElement("a");
    link.href = outputBlobUrl;
    link.download = `removed-pages-${cleanName}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/pdf"
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ PDF
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Bảo mật 100% - Tài liệu không rời khỏi trình duyệt của bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🗑️</span> Xóa Trang PDF Bất Kỳ
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Loại bỏ nhanh các trang lỗi, trang trống hoặc tài liệu thừa trong file PDF chỉ với một vài thao tác đơn giản.
        </p>

        {!file ? (
          /* File Upload Zone */
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">🗑️</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả file PDF của bạn vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400 mt-2">Dễ dàng loại bỏ trang không cần thiết</p>
          </div>
        ) : (
          /* Workspace Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left controls (col: 5) */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Nhập trang cần loại bỏ
              </h3>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  Trang muốn xóa (ví dụ: <strong>2, 4, 6</strong>):
                </label>
                <input
                  type="text"
                  value={pagesInput}
                  onChange={(e) => setPagesInput(e.target.value)}
                  placeholder="Nhập số trang viết cách bởi dấu phẩy..."
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-rose-500 dark:text-white font-mono"
                />
                <p className="text-[10px] text-gray-450 mt-1 leading-normal">
                  Nhập số trang cách nhau bởi dấu phẩy. Ví dụ để xóa trang 2, trang 4 và trang 5, hãy nhập: <strong>2, 4, 5</strong>
                </p>
              </div>

              {/* Start remove trigger */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-750">
                <button
                  onClick={handleRemovePages}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
                >
                  {isProcessing ? "Đang xử lý..." : "🗑️ Bắt Đầu Xóa Trang"}
                </button>
              </div>

              {/* Reset to select different PDF */}
              <button
                onClick={() => setFile(null)}
                disabled={isProcessing}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn file khác
              </button>
            </div>

            {/* Right Display Results (col: 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Kết quả tệp mới
              </h3>

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs w-full animate-fade-in">
                  ⚠️ {errorMsg}
                </div>
              )}

              {isProcessing && (
                <div className="w-full p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-2xl text-center text-xs space-y-3 shadow-inner">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="font-bold animate-pulse">{progressMsg}</p>
                </div>
              )}

              {!outputBlobUrl ? (
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center justify-center space-y-2 shadow-inner min-h-[160px]">
                  <span className="text-4xl">📄</span>
                  <div className="text-center">
                    <p className="font-bold text-xs text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</p>
                    <p className="text-[10px] text-gray-455 mt-1">
                      Tổng số trang gốc: <strong>{totalPages} trang</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Đã xóa trang thành công!
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải PDF Đã Lọc Trang Về Máy
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
