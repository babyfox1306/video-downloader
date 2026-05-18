"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";

type QRType = "url" | "text" | "wifi" | "email" | "phone" | "sms";

export default function QRGeneratorPage() {
  const [type, setType] = useState<QRType>("url");
  const [url, setUrl] = useState("https://zavclip.com");
  const [text, setText] = useState("");
  
  // WiFi state
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");

  // Email state
  const [emailTo, setEmailTo] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Phone / SMS
  const [phoneNum, setPhoneNum] = useState("");
  const [smsBody, setSmsBody] = useState("");

  // QR Customizations
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(300);

  const [qrDataUrl, setQrDataUrl] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate QR code data URL based on inputs
  const getQRStringUrl = () => {
    switch (type) {
      case "url":
        return url.trim() === "" ? "https://zavclip.com" : url.trim();
      case "text":
        return text;
      case "wifi":
        return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPass};;`;
      case "email":
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "phone":
        return `tel:${phoneNum}`;
      case "sms":
        return `smsto:${phoneNum}:${smsBody}`;
      default:
        return "";
    }
  };

  const generateQRCode = async () => {
    setErrorMsg("");
    const qrString = getQRStringUrl();
    if (!qrString) {
      setQrDataUrl("");
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(qrString, {
        width: qrSize,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor
        }
      });
      setQrDataUrl(dataUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Không thể tạo mã QR. Hãy kiểm tra lại dữ liệu đầu vào.");
    }
  };

  // Re-generate on parameter change
  useEffect(() => {
    generateQRCode();
  }, [type, url, text, wifiSsid, wifiPass, wifiEncryption, emailTo, emailSubject, emailBody, phoneNum, smsBody, darkColor, lightColor, qrSize]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện Ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật 100% - Dữ liệu không gửi lên máy chủ
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>📱</span> Trình Tạo Mã QR Code
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tạo nhanh mã QR để kết nối WiFi, truy cập đường link, gửi email, gọi điện hoặc quét thông tin.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left inputs panel (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            
            {/* Choose QR profile */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                1. Loại Nội Dung Mã QR
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["url", "text", "wifi", "email", "phone", "sms"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all capitalize ${
                      type === t
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {t === "url" ? "🔗 Link Web" : t === "text" ? "📝 Chữ" : t === "wifi" ? "📶 WiFi" : t === "email" ? "✉️ Email" : t === "phone" ? "📞 Gọi" : "💬 SMS"}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Inputs */}
            <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-750">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                2. Nhập thông tin chi tiết
              </h3>

              {type === "url" && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Đường dẫn trang web (URL)</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
              )}

              {type === "text" && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nội dung văn bản</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Nhập bất kỳ ghi chú hoặc nội dung chữ..."
                    className="w-full h-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:text-white resize-none"
                  />
                </div>
              )}

              {type === "wifi" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tên mạng WiFi (SSID)</label>
                    <input
                      type="text"
                      value={wifiSsid}
                      onChange={(e) => setWifiSsid(e.target.value)}
                      placeholder="Ví dụ: WiFi Nhà Mình"
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mật khẩu WiFi</label>
                      <input
                        type="password"
                        value={wifiPass}
                        onChange={(e) => setWifiPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mã hóa</label>
                      <select
                        value={wifiEncryption}
                        onChange={(e) => setWifiEncryption(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Không mật khẩu (Open)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {type === "email" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Gửi tới địa chỉ email</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="admin@example.com"
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tiêu đề (Subject)</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Tiêu đề mẫu gửi mail..."
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nội dung thư (Body)</label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Nội dung viết sẵn..."
                      className="w-full h-18 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:text-white resize-none"
                    />
                  </div>
                </div>
              )}

              {type === "phone" && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={phoneNum}
                    onChange={(e) => setPhoneNum(e.target.value)}
                    placeholder="Ví dụ: 0987654321"
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                  />
                </div>
              )}

              {type === "sms" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Số điện thoại người nhận</label>
                    <input
                      type="tel"
                      value={phoneNum}
                      onChange={(e) => setPhoneNum(e.target.value)}
                      placeholder="Ví dụ: 0987654321"
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nội dung tin nhắn SMS</label>
                    <textarea
                      value={smsBody}
                      onChange={(e) => setSmsBody(e.target.value)}
                      placeholder="Nội dung tin nhắn soạn sẵn..."
                      className="w-full h-18 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 dark:text-white resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Custom styling colors */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-750 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Màu QR (Chính)</label>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={darkColor}
                    onChange={(e) => setDarkColor(e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{darkColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Màu Nền</label>
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="color"
                    value={lightColor}
                    onChange={(e) => setLightColor(e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{lightColor}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Preview Panel (col: 5) */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 w-full flex flex-col items-center">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-4 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Mã QR xem trước
              </h3>

              {errorMsg && <p className="text-xs text-rose-500 text-center mb-4">{errorMsg}</p>}

              {/* QR Image Container */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-700 max-w-[260px] aspect-square flex items-center justify-center mb-6 shadow-inner">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain rounded-md" />
                ) : (
                  <span className="text-xs text-gray-500">Đang tạo mã QR...</span>
                )}
              </div>

              {/* Actions */}
              <button
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>💾</span> Tải Ảnh QR (PNG)
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-500/20 rounded-2xl p-5 text-xs text-indigo-800 dark:text-indigo-400 leading-relaxed shadow-sm w-full">
              <h4 className="font-bold mb-1.5 flex items-center gap-1">
                <span>💡</span> Bạn có biết?
              </h4>
              Điện thoại thông minh ngày nay có thể tự động quét mã QR trực tiếp bằng ứng dụng Máy ảnh mặc định mà không cần cài đặt thêm bất kỳ ứng dụng nào khác!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
