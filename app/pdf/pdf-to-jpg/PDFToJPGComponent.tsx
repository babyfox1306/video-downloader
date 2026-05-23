"use client";

import Link from "next/link";
import { useState } from "react";
import { pdfjsLib } from "@/lib/pdf-worker";
import JSZip from "jszip";

export default function PDFToJPGComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [zipBlobUrl, setZipBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setErrorMsg("");
      setFile(selected);
      setFileName(selected.name);
      setZipBlobUrl(null);

      try {
        const fileBytes = await selected.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
        const pdf = await loadingTask.promise;
        setTotalPages(pdf.numPages);
      } catch (err) {
        setErrorMsg("Không thể đọc tệp PDF này. Tệp có thể đã bị khóa mật khẩu bảo vệ.");
      }
    }
  };

  const handleConvertToJpg = async () => {
    if (!file || totalPages === 0) return;

    setIsProcessing(true);
    setErrorMsg("");
    setZipBlobUrl(null);
    setProgressMsg("Đang chuẩn bị trích xuất ảnh...");

    try {
      const zip = new JSZip();
      const fileBytes = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: fileBytes });
      const pdf = await loadingTask.promise;
      const count = pdf.numPages;

      const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

      for (let i = 1; i <= count; i++) {
        setProgressMsg(`Đang render trang ${i}/${count} thành JPG...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context init failed");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        await page.render(renderContext as any).promise;

        const imgDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        const base64Data = imgDataUrl.substring(imgDataUrl.indexOf(",") + 1);

        zip.file(`${cleanName}-trang-${i}.jpg`, base64Data, { base64: true });
      }

      setProgressMsg("Đang nén các tệp hình ảnh vào file ZIP...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setZipBlobUrl(URL.createObjectURL(zipBlob));

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Đã xảy ra lỗi khi chuyển đổi PDF sang ảnh.");
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!zipBlobUrl || !file) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const link = document.createElement("a");
    link.href = zipBlobUrl;
    link.download = `${cleanName}-images-jpg.zip`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/pdf"
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ PDF
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Bảo mật 100% - Tài liệu xử lý cục bộ tại máy tính của bạn
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          🖼️ PDF ra ảnh JPG
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tách toàn bộ các trang trong tệp tài liệu PDF và chuyển thành hình ảnh .jpg sắc nét hoàn toàn tự động và an toàn.
        </p>

        {!file ? (
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">🖼️</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả file PDF cần chuyển đổi vào đây hoặc click để chọn file
            </p>
            <p className="text-xs text-gray-400 mt-2">Dễ dàng trích xuất ảnh chất lượng cao</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-855 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Trích xuất ảnh JPG
              </h3>

              <p className="text-xs text-gray-500 leading-normal">
                Hệ thống sẽ render từng trang văn bản PDF với tỷ lệ phóng to <strong>2.0x</strong> để đảm bảo hình ảnh đầu ra luôn rõ nét, chữ viết không bị vỡ hạt, sau đó đóng gói tất cả vào 1 file nén `.zip`.
              </p>

              <div className="pt-2">
                <button
                  onClick={handleConvertToJpg}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
                >
                  {isProcessing ? "Đang xử lý..." : "🖼️ Chuyển PDF sang JPG"}
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

            <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Kết quả tệp ảnh
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

              {!zipBlobUrl && !isProcessing && (
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center justify-center space-y-2 shadow-inner min-h-[160px]">
                  <span className="text-4xl">📄</span>
                  <div className="text-center">
                    <p className="font-bold text-xs text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</p>
                    <p className="text-[10px] text-gray-455 mt-1">
                      Tổng số trang: <strong>{totalPages} trang</strong>
                    </p>
                  </div>
                </div>
              )}

              {zipBlobUrl && (
                <div className="w-full space-y-4">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Đã trích xuất {totalPages} ảnh JPG thành công!
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải File nén ZIP Ảnh JPG
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
