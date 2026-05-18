"use client";

import Link from "next/link";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";

interface PDFQueueItem {
  id: string;
  file: File;
  name: string;
  sizeStr: string;
}

export default function PDFMergePage() {
  const [queue, setQueue] = useState<PDFQueueItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [progressMsg, setProgressMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      const newItems = Array.from(selected).map((file, i) => ({
        id: `pdf-merge-${Date.now()}-${i}`,
        file,
        name: file.name,
        sizeStr: (file.size / 1024 / 1024).toFixed(2) + " MB"
      }));
      setQueue((prev) => [...prev, ...newItems]);
      setMergedBlobUrl(null);
      setErrorMsg("");
    }
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= queue.length) return;

    const newQueue = [...queue];
    const temp = newQueue[index];
    newQueue[index] = newQueue[nextIndex];
    newQueue[nextIndex] = temp;
    
    setQueue(newQueue);
    setMergedBlobUrl(null);
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    setMergedBlobUrl(null);
  };

  const handleMerge = async () => {
    if (queue.length < 2) {
      setErrorMsg("Vui lòng tải lên ít nhất 2 file PDF để gộp.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");
    setProgressMsg("Đang đọc và ghép các file PDF đầu vào...");

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < queue.length; i++) {
        setProgressMsg(`Đang gộp file ${i + 1}/${queue.length}: ${queue[i].name}...`);
        const fileBytes = await queue[i].file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileBytes);
        
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      setProgressMsg("Đang lưu trữ tệp PDF gộp...");
      const mergedPdfBytes = await mergedPdf.save();
      const mergedBlob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(mergedBlob);
      
      setMergedBlobUrl(url);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi trong quá trình gộp. File PDF có thể đã bị mã hóa hoặc lỗi cấu trúc.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!mergedBlobUrl) return;
    const link = document.createElement("a");
    link.href = mergedBlobUrl;
    link.download = `merged-document-${Date.now()}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/pdf"
            className="text-sm font-semibold text-rose-600 dark:text-rose-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ PDF
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-450 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 File không gửi lên server - Gộp PDF an toàn tuyệt đối
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🔗</span> Gộp Nhiều File PDF làm một
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Ghép nối nhiều tệp tin PDF nhỏ riêng lẻ thành một file tài liệu duy nhất trực tuyến miễn phí và an toàn.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left operations list (col: 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Drag drop zone */}
            <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl p-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-sm">
              <input
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-4xl mb-3">📁</span>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                Kéo thả các file PDF vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-gray-400 mt-1">Chọn từ 2 file PDF trở lên để ghép nối</p>
            </div>

            {/* Queue items list */}
            {queue.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Danh sách file cần gộp</h3>
                  <button
                    onClick={() => { setQueue([]); setMergedBlobUrl(null); }}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[300px] overflow-y-auto pr-1">
                  {queue.map((item, idx) => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">
                          {idx + 1}. {item.name}
                        </p>
                        <p className="text-[10px] text-gray-450 mt-0.5">Dung lượng: {item.sizeStr}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveItem(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 text-gray-500 hover:text-rose-500 disabled:opacity-30 cursor-pointer text-xs"
                          title="Di chuyển lên"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveItem(idx, "down")}
                          disabled={idx === queue.length - 1}
                          className="p-1 text-gray-500 hover:text-rose-500 disabled:opacity-30 cursor-pointer text-xs"
                          title="Di chuyển xuống"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-rose-550 hover:text-rose-700 cursor-pointer text-xs ml-1"
                          title="Xóa khỏi danh sách"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right actions (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
              Ghép tệp tin PDF
            </h3>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs w-full">
                ⚠️ {errorMsg}
              </div>
            )}

            {isProcessing && (
              <div className="w-full p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-xl text-center text-xs space-y-2">
                <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-bold animate-pulse">{progressMsg}</p>
              </div>
            )}

            {!mergedBlobUrl ? (
              <button
                onClick={handleMerge}
                disabled={queue.length < 2 || isProcessing}
                className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                🔗 Bắt Đầu Gộp PDF
              </button>
            ) : (
              <div className="w-full space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-center text-xs font-bold">
                  ✓ Đã gộp thành công {queue.length} file PDF!
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                >
                  📥 Tải File PDF Gộp Về Máy
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
