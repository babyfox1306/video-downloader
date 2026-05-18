"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function NumberToWordsPage() {
  const [inputVal, setInputVal] = useState("");
  const [outputVal, setOutputVal] = useState("");
  const [hasDong, setHasDong] = useState(true);
  const [capitalize, setCapitalize] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOutputVal(docSoVietNam(inputVal, hasDong, capitalize));
  }, [inputVal, hasDong, capitalize]);

  const handleCopy = () => {
    if (!outputVal || outputVal === "Vui lòng nhập số" || outputVal.includes("lớn")) return;
    navigator.clipboard.writeText(outputVal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAdd = (val: string) => {
    setInputVal(val);
  };

  function docSoVietNam(numStr: string, addSuffix: boolean, capFirst: boolean): string {
    let clean = numStr.replace(/[^0-9]/g, "");
    if (!clean) return "Vui lòng nhập số";
    if (clean.length > 15) return "Số quá lớn (chỉ hỗ trợ tối đa 15 chữ số - hàng triệu tỷ)";

    let num = BigInt(clean);
    if (num === BigInt(0)) return capFirst ? "Không" + (addSuffix ? " đồng" : "") : "không" + (addSuffix ? " đồng" : "");

    const digitWords = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

    function readThreeDigits(n: number, isFirstGroup: boolean): string {
      let hundred = Math.floor(n / 100);
      let ten = Math.floor((n % 100) / 10);
      let single = n % 10;
      let res = "";

      if (hundred > 0 || !isFirstGroup) {
        res += digitWords[hundred] + " trăm ";
      }

      if (ten > 1) {
        res += digitWords[ten] + " mươi ";
      } else if (ten === 1) {
        res += "mười ";
      } else if (ten === 0 && single > 0 && (hundred > 0 || !isFirstGroup)) {
        res += "lẻ ";
      }

      if (single > 0) {
        if (single === 1 && ten > 1) {
          res += "mốt";
        } else if (single === 5 && ten > 0) {
          res += "lăm";
        } else if (single === 4 && ten > 1) {
          res += "tư";
        } else {
          res += digitWords[single];
        }
      }

      return res.trim();
    }

    let temp = num;
    let groups: number[] = [];
    while (temp > BigInt(0)) {
      groups.push(Number(temp % BigInt(1000)));
      temp = temp / BigInt(1000);
    }

    let words = "";
    for (let i = groups.length - 1; i >= 0; i--) {
      let g = groups[i];
      if (g === 0) continue;
      let isFirstGroup = (i === groups.length - 1);

      let unitName = "";
      if (i === 0) unitName = "";
      else if (i === 1) unitName = " nghìn";
      else if (i === 2) unitName = " triệu";
      else if (i >= 3) {
        let subIndex = i - 3;
        if (subIndex === 0) unitName = " tỷ";
        else if (subIndex === 1) unitName = " nghìn tỷ";
        else if (subIndex === 2) unitName = " triệu tỷ";
        else unitName = " tỷ".repeat(Math.floor(subIndex / 3) + 1);
      }

      words += " " + readThreeDigits(g, isFirstGroup) + unitName;
    }

    let result = words.trim().replace(/\s+/g, " ");
    if (addSuffix) {
      result += " đồng";
    }

    if (capFirst) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
    }

    return result;
  }

  const formatNumberDisplay = (val: string) => {
    let clean = val.replace(/[^0-9]/g, "");
    if (!clean) return "";
    return new Intl.NumberFormat("vi-VN").format(parseInt(clean, 10));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật 100% - Dữ liệu không rời máy bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🔢 Số sang chữ tiếng Việt
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Hỗ trợ đọc các số siêu lớn lên tới hàng triệu tỷ đồng, tự động thêm đơn vị tiền tệ và chuẩn hóa chữ viết.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-6">
          {/* Input field */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Nhập số cần đọc
            </label>
            <input
              type="text"
              placeholder="Ví dụ: 1234567..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 text-xl font-bold focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white transition-colors"
            />
            {inputVal && (
              <p className="text-xs text-gray-400">
                Định dạng số: <strong className="text-emerald-600 dark:text-emerald-400">{formatNumberDisplay(inputVal)}</strong>
              </p>
            )}
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => handleQuickAdd("500000")}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 rounded-xl text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              500.000 (Năm trăm nghìn)
            </button>
            <button
              onClick={() => handleQuickAdd("1500000")}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 rounded-xl text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              1.500.000 (Một triệu rưỡi)
            </button>
            <button
              onClick={() => handleQuickAdd("12500000")}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 rounded-xl text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              12.500.000 (Mười hai triệu năm trăm)
            </button>
            <button
              onClick={() => handleQuickAdd("1000000000")}
              className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-950 rounded-xl text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 transition-colors"
            >
              1.000.000.000 (Một tỷ)
            </button>
          </div>

          {/* Config options */}
          <div className="flex gap-6 border-t border-gray-100 dark:border-gray-700 pt-5">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={hasDong}
                onChange={(e) => setHasDong(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
              />
              Thêm đuôi \"đồng\" ở cuối
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={capitalize}
                onChange={(e) => setCapitalize(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 accent-emerald-500"
              />
              Viết hoa chữ cái đầu tiên
            </label>
          </div>

          {/* Output block */}
          <div className="bg-gray-50 dark:bg-gray-950 rounded-2xl p-5 border border-gray-200 dark:border-gray-800 space-y-3 relative group">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Kết quả chữ viết
            </h3>
            
            <p className="text-lg md:text-xl font-extrabold text-gray-800 dark:text-gray-100 leading-relaxed pr-8">
              {outputVal}
            </p>

            {inputVal && outputVal !== "Vui lòng nhập số" && !outputVal.includes("lớn") && (
              <button
                onClick={handleCopy}
                className="absolute right-4 bottom-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md cursor-pointer"
              >
                {copied ? "✓ Đã copy" : "📋 Sao chép"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
