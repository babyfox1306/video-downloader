"use client";

import Link from "next/link";
import { useState } from "react";
import { jsPDF } from "jspdf";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

type CompressionLevel = "low" | "medium" | "strong";

export default function PDFCompressComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [originalSizeStr, setOriginalSizeStr] = useState("");
  const [compressedSizeStr, setCompressedSizeStr] = useState("");
  const [reductionPercent, setReductionPercent] = useState<number | null>(null);

  const [level, setLevel] = useState<CompressionLevel>("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setOriginalSizeStr((selected.size / 1024 / 1024).toFixed(2) + " MB");
      setCompressedUrl(null);
      setCompressedSizeStr("");
      setReductionPercent(null);
      setErrorMsg("");
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    setIsProcessing(true);
    setErrorMsg("");
    setCompressedUrl(null);
    setProgressMsg("Đang đọc tệp tin PDF...");

    try {
      const fileBytes = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      let scale = 1.2;
      let quality = 0.6;

      if (level === "low") {
        scale = 1.5;
        quality = 0.8;
      } else if (level === "strong") {
        scale = 0.85;
        quality = 0.45;
      }

      const pdfOut = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setProgressMsg(`Đang nén trang ${pageNum}/${numPages}...`);
        
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not initialize canvas context");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        await page.render(renderContext as any).promise;

        const imgData = canvas.toDataURL("image/jpeg", quality);

        if (pageNum > 1) {
          pdfOut.addPage();
        }

        const pageWidth = pdfOut.internal.pageSize.getWidth();
        const pageHeight = pdfOut.internal.pageSize.getHeight();

        pdfOut.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");
      }

      setProgressMsg("Đang nén và đóng gói PDF...");
      const outBlob = pdfOut.output("blob");
      
      const compressedSize = outBlob.size;
      const originalSize = file.size;

      const sizeStr = (compressedSize / 1024 / 1024).toFixed(2) + " MB";
      const diff = ((originalSize - compressedSize) / originalSize) * 100;

      setCompressedSizeStr(sizeStr);
      setReductionPercent(diff > 0 ? Math.round(diff) : 0);
      setCompressedUrl(URL.createObjectURL(outBlob));

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Không thể nén tệp PDF này. PDF có thể đã được bảo mật khóa mật khẩu.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!compressedUrl || !file) return;
    const cleanName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `compressed-${cleanName}.pdf`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/pdf"
            className="text-sm font-semibold text-rose-600 dark:text-rose-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ PDF
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 File không gửi lên server - Dữ liệu bảo mật tuyệt đối
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>📉</span> Nén File PDF Offline
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Giảm dung lượng tệp PDF của bạn bằng cách tối ưu hóa các trang văn bản và hình ảnh nhúng, giúp chia sẻ dễ dàng hơn.
        </p>

        {!file ? (
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">📉</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả tệp PDF của bạn vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400 mt-2">Dung lượng tối ưu cho file &lt; 50MB</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                Mức độ nén PDF
              </h3>

              <div className="space-y-3">
                {([
                  { id: "low", name: "Nén Ít (Chất lượng cao)", desc: "Giữ hình ảnh rõ nhất, kích thước giảm ít" },
                  { id: "medium", name: "Nén Vừa (Khuyên dùng)", desc: "Sự cân bằng tốt nhất giữa kích thước & chất lượng" },
                  { id: "strong", name: "Nén Mạnh (Dung lượng nhỏ)", desc: "Giảm mạnh dung lượng tệp, ảnh có thể hơi mờ" }
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLevel(item.id)}
                    className={`w-full text-left p-3.5 border rounded-xl transition-all ${
                      level === item.id
                        ? "bg-rose-500 border-rose-500 text-white shadow-sm"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    <h4 className="text-xs font-bold">{item.name}</h4>
                    <p className={`text-[9px] mt-0.5 ${level === item.id ? "text-rose-100" : "text-gray-450"}`}>
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? "Đang xử lý..." : "📉 Bắt Đầu Nén PDF"}
                </button>

                <button
                  onClick={() => setFile(null)}
                  disabled={isProcessing}
                  className="w-full mt-3 text-center text-xs text-rose-500 font-bold hover:underline"
                >
                  Chọn file khác
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Kết quả nén tệp
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

              {!compressedUrl ? (
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center justify-center space-y-2.5 shadow-inner min-h-[160px]">
                  <span className="text-4xl">📄</span>
                  <div className="text-center">
                    <p className="font-bold text-sm text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-455 mt-1">Dung lượng gốc: <strong>{originalSizeStr}</strong></p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-6">
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 p-6 rounded-2xl flex flex-col items-center space-y-3 shadow-sm">
                    <span className="text-3xl">🎉</span>
                    <div className="text-center space-y-1">
                      <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-450">Nén PDF thành công!</h4>
                      <p className="text-xs text-gray-650 dark:text-gray-450">Dung lượng gốc: <strong>{originalSizeStr}</strong></p>
                      <p className="text-xs text-gray-650 dark:text-gray-455">Dung lượng mới: <strong className="text-emerald-500">{compressedSizeStr}</strong></p>
                      {reductionPercent !== null && reductionPercent > 0 && (
                        <p className="text-sm font-bold text-emerald-500 mt-2 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1 rounded-full inline-block">
                          Tiết kiệm được -{reductionPercent}% dung lượng!
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải Tệp PDF Đã Nén Về Máy
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
