"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

type Language = "latin" | "vietnamese";
type OutputType = "paragraphs" | "sentences" | "words";

const LATIN_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const VIETNAMESE_WORDS = [
  "quê", "hương", "đất", "nước", "thanh", "bình", "yêu", "thương", "đồng", "ruộng",
  "mênh", "mông", "cánh", "cò", "bay", "lả", "dòng", "sông", "xanh", "mát",
  "con", "đường", "làng", "tre", "ngào", "ngạt", "hương", "thơm", "hoa", "sen",
  "buổi", "sớm", "bình", "minh", "ánh", "nắng", "vàng", "rực", "rỡ", "ấm",
  "áp", "con", "người", "hiền", "hòa", "chất", "phác", "mến", "khách", "nụ",
  "cười", "rạng", "rỡ", "hạnh", "phúc", "ấm", "êm", "mái", "nhà", "tranh",
  "khói", "bếp", "chiều", "thơm", "nồng", "hạt", "gạo", "dẻo", "thơm", "trái",
  "ngọt", "trên", "cành", "gió", "thổi", "vi", "vu", "mây", "trôi", "lững", "lờ"
];

export default function LoremIpsumPage() {
  const [lang, setLang] = useState<Language>("latin");
  const [type, setType] = useState<OutputType>("paragraphs");
  const [count, setCount] = useState(5);
  const [generatedText, setGeneratedText] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate a random sentence
  const generateSentence = (wordList: string[]) => {
    const minLength = 6;
    const maxLength = 16;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const words: string[] = [];

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * wordList.length);
      words.push(wordList[randomIndex]);
    }

    let sentence = words.join(" ");
    sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    return sentence;
  };

  // Generate a paragraph of sentences
  const generateParagraph = (wordList: string[]) => {
    const minSentences = 3;
    const maxSentences = 7;
    const sentencesCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    const sentences: string[] = [];

    for (let i = 0; i < sentencesCount; i++) {
      sentences.push(generateSentence(wordList));
    }

    return sentences.join(" ");
  };

  const generateText = () => {
    const words = lang === "latin" ? LATIN_WORDS : VIETNAMESE_WORDS;
    let result = "";

    if (type === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph(words));
      }
      result = paragraphs.join("\n\n");
    } else if (type === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence(words));
      }
      result = sentences.join(" ");
    } else {
      // words
      const wordsCount: string[] = [];
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        wordsCount.push(words[randomIndex]);
      }
      result = wordsCount.join(" ");
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    setGeneratedText(result);
  };

  useEffect(() => {
    generateText();
  }, [lang, type, count]);

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
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
            🔒 Bảo mật 100% - Dữ liệu sinh ra cục bộ hoàn toàn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🖨️</span> Bộ Tạo Văn Bản Giả (Lorem Ipsum)
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tạo nhanh các đoạn văn hoặc câu từ vô nghĩa để điền vào bản thiết kế, layout website hoặc dàn trang in ấn.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel options (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            
            {/* Choose Language */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ngôn Ngữ</label>
              <div className="flex bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-700 p-1 rounded-xl">
                <button
                  onClick={() => setLang("latin")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    lang === "latin" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  Latin (Lorem classic)
                </button>
                <button
                  onClick={() => setLang("vietnamese")}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    lang === "vietnamese" ? "bg-emerald-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 dark:hover:text-white"
                  }`}
                >
                  Tiếng Việt mẫu
                </button>
              </div>
            </div>

            {/* Choose Type */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Đơn Vị Tạo</label>
              <div className="grid grid-cols-3 gap-2">
                {(["paragraphs", "sentences", "words"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setType(t);
                      if (t === "paragraphs") setCount(5);
                      else if (t === "sentences") setCount(15);
                      else setCount(100);
                    }}
                    className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all capitalize ${
                      type === t
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300"
                    }`}
                  >
                    {t === "paragraphs" ? "📝 Đoạn" : t === "sentences" ? "💬 Câu" : "✏️ Từ"}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
                <span className="uppercase">Số lượng</span>
                <span className="font-mono text-blue-600 dark:text-blue-400 text-sm">{count}</span>
              </div>
              <input
                type="range"
                min="1"
                max={type === "paragraphs" ? 25 : type === "sentences" ? 100 : 500}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="w-full accent-blue-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-750">
              <button
                onClick={handleCopy}
                disabled={!generatedText}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>📋</span> {copySuccess ? "Đã Sao Chép!" : "Sao Chép Toàn Bộ"}
              </button>
            </div>

          </div>

          {/* Right Text Output Display Panel (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 w-full flex flex-col justify-between">
            <div className="space-y-3 w-full">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm border-b border-gray-100 dark:border-gray-750 pb-2 w-full text-center">
                Văn bản tạo ra xem trước
              </h3>

              <div className="w-full h-[360px] bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-sm overflow-y-auto text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap select-all font-sans">
                {generatedText || <span className="text-gray-400 italic">Đang chuẩn bị văn bản...</span>}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
