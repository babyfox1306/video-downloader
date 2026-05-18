"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

type CropRatio = "free" | "1:1" | "16:9" | "4:3" | "3:4";

export default function ImageCropPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [ratio, setRatio] = useState<CropRatio>("free");

  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<Cropper | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setCroppedUrl(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Initialize and destroy cropper instance
  const initCropper = () => {
    if (!imageRef.current) return;

    if (cropperRef.current) {
      cropperRef.current.destroy();
    }

    let aspect = NaN; // free
    if (ratio === "1:1") aspect = 1;
    else if (ratio === "16:9") aspect = 16 / 9;
    else if (ratio === "4:3") aspect = 4 / 3;
    else if (ratio === "3:4") aspect = 3 / 4;

    cropperRef.current = new Cropper(imageRef.current, {
      aspectRatio: aspect,
      viewMode: 1,
      autoCropArea: 0.8,
      responsive: true,
      background: false,
      ready() {
        setIsProcessing(false);
      }
    });
  };

  useEffect(() => {
    if (imageSrc) {
      setIsProcessing(true);
      // Wait for image DOM rendering
      const timer = setTimeout(() => {
        initCropper();
      }, 100);
      return () => {
        clearTimeout(timer);
        if (cropperRef.current) {
          cropperRef.current.destroy();
          cropperRef.current = null;
        }
      };
    }
  }, [imageSrc, ratio]);

  const handleStartCrop = () => {
    if (!cropperRef.current) return;
    setIsProcessing(true);

    const canvas = cropperRef.current.getCroppedCanvas({
      imageSmoothingEnabled: true,
      imageSmoothingQuality: "high"
    });

    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, "image/png");
    } else {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!croppedUrl) return;
    const cleanName = fileName.substring(0, fileName.lastIndexOf(".")) || fileName;
    
    const link = document.createElement("a");
    link.href = croppedUrl;
    link.download = `cropped-${cleanName}.png`;
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
            🔒 File không gửi lên server - Cắt ảnh an toàn tuyệt đối
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>✂️</span> Cắt Xén Hình Ảnh (Crop)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Cắt bỏ các chi tiết thừa trong ảnh tự do hoặc cắt theo tỷ lệ chuẩn vuông 1:1, ngang 16:9 để chia sẻ.
        </p>

        {!imageSrc ? (
          /* File Upload Zone */
          <div className="flex flex-col items-center justify-center border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-3xl p-16 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-950/20 transition-all group relative cursor-pointer shadow-md max-w-2xl mx-auto">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-5xl mb-4">✂️</span>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-base">
              Kéo thả hình ảnh của bạn vào đây hoặc click để chọn ảnh cần cắt
            </p>
            <p className="text-xs text-gray-400 mt-2">Hỗ trợ JPG, PNG, WEBP, BMP...</p>
          </div>
        ) : (
          /* Workspace Editor Split */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls & Ratio presets (col: 4) */}
            <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-5 space-y-5">
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2">
                Tỷ lệ cắt ảnh
              </h3>

              {/* Ratios grid */}
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "free", name: "Tự Do 🔓" },
                  { id: "1:1", name: "1:1 Vuông ⬜" },
                  { id: "16:9", name: "16:9 Ngang 🖥️" },
                  { id: "4:3", name: "4:3 Standard 📺" },
                  { id: "3:4", name: "3:4 Đứng 📱" }
                ] as const).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRatio(item.id)}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                      ratio === item.id
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Start Crop Action */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-750 space-y-3">
                <button
                  onClick={handleStartCrop}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  ✂️ Áp Dụng Cắt Ảnh
                </button>

                {croppedUrl && (
                  <button
                    onClick={handleDownload}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    📥 Tải Ảnh Đã Cắt Về Máy
                  </button>
                )}

                <button
                  onClick={() => {
                    setImageSrc(null);
                    setCroppedUrl(null);
                  }}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  🔄 Chọn ảnh khác
                </button>
              </div>
            </div>

            {/* Right Crop view (col: 8) */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 flex flex-col items-center space-y-6">
              
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center flex justify-between items-center">
                <span>Vùng cắt ảnh</span>
                {ratio !== "free" && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-950/50 text-blue-600 px-2 py-0.5 rounded">
                    Khóa tỷ lệ {ratio}
                  </span>
                )}
              </h3>

              {/* Cropper Container */}
              <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 w-full aspect-video flex items-center justify-center shadow-inner overflow-hidden relative min-h-[300px]">
                {!croppedUrl ? (
                  <div className="max-w-full max-h-[380px] overflow-hidden">
                    <img
                      ref={imageRef}
                      src={imageSrc}
                      alt="Source for cropping"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <p className="text-xs font-bold text-emerald-500">✓ Đã cắt ảnh thành công!</p>
                    <img src={croppedUrl} alt="Cropped result" className="max-w-full max-h-[300px] object-contain rounded border shadow-md" />
                    <button
                      onClick={() => setCroppedUrl(null)}
                      className="text-xs text-blue-500 font-bold hover:underline"
                    >
                      ✏️ Cắt lại hình này
                    </button>
                  </div>
                )}

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                    Đang xử lý cắt ảnh...
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
