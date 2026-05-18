"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type SVGInputType = "file" | "code";

export default function SVGToPNGPage() {
  const [inputType, setInputType] = useState<SVGInputType>("file");
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [svgCode, setSvgCode] = useState("");
  const [fileName, setFileName] = useState("vector.svg");
  
  const [scale, setScale] = useState(2); // 1x, 2x, 3x, 4x for high resolution rasterization
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setErrorMsg("");
      setSvgFile(file);
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSvgCode(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const renderSvgToPng = () => {
    if (!svgCode.trim()) {
      setPngUrl(null);
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      // Clean up inline SVG if needed or encode it safely as data URI blob
      const svgBlob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
      const blobUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) {
          setErrorMsg("Không thể khởi tạo môi trường vẽ canvas.");
          setIsProcessing(false);
          return;
        }

        // Calculate sizes based on scale factor to ensure crispness
        const w = (img.naturalWidth || 300) * scale;
        const h = (img.naturalHeight || 300) * scale;

        canvas.width = w;
        canvas.height = h;

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob((blob) => {
          if (blob) {
            setPngUrl(URL.createObjectURL(blob));
          }
          setIsProcessing(false);
        }, "image/png");

        URL.revokeObjectURL(blobUrl);
      };

      img.onerror = () => {
        setErrorMsg("Mã SVG không hợp lệ hoặc chứa lỗi cấu trúc thẻ.");
        setIsProcessing(false);
      };

      img.src = blobUrl;
    } catch (err) {
      setErrorMsg("Đã xảy ra lỗi khi dịch SVG sang PNG.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    renderSvgToPng();
  }, [svgCode, scale]);

  const handleDownload = () => {
    if (!pngUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${cleanName}-${scale}x.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/image"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Ảnh
          </Link>
          <span className="text-xs bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-medium">
            🔒 Xử lý 100% offline - Vector vẽ trực tiếp tại máy bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🎨</span> Trình Đổi Đuôi SVG sang PNG
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Chuyển đổi đồ họa vector định dạng `.svg` sang hình ảnh PNG nền trong suốt sắc nét với khả năng phóng to độ phân giải tùy chọn.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel source SVG (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            
            {/* Input toggle */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Phương thức nhập SVG</label>
              <div className="flex bg-gray-50 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setInputType("file")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inputType === "file" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                  }`}
                >
                  Tải File Lên
                </button>
                <button
                  onClick={() => setInputType("code")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inputType === "code" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-850"
                  }`}
                >
                  Dán Mã Code
                </button>
              </div>
            </div>

            {/* Scale multiplier */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Độ phân giải phóng to</label>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { id: 1, label: "1x (Chuẩn)" },
                  { id: 2, label: "2x (Nét)" },
                  { id: 3, label: "3x (Rõ)" },
                  { id: 4, label: "4x (Cực nét)" }
                ]).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setScale(s.id)}
                    className={`py-2 px-1 border rounded-xl text-[10px] font-bold transition-all ${
                      scale === s.id
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input area */}
            {inputType === "file" ? (
              <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 bg-gray-50 dark:bg-gray-950/50 hover:bg-gray-100 dark:hover:bg-gray-950/80 transition-all relative cursor-pointer min-h-[140px]">
                <input
                  type="file"
                  accept=".svg"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span className="text-3xl mb-2">🎨</span>
                <p className="font-bold text-gray-700 dark:text-gray-350 text-xs text-center">
                  {svgFile ? `Chọn: ${fileName}` : "Click chọn file .svg"}
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mã thẻ SVG</label>
                <textarea
                  value={svgCode}
                  onChange={(e) => {
                    setSvgCode(e.target.value);
                    setFileName("vector.svg");
                  }}
                  placeholder='Dán đoạn mã thẻ <svg ...> tại đây'
                  className="w-full h-36 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-blue-500 dark:text-white"
                />
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs">
                ⚠️ {errorMsg}
              </div>
            )}

          </div>

          {/* Right Preview Panel (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
              Ảnh PNG xuất ra xem trước
            </h3>

            {/* Transparency checkered background wrapper */}
            <div
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(#ccc 20%, transparent 20%), radial-gradient(#ccc 20%, transparent 20%)",
                backgroundPosition: "0 0, 8px 8px",
                backgroundSize: "16px 16px",
                backgroundColor: "#f0f0f0"
              }}
            >
              {pngUrl ? (
                <img src={pngUrl} alt="SVG rendered PNG" className="max-w-full max-h-[300px] object-contain drop-shadow-md" />
              ) : (
                <span className="text-xs text-gray-400 italic font-medium">Đang đợi file vector SVG đầu vào...</span>
              )}
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!pngUrl || isProcessing}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>💾</span> Tải Ảnh Trong Suốt (PNG)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
