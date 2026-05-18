"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

const FALLBACK_MEMES: MemeTemplate[] = [
  {
    id: "181913649",
    name: "Drake Hotline Bling",
    url: "https://i.imgflip.com/30b1gx.jpg",
    width: 1200,
    height: 1200
  },
  {
    id: "87743020",
    name: "Two Buttons",
    url: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908
  },
  {
    id: "112126428",
    name: "Distracted Boyfriend",
    url: "https://i.imgflip.com/1ur9kl.jpg",
    width: 1200,
    height: 800
  },
  {
    id: "12485508",
    name: "One Does Not Simply",
    url: "https://i.imgflip.com/1bij.jpg",
    width: 568,
    height: 335
  },
  {
    id: "101470",
    name: "Ancient Aliens",
    url: "https://i.imgflip.com/26am.jpg",
    width: 500,
    height: 437
  }
];

export default function MemeGeneratorPage() {
  const [templates, setTemplates] = useState<MemeTemplate[]>(FALLBACK_MEMES);
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate>(FALLBACK_MEMES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  
  const [topText, setTopText] = useState("TOP TEXT");
  const [bottomText, setBottomText] = useState("BOTTOM TEXT");
  const [fontSize, setFontSize] = useState(40);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Set document title
  useEffect(() => {
    document.title = "ZavClip - Meme Generator | Tạo meme cực nhanh";
  }, []);

  // Fetch templates from Imgflip
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch("https://api.imgflip.com/get_memes");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.memes?.length > 0) {
            setTemplates(json.data.memes);
            setSelectedMeme(json.data.memes[0]);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch imgflip templates, using fallbacks.", err);
      }
    };
    fetchTemplates();
  }, []);

  // Helper function to wrap text inside canvas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + " " + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  };

  // Pure canvas drawer wrapped in useCallback to avoid unnecessary redraws
  const drawMeme = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgUrl = customImage || selectedMeme?.url;
    if (!imgUrl) return;

    const render = (img: HTMLImageElement) => {
      const canvasWidth = 500;
      const scale = canvasWidth / img.naturalWidth;
      const canvasHeight = img.naturalHeight * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Draw background
      ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

      // Configure text styles
      ctx.font = `bold ${fontSize}px Impact, Arial, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.textAlign = "center";

      // Draw Top Text
      if (topText) {
        const wrappedTop = wrapText(ctx, topText.toUpperCase(), 480);
        wrappedTop.forEach((line, index) => {
          const y = 30 + fontSize * 0.8 + index * (fontSize + 6);
          ctx.strokeText(line, canvasWidth / 2, y);
          ctx.fillText(line, canvasWidth / 2, y);
        });
      }

      // Draw Bottom Text
      if (bottomText) {
        const wrappedBottom = wrapText(ctx, bottomText.toUpperCase(), 480);
        const totalBottomHeight = wrappedBottom.length * (fontSize + 6);
        wrappedBottom.forEach((line, index) => {
          const y = canvasHeight - totalBottomHeight + index * (fontSize + 6) + fontSize * 0.8 - 10;
          ctx.strokeText(line, canvasWidth / 2, y);
          ctx.fillText(line, canvasWidth / 2, y);
        });
      }
    };

    // Load from cache or fetch new image
    const cachedImg = imageCacheRef.current.get(imgUrl);
    if (cachedImg && cachedImg.complete) {
      render(cachedImg);
    } else {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        imageCacheRef.current.set(imgUrl, img);
        render(img);
      };
      img.src = imgUrl;
    }
  }, [selectedMeme, customImage, topText, bottomText, fontSize]);

  // Re-draw whenever parameters change
  useEffect(() => {
    drawMeme();
  }, [drawMeme]);

  // Handle local file upload
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download logic using canvas.toBlob()
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `meme-${Date.now()}.jpg`;
        link.click();
        URL.revokeObjectURL(url);
      },
      "image/jpeg",
      0.9
    );
  };

  // Filter templates list
  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Meme Generator
        </h1>
        <p className="text-center text-slate-400 text-sm md:text-base mb-8 max-w-xl mx-auto">
          Tạo meme cực nhanh từ kho ảnh chế phổ biến hoặc tự tải ảnh của bạn. Hoàn toàn chạy tại trình duyệt của bạn!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL (40%): Template selection + Search + Upload */}
          {/* order-2 on mobile so canvas preview renders first */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>🖼️</span> 1. Chọn Mẫu Meme
              </h2>

              {/* Upload & Search controls */}
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm mẫu meme (Drake, Boyfriend...)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />

                <label className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700 select-none shadow-sm">
                  📤 Upload ảnh của mày
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Templates library grid */}
              <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {filteredTemplates.slice(0, 100).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCustomImage(null);
                      setSelectedMeme(t);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                      selectedMeme.id === t.id && !customImage
                        ? "border-purple-500 scale-95 shadow-md shadow-purple-500/30"
                        : "border-slate-800 hover:border-slate-600"
                    }`}
                    title={t.name}
                  >
                    <img
                      src={t.url}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/75 py-1 px-1.5 text-[10px] text-slate-300 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.name}
                    </div>
                  </button>
                ))}

                {filteredTemplates.length === 0 && (
                  <p className="text-xs text-slate-500 py-8 col-span-3 text-center">
                    Không tìm thấy mẫu nào phù hợp.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL (60%): Canvas preview + Text inputs + Download button */}
          {/* order-1 on mobile to render canvas on top */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center pb-3 border-b border-slate-800">
              <h2 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                <span>👁️</span> 2. Bản Xem Trước & Chỉnh Sửa
              </h2>
              <span className="text-xs bg-purple-900/50 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-full font-semibold">
                {customImage ? "Ảnh Tự Tải" : selectedMeme.name}
              </span>
            </div>

            {/* Canvas preview */}
            <div className="w-full max-w-[500px] flex items-center justify-center bg-slate-950/80 border border-slate-850 rounded-2xl overflow-hidden p-2 shadow-inner">
              <canvas
                ref={canvasRef}
                className="max-w-full rounded-lg shadow-2xl object-contain bg-slate-900"
              />
            </div>

            {/* Inputs & Parameters */}
            <div className="w-full space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Top Text (Chữ Trên)
                </label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="Nhập chữ ở trên..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Bottom Text (Chữ Dưới)
                </label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="Nhập chữ ở dưới..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors text-white placeholder-slate-600"
                />
              </div>

              {/* Font size slider */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                  <span>CỠ CHỮ (FONT SIZE)</span>
                  <span className="font-mono text-purple-400">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full accent-purple-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 cursor-pointer shadow-blue-500/10"
              >
                <span>💾</span> Tải Meme Về Máy
              </button>
            </div>

            <div className="w-full text-center text-xs text-slate-500 border-t border-slate-800/60 pt-4">
              <p>Meme được tải về định dạng ảnh JPEG chất lượng cao, tên file tự động kèm dấu thời gian.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
