"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Base64Mode = "encode" | "decode";
type DataType = "text" | "file";

export default function Base64Page() {
  const [mode, setMode] = useState<Base64Mode>("encode");
  const [dataType, setDataType] = useState<DataType>("text");
  
  // Text inputs & outputs
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // File variables
  const [fileBase64, setFileBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Safe UTF-8 Base64 Encoding
  const utf8Encode = (str: string) => {
    try {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        )
      );
    } catch (e) {
      return btoa(str);
    }
  };

  // Safe UTF-8 Base64 Decoding
  const utf8Decode = (str: string) => {
    try {
      return decodeURIComponent(
        atob(str)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    } catch (e) {
      return atob(str);
    }
  };

  const processText = () => {
    setErrorMsg("");
    setOutputText("");

    if (inputText.trim() === "") return;

    try {
      if (mode === "encode") {
        setOutputText(utf8Encode(inputText));
      } else {
        // Strip out any standard data URI scheme prefix if present
        const sanitized = inputText.replace(/^data:image\/[a-z]+;base64,/, "").trim();
        setOutputText(utf8Decode(sanitized));
      }
    } catch (err) {
      setErrorMsg("Dữ liệu Base64 không hợp lệ hoặc không đúng định dạng.");
    }
  };

  useEffect(() => {
    if (dataType === "text") {
      processText();
    }
  }, [mode, inputText, dataType]);

  // Handle local file load
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize((file.size / 1024).toFixed(1) + " KB");
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileBase64(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = () => {
    const copyTarget = dataType === "text" ? outputText : fileBase64;
    if (!copyTarget) return;

    navigator.clipboard.writeText(copyTarget).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Check if string is a valid base64 image data URI
  const isImageBase64 = (str: string) => {
    return /^data:image\/[a-z]+;base64,/.test(str) || (mode === "encode" && dataType === "file" && fileBase64.startsWith("data:image/"));
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
            🔒 Bảo mật 100% - Tập tin không tải lên máy chủ
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🔐</span> Bộ Mã Hóa & Giải Mã Base64
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Mã hóa chuỗi văn bản/hình ảnh sang dạng Base64 và ngược lại hoàn toàn tức thì và an toàn tuyệt đối.
        </p>

        {/* Option toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Mode toggle */}
          <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-750 flex">
            <button
              onClick={() => setMode("encode")}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                mode === "encode" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              Mã Hóa (Encode)
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                mode === "decode" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              Giải Mã (Decode)
            </button>
          </div>

          {/* Data type toggle */}
          <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl border border-gray-100 dark:border-gray-750 flex">
            <button
              onClick={() => setDataType("text")}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                dataType === "text" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              Văn Bản (Text)
            </button>
            <button
              onClick={() => setDataType("file")}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                dataType === "file" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
              }`}
            >
              Hình Ảnh/File
            </button>
          </div>
        </div>

        {/* Text Mode Grid */}
        {dataType === "text" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Box */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                {mode === "encode" ? "Văn Bản Gốc (Chưa mã hóa)" : "Mã Base64 Đầu Vào"}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === "encode" ? "Nhập chữ cần mã hóa..." : "Nhập chuỗi Base64 cần dịch..."}
                className="w-full h-72 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500 dark:text-white font-mono leading-relaxed"
              />
            </div>

            {/* Output Box */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 flex flex-col justify-between h-full">
              <div className="space-y-3 w-full">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-gray-400 uppercase">
                    {mode === "encode" ? "Mã Base64 Kết Quả" : "Văn Bản Gốc Giải Mã"}
                  </label>
                  {outputText && (
                    <button
                      onClick={handleCopy}
                      className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                      {copySuccess ? "✅ Đã Copy" : "📋 Sao Chép"}
                    </button>
                  )}
                </div>

                {errorMsg ? (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400 rounded-xl text-xs">
                    ⚠️ {errorMsg}
                  </div>
                ) : (
                  <div className="w-full h-72 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm font-mono overflow-y-auto break-all select-all text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {outputText || <span className="text-gray-400 italic">Đang chờ dữ liệu...</span>}
                  </div>
                )}
              </div>

              {/* Decoded image preview (if any) */}
              {mode === "decode" && outputText && isImageBase64(inputText) && (
                <div className="mt-4 p-3 border border-gray-100 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 flex flex-col items-center">
                  <p className="text-[10px] text-gray-400 mb-2 uppercase font-bold">Hình ảnh giải mã</p>
                  <img src={inputText} alt="Decoded Preview" className="max-h-32 object-contain rounded border shadow-sm" />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* File Mode Block */
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            
            {/* File upload zone */}
            <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 bg-gray-50 dark:bg-gray-950/50 hover:bg-gray-100 dark:hover:bg-gray-950/80 transition-all group relative cursor-pointer">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="text-4xl mb-3">📁</span>
              <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                {fileName ? `Đang chọn: ${fileName}` : "Kéo thả file ảnh hoặc click để tải lên"}
              </p>
              <p className="text-xs text-gray-400 mt-1">Dung lượng file đề xuất &lt; 5MB</p>
            </div>

            {/* File info and data */}
            {fileBase64 && (
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">Chuỗi mã Base64 của file</h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{fileName} ({fileSize})</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    {copySuccess ? "✅ Đã Sao Chép" : "📋 Sao Chép Chuỗi Base64"}
                  </button>
                </div>

                <div className="w-full h-44 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-xs font-mono overflow-y-auto break-all select-all text-gray-500 dark:text-gray-400">
                  {fileBase64}
                </div>

                {isImageBase64(fileBase64) && (
                  <div className="p-4 border border-gray-150 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-950/40 flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Ảnh Xem Trước</p>
                    <img src={fileBase64} alt="Upload Preview" className="max-h-48 object-contain rounded-lg border shadow-md" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
