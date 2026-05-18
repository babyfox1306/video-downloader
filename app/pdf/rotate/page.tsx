"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";

type RotateTarget = "all" | "specific";

export default function PDFRotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [target, setTarget] = useState<RotateTarget>("all");
  const [specificPage, setSpecificPage] = useState(1);
  const [angle, setAngle] = useState(90); // 90, 180, 270

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [rotatedBlobUrl, setRotatedBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setErrorMsg("");
      setFile(selected);
      setFileName(selected.name);
      setRotatedBlobUrl(null);

      try {
        const fileBytes = await selected.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        setSpecificPage(1);
      } catch (err) {
        setErrorMsg("Không thể đọc tệp PDF. PDF có thể đã bị mã hóa hoặc lỗi cấu trúc.");
      }
    }
  };

  const handleRotate = async () => {
    if (!file || totalPages === 0) return;

    setIsProcessing(true);
    setErrorMsg("");
    setRotatedBlobUrl(null);
    setProgressMsg("Đang đọc tệp tin PDF...");

    try {
      const fileBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();

      if (target === "all") {
        setProgressMsg(`Đang xoay tất cả ${totalPages} trang góc ${angle}°...`);
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i];
          const currRotation = page.getRotation().angle;
          page.setRotation(degrees((currRotation + angle) % 360));
        }
      } else {
        // Specific page
        if (specificPage < 1 || specificPage > totalPages) {
          setErrorMsg("Trang cần xoay không hợp lệ.");
          setIsProcessing(false);
          return;
        }
        setProgressMsg(`Đang xoay trang ${specificPage} góc ${angle}°...`);
        const page = pages[specificPage - 1];
        const currRotation = page.getRotation().angle;
        page.setRotation(degrees((currRotation + angle) % 360));
      }

      setProgressMsg("Đang lưu trữ tệp PDF đã xoay...");
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      setRotatedBlobUrl(URL.createObjectURL(blob));

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi xoay các trang PDF.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!rotatedBlobUrl || !file) return;
    const cleanName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const link = document.createElement("a");
    link.href = rotatedBlobUrl;
    link.download = `rotated-${cleanName}.pdf`;
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
            🔒 File không gửi lên server - Xoay trang PDF an toàn tuyệt đối
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🔁</span> Xoay Trang PDF
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Xoay ngược chiều các trang văn bản bị scan ngược 90 độ, 180 độ trong file PDF và lưu lại tệp tin hoàn toàn offline.
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
            <span className="text-5xl mb-4">🔁</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả file PDF cần xoay trang vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400 mt-2">Xoay và sửa nhanh trang scan lỗi</p>
          </div>
        ) : (
          /* Workspace Split View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left controls (col: 5) */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Cài đặt xoay trang
              </h3>

              {/* Target selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Đối tượng xoay</label>
                <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-750">
                  <button
                    onClick={() => setTarget("all")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      target === "all" ? "bg-rose-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                    }`}
                  >
                    Xoay Tất Cả
                  </button>
                  <button
                    onClick={() => setTarget("specific")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      target === "specific" ? "bg-rose-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                    }`}
                  >
                    Xoay 1 Trang Cụ Thể
                  </button>
                </div>
              </div>

              {/* Specific page input */}
              {target === "specific" && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Nhập trang cần xoay (Tối đa {totalPages} trang):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={specificPage}
                    onChange={(e) => setSpecificPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-rose-500 dark:text-white"
                  />
                </div>
              )}

              {/* Angle selection */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Góc xoay chiều</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { id: 90, label: "90° Sang Phải ➔" },
                    { id: 180, label: "180° Quay Ngược ↕" },
                    { id: 270, label: "90° Sang Trái ↵" }
                  ] as const).map((ang) => (
                    <button
                      key={ang.id}
                      onClick={() => setAngle(ang.id)}
                      className={`py-2 px-1 border rounded-xl text-[10px] font-bold transition-all ${
                        angle === ang.id
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                      }`}
                    >
                      {ang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start rotate action */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-750">
                <button
                  onClick={handleRotate}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
                >
                  {isProcessing ? "Đang xử lý..." : "🔁 Áp Dụng Xoay Trang PDF"}
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
                Bản xem kết quả
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

              {!rotatedBlobUrl ? (
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center justify-center space-y-2 shadow-inner min-h-[160px]">
                  <span className="text-4xl">📄</span>
                  <div className="text-center">
                    <p className="font-bold text-xs text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</p>
                    <p className="text-[10px] text-gray-455 mt-1">
                      Số lượng trang: <strong>{totalPages} trang</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Đã xoay các trang PDF thành công!
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải PDF Đã Xoay Về Máy
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
