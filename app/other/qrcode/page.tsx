"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function QRCodePage() {
  const [inputText, setInputText] = useState("https://zavclip.com");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const generateQRCode = async () => {
    if (!inputText.trim()) {
      setQrUrl(null);
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    try {
      const url = await QRCode.toDataURL(inputText, {
        width: 400,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
      setErrorMsg("Không thể tạo mã QR. Dữ liệu nhập vào quá dài hoặc không đúng định dạng.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [inputText, fgColor, bgColor]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/other"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích
          </Link>
          <span className="text-xs bg-indigo-100 dark:bg-indigo-950/50 text-indigo-755 dark:text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-medium">
            🔒 Tạo offline - Dữ liệu bảo mật tuyệt đối không gửi lên mạng
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>📱</span> Tạo Mã QR Cá Nhân Hóa
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tạo mã QR code từ liên kết website, số điện thoại hoặc tin nhắn bất kỳ, tùy chỉnh màu sắc cá tính riêng.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left panel options (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
              Nội dung mã QR
            </h3>

            {/* Input URL/Text */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Đường dẫn URL hoặc Văn bản</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập link website (ví dụ: https://zavclip.com) hoặc thông tin cần tạo QR..."
                className="w-full h-24 bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl p-3 text-xs focus:outline-none focus:border-indigo-500 dark:text-white"
              />
            </div>

            {/* Color controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Màu nét vẽ QR</label>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] font-mono font-bold uppercase">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5">Màu nền giấy</label>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] font-mono font-bold uppercase">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Presets styling shortcuts */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Chọn nhanh bảng màu</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { fg: "#000000", bg: "#ffffff", label: "Classic" },
                  { fg: "#1e3a8a", bg: "#eff6ff", label: "Royal" },
                  { fg: "#065f46", bg: "#ecfdf5", label: "Forest" },
                  { fg: "#7c3aed", bg: "#faf5ff", label: "Purple" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setFgColor(item.fg); setBgColor(item.bg); }}
                    className="px-2.5 py-1 text-[9px] font-bold border border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-950 rounded-lg hover:border-gray-300 dark:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Preview Panel (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
              Ảnh mã QR tạo ra
            </h3>

            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-center text-xs w-full animate-fade-in">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Checkered wrapper preview */}
            <div
              className="p-8 rounded-2xl border border-gray-250 dark:border-gray-700 w-full aspect-square max-w-[280px] flex items-center justify-center shadow-inner overflow-hidden"
              style={{
                backgroundImage: "radial-gradient(#ccc 15%, transparent 15%), radial-gradient(#ccc 15%, transparent 15%)",
                backgroundPosition: "0 0, 6px 6px",
                backgroundSize: "12px 12px",
                backgroundColor: "#f5f5f5"
              }}
            >
              {qrUrl ? (
                <img src={qrUrl} alt="QR Code" className="w-full h-full object-contain shadow-md rounded-lg" />
              ) : (
                <span className="text-xs text-gray-400 italic">Nhập dữ liệu để tạo QR...</span>
              )}
            </div>

            {/* Action download */}
            <button
              onClick={handleDownload}
              disabled={!qrUrl || isProcessing}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>📥</span> Tải Hình Mã QR (PNG)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
