"use client";

import { useState, useEffect, useRef } from "react";

interface TextLayer {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize: number; // relative size factor
  color: string;
  strokeColor: string;
  strokeWidth: number;
  fontFamily: string;
  isUppercase: boolean;
  align: "left" | "center" | "right";
  width: number; // width boundary percentage (0-100)
  isBold: boolean;
}

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

const FALLBACK_MEMES: MemeTemplate[] = [
  {
    id: "181913649",
    name: "Drake Hotline Bling",
    url: "https://i.imgflip.com/30b1gx.jpg",
    width: 1200,
    height: 1200,
    box_count: 2
  },
  {
    id: "87743020",
    name: "Two Buttons",
    url: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908,
    box_count: 3
  },
  {
    id: "112126428",
    name: "Distracted Boyfriend",
    url: "https://i.imgflip.com/1ur9kl.jpg",
    width: 1200,
    height: 800,
    box_count: 3
  },
  {
    id: "12485508",
    name: "One Does Not Simply",
    url: "https://i.imgflip.com/1bij.jpg",
    width: 568,
    height: 335,
    box_count: 2
  },
  {
    id: "101470",
    name: "Ancient Aliens",
    url: "https://i.imgflip.com/26am.jpg",
    width: 500,
    height: 437,
    box_count: 2
  }
];

const FONTS = [
  "Impact",
  "Arial",
  "Montserrat",
  "Comic Sans MS",
  "Courier New",
  "Georgia",
  "Trebuchet MS"
];

const EMOJIS = ["😎", "😂", "😭", "😱", "🤔", "🤡", "👑", "🔥", "💯", "👏", "👍", "😈", "💩", "🦄", "🌈"];

export default function MemeGeneratorPage() {
  const [templates, setTemplates] = useState<MemeTemplate[]>(FALLBACK_MEMES);
  const [selectedMeme, setSelectedMeme] = useState<MemeTemplate>(FALLBACK_MEMES[0]);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [textLayers, setTextLayers] = useState<TextLayer[]>([
    {
      id: "text-1",
      text: "TOP TEXT",
      x: 50,
      y: 10,
      fontSize: 45,
      color: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 6,
      fontFamily: "Impact",
      isUppercase: true,
      align: "center",
      width: 80,
      isBold: true
    },
    {
      id: "text-2",
      text: "BOTTOM TEXT",
      x: 50,
      y: 85,
      fontSize: 45,
      color: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 6,
      fontFamily: "Impact",
      isUppercase: true,
      align: "center",
      width: 80,
      isBold: true
    }
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>("text-1");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const isDraggingRef = useRef(false);
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });

  // Update title
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

  // Set default boxes count when switching template
  useEffect(() => {
    setCustomImage(null);
    const boxCount = selectedMeme.box_count || 2;
    const defaultLayers: TextLayer[] = [];
    
    for (let i = 0; i < boxCount; i++) {
      let defaultY = 10;
      let text = "TEXT BOX";
      if (boxCount === 2) {
        defaultY = i === 0 ? 10 : 85;
        text = i === 0 ? "TOP TEXT" : "BOTTOM TEXT";
      } else if (boxCount > 2) {
        defaultY = Math.round(10 + (i * 75) / (boxCount - 1));
        text = `TEXT BOX ${i + 1}`;
      }
      
      defaultLayers.push({
        id: `text-${i + 1}`,
        text: text,
        x: 50,
        y: defaultY,
        fontSize: Math.round(selectedMeme.width > 800 ? 55 : 40),
        color: "#ffffff",
        strokeColor: "#000000",
        strokeWidth: 6,
        fontFamily: "Impact",
        isUppercase: true,
        align: "center",
        width: 80,
        isBold: true
      });
    }
    setTextLayers(defaultLayers);
    if (defaultLayers.length > 0) {
      setActiveLayerId(defaultLayers[0].id);
    }
  }, [selectedMeme]);

  // Load and draw image & layers
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgUrl = customImage || selectedMeme.url;
    if (!imgUrl) return;

    const render = (img: HTMLImageElement) => {
      // Set canvas dimension
      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 600;

      // Draw background
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw text layers
      textLayers.forEach((layer) => {
        const textToDraw = layer.isUppercase ? layer.text.toUpperCase() : layer.text;
        if (!textToDraw) return;

        // Calculate absolute position
        const absX = (layer.x / 100) * canvas.width;
        const absY = (layer.y / 100) * canvas.height;
        const absMaxWidth = (layer.width / 100) * canvas.width;

        // Configure font styles
        ctx.font = `${layer.isBold ? "bold" : "normal"} ${layer.fontSize}px ${layer.fontFamily}`;
        ctx.fillStyle = layer.color;
        ctx.strokeStyle = layer.strokeColor;
        ctx.lineWidth = layer.strokeWidth;
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.textAlign = layer.align;
        ctx.textBaseline = "middle";

        // Text wrapping
        const words = textToDraw.split(" ");
        let line = "";
        const lines: string[] = [];
        const lineHeight = layer.fontSize * 1.15;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > absMaxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + " ";
          } else {
            line = testLine;
          }
        }
        lines.push(line.trim());

        // Calculate vertical alignment shift
        const totalHeight = lines.length * lineHeight;
        const startY = absY - totalHeight / 2 + lineHeight / 2;

        lines.forEach((lineText, idx) => {
          const lineY = startY + idx * lineHeight;
          ctx.strokeText(lineText, absX, lineY);
          ctx.fillText(lineText, absX, lineY);
        });

        // Draw dotted helper outline for active layer if not exporting
        if (!isExporting && activeLayerId === layer.id) {
          ctx.save();
          ctx.strokeStyle = "#a855f7"; // purple-500
          ctx.lineWidth = Math.max(2, Math.round(canvas.width / 300));
          ctx.setLineDash([6, 4]);
          
          // Draw simple visual crosshair / boundary box
          const boxPadding = 12;
          const boxH = totalHeight + boxPadding;
          const boxW = absMaxWidth + boxPadding * 2;
          
          let boxX = absX - boxW / 2;
          if (layer.align === "left") boxX = absX - boxPadding;
          else if (layer.align === "right") boxX = absX - boxW + boxPadding;

          ctx.strokeRect(boxX, absY - boxH / 2, boxW, boxH);
          ctx.restore();
        }
      });
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
  };

  // Re-draw whenever variables change
  useEffect(() => {
    drawCanvas();
  }, [selectedMeme, textLayers, activeLayerId, customImage, isExporting]);

  // Handle canvas drag events
  const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // Scale client coords to internal canvas resolution
    const x = (clientX / rect.width) * 100;
    const y = (clientY / rect.height) * 100;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getCanvasMousePos(e);
    if (!pos) return;

    // Find the closest text layer clicked
    let closestLayer: TextLayer | null = null;
    let minDistance = 15; // click sensitivity radius in percentage

    textLayers.forEach((layer) => {
      const dist = Math.sqrt(Math.pow(layer.x - pos.x, 2) + Math.pow(layer.y - pos.y, 2));
      if (dist < minDistance) {
        minDistance = dist;
        closestLayer = layer;
      }
    });

    if (closestLayer) {
      isDraggingRef.current = true;
      setActiveLayerId((closestLayer as TextLayer).id);
      dragStartOffsetRef.current = {
        x: pos.x - (closestLayer as TextLayer).x,
        y: pos.y - (closestLayer as TextLayer).y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current || !activeLayerId) return;

    const pos = getCanvasMousePos(e);
    if (!pos) return;

    const newX = Math.max(0, Math.min(100, Math.round(pos.x - dragStartOffsetRef.current.x)));
    const newY = Math.max(0, Math.min(100, Math.round(pos.y - dragStartOffsetRef.current.y)));

    setTextLayers((prev) =>
      prev.map((layer) =>
        layer.id === activeLayerId ? { ...layer, x: newX, y: newY } : layer
      )
    );
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // UI Layer management
  const addTextLayer = () => {
    const id = `text-${Date.now()}`;
    const newLayer: TextLayer = {
      id,
      text: "TEXT BOX",
      x: 50,
      y: 50,
      fontSize: 40,
      color: "#ffffff",
      strokeColor: "#000000",
      strokeWidth: 5,
      fontFamily: "Arial",
      isUppercase: false,
      align: "center",
      width: 70,
      isBold: false
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(id);
  };

  const addEmojiLayer = (emoji: string) => {
    const id = `emoji-${Date.now()}`;
    const newLayer: TextLayer = {
      id,
      text: emoji,
      x: 50,
      y: 50,
      fontSize: 60,
      color: "#ffffff",
      strokeColor: "transparent",
      strokeWidth: 0,
      fontFamily: "Arial",
      isUppercase: false,
      align: "center",
      width: 30,
      isBold: false
    };
    setTextLayers((prev) => [...prev, newLayer]);
    setActiveLayerId(id);
  };

  const deleteLayer = (id: string) => {
    setTextLayers((prev) => prev.filter((layer) => layer.id !== id));
    if (activeLayerId === id) {
      const remaining = textLayers.filter((l) => l.id !== id);
      if (remaining.length > 0) {
        setActiveLayerId(remaining[0].id);
      }
    }
  };

  const updateActiveLayer = (updates: Partial<TextLayer>) => {
    setTextLayers((prev) =>
      prev.map((l) => (l.id === activeLayerId ? { ...l, ...updates } : l))
    );
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImage(event.target.result as string);
          // Set standard template placeholder properties
          setSelectedMeme({
            id: "custom",
            name: file.name.substring(0, 20),
            url: event.target.result as string,
            width: 800,
            height: 800,
            box_count: 2
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate and export functions
  const prepareExport = (): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      // Temporarily disable helper borders
      setIsExporting(true);
      
      // Let React states settle, redraw
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          resolve(canvas);
        } else {
          reject(new Error("Canvas not ready"));
        }
      }, 80);
    });
  };

  const handleDownload = async () => {
    setExportError("");
    setSuccessMsg("");
    try {
      const canvas = await prepareExport();
      const dataUrl = canvas.toDataURL("image/png");
      
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `zavclip_meme_${Date.now()}.png`;
      link.click();
      
      setSuccessMsg("Đã tải meme thành công! 🎉");
    } catch (err: any) {
      setExportError("Lỗi xuất ảnh: Có thể hình nền bị chặn bảo mật (CORS). Vui lòng thử mẫu khác hoặc upload ảnh của bạn.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    setExportError("");
    setSuccessMsg("");
    try {
      const canvas = await prepareExport();
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setExportError("Không thể tạo dữ liệu ảnh.");
          setIsExporting(false);
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
          ]);
          setSuccessMsg("Đã sao chép meme vào Clipboard! Dán (Ctrl+V) để chia sẻ ngay 🚀");
        } catch (err) {
          setExportError("Trình duyệt không hỗ trợ sao chép hình ảnh trực tiếp. Vui lòng bấm 'Tải Meme'!");
        } finally {
          setIsExporting(false);
        }
      }, "image/png");
    } catch (err) {
      setExportError("Lỗi bảo mật (CORS) của ảnh gốc. Hãy bấm nút 'Tải Meme' hoặc thử lại.");
      setIsExporting(false);
    }
  };

  // Computed variables
  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const activeLayer = textLayers.find((l) => l.id === activeLayerId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Meme Generator
        </h1>
        <p className="text-center text-slate-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
          Tạo meme cực nhanh, kéo thả văn bản trực tiếp trên ảnh, hỗ trợ nhãn dán emoji và xuất ảnh sắc nét.
        </p>

        {/* Global Notification */}
        {successMsg && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 rounded-xl text-center shadow-lg backdrop-blur-md animate-bounce">
            {successMsg}
          </div>
        )}
        {exportError && (
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-rose-950/80 border border-rose-500/30 text-rose-300 rounded-xl text-center shadow-lg backdrop-blur-md">
            {exportError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Editor Panel (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Template Select Section */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>🖼️</span> 1. Chọn Mẫu Meme
              </h2>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm mẫu meme..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                
                {/* Custom upload button */}
                <label className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-4 py-2 rounded-xl flex items-center justify-center cursor-pointer transition-colors border border-slate-700 select-none">
                  📤 Tự Tải Ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Grid Horizontal scroll of template cards */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent max-h-[110px]">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedMeme(t)}
                    className={`flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedMeme.id === t.id && !customImage
                        ? "border-purple-500 scale-95 shadow-md shadow-purple-500/30"
                        : "border-slate-800 hover:border-slate-600"
                    }`}
                    title={t.name}
                  >
                    <img
                      src={t.url}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
                {filteredTemplates.length === 0 && (
                  <p className="text-xs text-slate-500 py-4 w-full text-center">Không tìm thấy mẫu tương ứng</p>
                )}
              </div>
            </div>

            {/* 2. Text Content & Layers section */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                  <span>✍️</span> 2. Nội Dung & Font Chữ
                </h2>
                
                <button
                  onClick={addTextLayer}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1"
                >
                  ➕ Thêm Chữ
                </button>
              </div>

              {/* Layer Selection Chips */}
              <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
                {textLayers.map((layer, index) => (
                  <div
                    key={layer.id}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all select-none ${
                      activeLayerId === layer.id
                        ? "bg-purple-950/80 border-purple-500/80 text-purple-200"
                        : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                    onClick={() => setActiveLayerId(layer.id)}
                  >
                    <span className="truncate max-w-[90px]">
                      {layer.text.startsWith("http") || layer.text.length === 2 && EMOJIS.includes(layer.text)
                        ? `Sticker ${layer.text}` 
                        : layer.text || `Hộp ${index + 1}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLayer(layer.id);
                      }}
                      className="text-slate-500 hover:text-red-400 font-bold ml-1 text-sm focus:outline-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Active layer edits */}
              {activeLayer ? (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Văn Bản
                    </label>
                    <textarea
                      value={activeLayer.text}
                      onChange={(e) => updateActiveLayer({ text: e.target.value })}
                      placeholder="Nhập nội dung chữ..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none h-18"
                    />
                  </div>

                  {/* Inline styling rows */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Font Chữ
                      </label>
                      <select
                        value={activeLayer.fontFamily}
                        onChange={(e) => updateActiveLayer({ fontFamily: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                      >
                        {FONTS.map((font) => (
                          <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">
                        Căn Lề
                      </label>
                      <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                        {(["left", "center", "right"] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => updateActiveLayer({ align })}
                            className={`flex-1 text-xs py-1.5 capitalize rounded-lg transition-colors ${
                              activeLayer.align === align
                                ? "bg-purple-600 text-white font-bold"
                                : "text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {align === "left" ? "👈" : align === "center" ? "↕" : "👉"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Typography customizations */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateActiveLayer({ isUppercase: !activeLayer.isUppercase })}
                      className={`py-2 px-3 border rounded-xl text-xs font-semibold transition-colors ${
                        activeLayer.isUppercase
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      A ➔ AB
                    </button>
                    
                    <button
                      onClick={() => updateActiveLayer({ isBold: !activeLayer.isBold })}
                      className={`py-2 px-3 border rounded-xl text-xs font-bold transition-colors ${
                        activeLayer.isBold
                          ? "bg-purple-600/20 border-purple-500 text-purple-200"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      IN ĐẬM
                    </button>

                    <div className="flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl py-1 text-xs text-slate-400">
                      Màu 🎨
                    </div>
                  </div>

                  {/* Color Pickers */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-950 p-3 rounded-xl border border-slate-850">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeLayer.color}
                        onChange={(e) => updateActiveLayer({ color: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <div>
                        <p className="text-[10px] text-slate-500 leading-none">Chữ chính</p>
                        <p className="text-xs text-slate-300 font-mono mt-0.5">{activeLayer.color}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={activeLayer.strokeColor}
                        onChange={(e) => updateActiveLayer({ strokeColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <div>
                        <p className="text-[10px] text-slate-500 leading-none">Viền ngoài</p>
                        <p className="text-xs text-slate-300 font-mono mt-0.5">{activeLayer.strokeColor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Slider controls (Sizes & positions) */}
                  <div className="space-y-3 bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Cỡ chữ</span>
                        <span className="font-mono text-purple-400">{activeLayer.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="180"
                        value={activeLayer.fontSize}
                        onChange={(e) => updateActiveLayer({ fontSize: parseInt(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Độ dày viền</span>
                        <span className="font-mono text-purple-400">{activeLayer.strokeWidth}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={activeLayer.strokeWidth}
                        onChange={(e) => updateActiveLayer({ strokeWidth: parseInt(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Độ rộng viền chữ tối đa</span>
                        <span className="font-mono text-purple-400">{activeLayer.width}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={activeLayer.width}
                        onChange={(e) => updateActiveLayer({ width: parseInt(e.target.value) })}
                        className="w-full accent-purple-500"
                      />
                    </div>

                    {/* Coordinate fine tuning sliders for mobile */}
                    <div className="pt-2 border-t border-slate-800 space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Vị trí Ngang (X)</span>
                          <span className="font-mono text-slate-400">{activeLayer.x}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={activeLayer.x}
                          onChange={(e) => updateActiveLayer({ x: parseInt(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Vị trí Dọc (Y)</span>
                          <span className="font-mono text-slate-400">{activeLayer.y}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={activeLayer.y}
                          onChange={(e) => updateActiveLayer({ y: parseInt(e.target.value) })}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center py-6">
                  Vui lòng thêm hộp chữ hoặc nhãn dán để tùy chỉnh.
                </p>
              )}
            </div>

            {/* 3. Sticker Selection Panel */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-5 space-y-3">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>⚡</span> 3. Thêm Nhãn Dán Emoji
              </h2>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmojiLayer(emoji)}
                    className="aspect-square bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-600 rounded-xl text-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 select-none"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Preview & Canvas Panel (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-xl font-extrabold text-slate-200 flex items-center gap-2">
                <span>👁️</span> Bản Xem Trước Meme
              </h2>
              <span className="text-xs bg-purple-900/50 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                {customImage ? "Ảnh Tự Tải" : selectedMeme.name}
              </span>
            </div>

            {/* Canvas wrapper container */}
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center bg-slate-950/80 border border-slate-850 rounded-2xl overflow-hidden p-2 group">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="max-w-full max-h-[460px] object-contain rounded-lg cursor-move select-none shadow-2xl transition-transform"
                style={{ touchAction: "none" }}
              />
              
              {/* Overlay guidelines hint on hover */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-sm border border-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-xl text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                💡 Nhấn giữ & Kéo trực tiếp chữ trên hình ảnh để di chuyển vị trí!
              </div>
            </div>

            {/* Quick action buttons under canvas */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleDownload}
                disabled={isExporting}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>💾</span> {isExporting ? "Đang xử lý..." : "Tải Meme Về Máy"}
              </button>

              <button
                onClick={handleCopyToClipboard}
                disabled={isExporting}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-base flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>📋</span> Sao Chép Để Share
              </button>
            </div>

            {/* Notice Footer info */}
            <div className="w-full text-center text-xs text-slate-500 border-t border-slate-800/60 pt-4">
              <p>Meme được render ở kích thước thật sắc nét. Hỗ trợ chạy mượt mà trên cả điện thoại và máy tính.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
