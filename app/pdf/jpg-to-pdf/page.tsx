"use client";

import Link from "next/link";
import { useState } from "react";
import { jsPDF } from "jspdf";

interface ImageQueueItem {
  id: string;
  file: File;
  name: string;
  dataUrl: string;
  sizeStr: string;
}

type PageLayout = "fit" | "a4";

export default function JPGToPDFPage() {
  const [queue, setQueue] = useState<ImageQueueItem[]>([]);
  const [layout, setLayout] = useState<PageLayout>("a4");

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) {
      const newItems = Array.from(selected).map((file, i) => {
        const url = URL.createObjectURL(file);
        return {
          id: `jpg-to-pdf-${Date.now()}-${i}`,
          file,
          name: file.name,
          dataUrl: url,
          sizeStr: (file.size / 1024).toFixed(1) + " KB"
        };
      });

      setQueue((prev) => [...prev, ...newItems]);
      setPdfBlobUrl(null);
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
    setPdfBlobUrl(null);
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
    setPdfBlobUrl(null);
  };

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = url;
    });
  };

  const handleCreatePdf = async () => {
    if (queue.length === 0) {
      setErrorMsg("Vui lòng thêm ít nhất 1 hình ảnh.");
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");
    setPdfBlobUrl(null);
    setProgressMsg("Đang chuẩn bị ghép các trang ảnh...");

    try {
      let pdf: jsPDF | null = null;

      for (let i = 0; i < queue.length; i++) {
        setProgressMsg(`Đang xử lý trang ${i + 1}/${queue.length}: ${queue[i].name}...`);
        const img = await loadImage(queue[i].dataUrl);

        const w = img.naturalWidth;
        const h = img.naturalHeight;

        // Determine orientation
        const orientation = w > h ? "landscape" : "portrait";

        if (i === 0) {
          // Initialize PDF
          if (layout === "fit") {
            pdf = new jsPDF({
              orientation: orientation,
              unit: "px",
              format: [w, h]
            });
          } else {
            // A4
            pdf = new jsPDF({
              orientation: orientation,
              unit: "pt",
              format: "a4"
            });
          }
        } else if (pdf) {
          // Add subsequent page
          if (layout === "fit") {
            pdf.addPage([w, h], orientation);
          } else {
            pdf.addPage("a4", orientation);
          }
        }

        if (pdf) {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          pdf.addImage(queue[i].dataUrl, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
        }
      }

      if (pdf) {
        setProgressMsg("Đang đóng gói và lưu tài liệu PDF...");
        const blob = pdf.output("blob");
        setPdfBlobUrl(URL.createObjectURL(blob));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi tạo tệp PDF từ ảnh. Vui lòng kiểm tra lại chất lượng file ảnh.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download = `document-images-${Date.now()}.pdf`;
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
            🔒 Bảo mật 100% - Ảnh không rời khỏi máy tính của bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          📄 Ảnh thành file PDF
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Ghép nhiều ảnh tài liệu, hóa đơn đuôi JPG, PNG thành một file PDF hoàn chỉnh và chuyên nghiệp.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel files queue (col: 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Drag drop zone */}
            <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl p-8 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-sm">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-4xl mb-3">📸</span>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                Kéo thả các hình ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, JPEG, PNG, WEBP, BMP...</p>
            </div>

            {/* Queue items list */}
            {queue.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-4 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-xs text-gray-400 uppercase tracking-wider">Danh sách các trang ảnh</h3>
                  <button
                    onClick={() => { setQueue([]); setPdfBlobUrl(null); }}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[300px] overflow-y-auto pr-1">
                  {queue.map((item, idx) => (
                    <div key={item.id} className="flex justify-between items-center py-3">
                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <img src={item.dataUrl} alt="Thumbnail" className="w-10 h-10 object-cover rounded border" />
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">
                            Trang {idx + 1}: {item.name}
                          </p>
                          <p className="text-[10px] text-gray-450 mt-0.5">{item.sizeStr}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveItem(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 text-gray-500 hover:text-rose-550 disabled:opacity-30 cursor-pointer text-xs"
                          title="Di chuyển lên"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveItem(idx, "down")}
                          disabled={idx === queue.length - 1}
                          className="p-1 text-gray-500 hover:text-rose-550 disabled:opacity-30 cursor-pointer text-xs"
                          title="Di chuyển xuống"
                        >
                          ▼
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-rose-550 hover:text-rose-700 cursor-pointer text-xs ml-1"
                          title="Xóa trang"
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

          {/* Right layout actions (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
              Khung trang PDF đầu ra
            </h3>

            {/* Layout options toggler */}
            <div className="w-full space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase">Khổ trang giấy</label>
              <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-750">
                <button
                  onClick={() => { setLayout("a4"); setPdfBlobUrl(null); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    layout === "a4" ? "bg-rose-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                  }`}
                >
                  Standard A4 📄
                </button>
                <button
                  onClick={() => { setLayout("fit"); setPdfBlobUrl(null); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    layout === "fit" ? "bg-rose-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                  }`}
                >
                  Vừa cỡ ảnh gốc 📐
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs w-full animate-fade-in">
                ⚠️ {errorMsg}
              </div>
            )}

            {isProcessing && (
              <div className="w-full p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded-xl text-center text-xs space-y-2">
                <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-bold animate-pulse">{progressMsg}</p>
              </div>
            )}

            {!pdfBlobUrl ? (
              <button
                onClick={handleCreatePdf}
                disabled={queue.length === 0 || isProcessing}
                className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                📄 Tạo file PDF
              </button>
            ) : (
              <div className="w-full space-y-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 text-emerald-600 dark:text-emerald-400 rounded-xl text-center text-xs font-bold">
                  ✓ Ghép {queue.length} trang PDF thành công!
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                >
                  📥 Tải File PDF Về Máy
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
