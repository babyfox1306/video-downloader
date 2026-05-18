"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import mammoth from "mammoth";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function WordToPDFComponent() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const renderRef = useRef<HTMLDivElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setPdfBlobUrl(null);
      setErrorMsg("");
    }
  };

  const handleWordToPdf = async () => {
    if (!file || !renderRef.current) return;

    setIsProcessing(true);
    setErrorMsg("");
    setPdfBlobUrl(null);
    setProgressMsg("Đang đọc và phân tích cấu trúc tệp Word (.docx)...");

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Convert Word DOCX to HTML using mammoth
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const htmlContent = result.value;

      if (!htmlContent.trim()) {
        throw new Error("Tài liệu Word rỗng hoặc không chứa nội dung văn bản.");
      }

      // Render the HTML into our hidden render element
      renderRef.current.innerHTML = htmlContent;

      setProgressMsg("Đang dựng và dàn trang văn bản tài liệu...");
      
      // Wait a short moment for styles & fonts to stabilize in DOM
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Render to canvas via html2canvas
      const canvas = await html2canvas(renderRef.current, {
        scale: 2.0, // High-quality rendering scale
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff"
      });

      setProgressMsg("Đang tạo trang PDF...");
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Math for splitting long vertical canvas into multiple A4 pages
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight; // Shift up to show next section
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
        heightLeft -= pageHeight;
      }

      setProgressMsg("Đang đóng gói và lưu tệp PDF...");
      const blob = pdf.output("blob");
      setPdfBlobUrl(URL.createObjectURL(blob));

      // Clean up DOM render space
      renderRef.current.innerHTML = "";

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Không thể chuyển đổi file Word này. Đảm bảo file có đuôi chuẩn là `.docx` và không bị lỗi khóa bảo mật.");
      if (renderRef.current) renderRef.current.innerHTML = "";
    } finally {
      setIsProcessing(false);
      setProgressMsg("");
    }
  };

  const handleDownload = () => {
    if (!pdfBlobUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    const link = document.createElement("a");
    link.href = pdfBlobUrl;
    link.download = `${cleanName}.pdf`;
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
            🔒 Bảo mật tuyệt đối - Tài liệu dịch offline 100% tại máy bạn
          </span>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>📝</span> Chuyển Word sang PDF (Word to PDF)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Chuyển đổi tệp tài liệu văn phòng dạng Word `.docx` sang định dạng tệp tài liệu PDF giữ nguyên phông chữ hoàn toàn offline.
        </p>

        {!file ? (
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept=".docx"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">📝</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả file Word .docx của bạn vào đây hoặc click để chọn
            </p>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ tệp định dạng .docx của Microsoft Word</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-6">
              <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                Chuyển đổi tài liệu
              </h3>

              <div className="bg-gray-55 dark:bg-gray-900 p-4 rounded-xl border border-gray-150 dark:border-gray-800 space-y-1">
                <p className="text-xs text-gray-600 dark:text-gray-400">File đang chọn:</p>
                <p className="font-bold text-xs text-gray-800 dark:text-gray-200 truncate">{fileName}</p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleWordToPdf}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs md:text-sm"
                >
                  {isProcessing ? "Đang xử lý..." : "📝 Bắt Đầu Chuyển Sang PDF"}
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
                Kết quả tệp xuất
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

              {!pdfBlobUrl && !isProcessing && (
                <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center justify-center space-y-2 shadow-inner min-h-[160px]">
                  <span className="text-4xl">📄</span>
                  <p className="font-bold text-xs text-gray-500 italic text-center">Đang chờ lệnh chuyển đổi tài liệu...</p>
                </div>
              )}

              {pdfBlobUrl && (
                <div className="w-full space-y-4">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-850 rounded-xl text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Đã chuyển đổi tệp tài liệu Word sang PDF thành công!
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-emerald-500/10"
                  >
                    📥 Tải Tài Liệu PDF Về Máy
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="absolute left-[-9999px] top-[-9999px]">
        <div
          ref={renderRef}
          style={{
            width: "800px",
            padding: "40px",
            background: "white",
            color: "black",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            lineHeight: "1.6"
          }}
          className="prose max-w-none"
        />
      </div>
    </div>
  );
}
