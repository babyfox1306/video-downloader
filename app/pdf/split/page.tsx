"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";

type SplitMode = "range" | "all";

export default function PDFSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [mode, setMode] = useState<SplitMode>("range");
  
  // Range selections
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [splitBlobUrl, setSplitBlobUrl] = useState<string | null>(null);
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setErrorMsg("");
      setFile(selected);
      setFileName(selected.name);
      setSplitBlobUrl(null);
      setZipBlobUrl(null);
      
      try {
        const fileBytes = await selected.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        setStartPage(1);
        setEndPage(count);
      } catch (err) {
        setErrorMsg("Không thể đọc tệp PDF này. PDF có thể đã bị mã hóa hoặc lỗi cấu trúc.");
      }
    }
  };

  const handleSplitRange = async () => {
    if (!file || totalPages === 0) return;
    
    if (startPage < 1 || endPage > totalPages || startPage > endPage) {
      setErrorMsg("Dải trang trích xuất không hợp lệ.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");
    setSplitBlobUrl(null);
    setProgressMsg(`Đang trích xuất trang ${startPage} đến ${endPage}...`);

    try {
      const fileBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(fileBytes);
      const splitPdf = await PDFDocument.create();

      // copy pages (0-indexed indices)
      const pageIndices: number[] = [];
      for (let i = startPage - 1; i <= endPage - 1; i++) {
        pageIndices.push(i);
      }

      const copiedPages = await splitPdf.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((page) => splitPdf.addPage(page));

      const splitBytes = await splitPdf.save();
      const splitBlob = new Blob([splitBytes as any], { type: "application/pdf" });
      setSplitBlobUrl(URL.createObjectURL(splitBlob));
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi trích xuất dải trang.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleSplitAll = async () => {
    if (!file || totalPages === 0) return;

    setIsProcessing(true);
    setErrorMsg("");
    setZipBlobUrl(null);
    setProgressMsg("Đang chia tách tất cả các trang...");

    try {
      const zip = new JSZip();
      const fileBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(fileBytes);
      const count = srcDoc.getPageCount();

      const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

      for (let i = 0; i < count; i++) {
        setProgressMsg(`Đang trích xuất trang ${i + 1}/${count}...`);
        const singlePdf = await PDFDocument.create();
        const [copiedPage] = await singlePdf.copyPages(srcDoc, [i]);
        singlePdf.addPage(copiedPage);

        const bytes = await singlePdf.save();
        zip.file(`${cleanName}-trang-${i + 1}.pdf`, bytes);
      }

      setProgressMsg("Đang nén các tệp PDF thành tệp ZIP tải về...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setZipBlobUrl(URL.createObjectURL(zipBlob));
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi chia tách hàng loạt trang.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const downloadFile = (url: string, suffix: string, ext: string) => {
    if (!file) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cleanName}-${suffix}.${ext}`;
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
            🔒 File không gửi lên máy chủ - Tách PDF an toàn tuyệt đối
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>✂️</span> Tách File PDF (Split PDF)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tách rời tệp PDF lớn thành từng trang lẻ độc lập hoặc trích xuất một dải trang cụ thể mà bạn muốn sử dụng.
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
            <span className="text-5xl mb-4">✂️</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả tệp PDF cần tách vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400 mt-2">Dành cho mọi tệp PDF không mã hóa bảo vệ</p>
          </div>
        ) : (
          /* Workspace Editor Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left controls (col: 5) */}
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Chế độ tách PDF
              </h3>

              {/* Mode toggler */}
              <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-750">
                <button
                  onClick={() => setMode("range")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "range" ? "bg-rose-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                  }`}
                >
                  Trích xuất Dải Trang
                </button>
                <button
                  onClick={() => setMode("all")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    mode === "all" ? "bg-rose-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                  }`}
                >
                  Tách Hết Thành File Lẻ
                </button>
              </div>

              {/* Input specifics */}
              {mode === "range" ? (
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-gray-500">Nhập dải trang muốn trích xuất (Tối đa {totalPages} trang):</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Trang bắt đầu</label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={startPage}
                        onChange={(e) => setStartPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Trang kết thúc</label>
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={endPage}
                        onChange={(e) => setEndPage(Math.max(1, Math.min(totalPages, parseInt(e.target.value) || 1)))}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-rose-500 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSplitRange}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
                  >
                    ✂️ Trích Xuất Dải Trang PDF
                  </button>
                </div>
              ) : (
                /* Split all */
                <div className="space-y-3 pt-2">
                  <p className="text-xs text-gray-500">
                    Tách tệp PDF thành {totalPages} file PDF riêng biệt. Toàn bộ các file sẽ được nén gọn trong 1 file `.zip` để tải về nhanh chóng.
                  </p>
                  
                  <button
                    onClick={handleSplitAll}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
                  >
                    ✂️ Tách Toàn Bộ Trang Vào File ZIP
                  </button>
                </div>
              )}

              {/* Reset to select different PDF */}
              <button
                onClick={() => setFile(null)}
                disabled={isProcessing}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🔄 Chọn file khác
              </button>
            </div>

            {/* Right Display Output Results (col: 7) */}
            <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Kết quả tách file
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

              {/* No output processed yet */}
              {!splitBlobUrl && !zipBlobUrl && !isProcessing && (
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center justify-center space-y-2 shadow-inner min-h-[160px]">
                  <span className="text-4xl">📄</span>
                  <div className="text-center">
                    <p className="font-bold text-xs text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</p>
                    <p className="text-[10px] text-gray-450 mt-1">
                      Tổng số trang: <strong>{totalPages} trang</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Output PDF range */}
              {splitBlobUrl && (
                <div className="w-full space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-450">
                    ✓ Đã trích xuất xong trang {startPage} đến {endPage}!
                  </div>
                  <button
                    onClick={() => downloadFile(splitBlobUrl, `trang-${startPage}-${endPage}`, "pdf")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải File PDF Trích Xuất Về Máy
                  </button>
                </div>
              )}

              {/* Output ZIP of all pages */}
              {zipBlobUrl && (
                <div className="w-full space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-450">
                    ✓ Đã tách tất cả {totalPages} trang vào tệp lưu trữ ZIP!
                  </div>
                  <button
                    onClick={() => downloadFile(zipBlobUrl, "tat-ca-trang", "zip")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải File nén ZIP Về Máy
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
