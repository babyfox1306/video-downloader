"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  
  const [strength, setStrength] = useState<{ label: string; color: string; percent: number }>({
    label: "Yếu",
    color: "bg-rose-500",
    percent: 25
  });
  const [copySuccess, setCopySuccess] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (useUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) charset += "0123456789";
    if (useSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += charset[array[i] % charset.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    setPassword(result);
  };

  // Re-generate
  useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setStrength({ label: "Chưa tạo", color: "bg-gray-400", percent: 0 });
      return;
    }

    let score = 0;
    if (password.length >= 12) score += 2;
    else if (password.length >= 8) score += 1;

    let typesCount = 0;
    if (/[A-Z]/.test(password)) typesCount++;
    if (/[a-z]/.test(password)) typesCount++;
    if (/[0-9]/.test(password)) typesCount++;
    if (/[^A-Za-z0-9]/.test(password)) typesCount++;

    score += typesCount;

    if (score >= 5) {
      setStrength({ label: "Rất Mạnh 💪🔥", color: "bg-emerald-500", percent: 100 });
    } else if (score >= 4) {
      setStrength({ label: "Mạnh 👍", color: "bg-teal-500", percent: 75 });
    } else if (score >= 3) {
      setStrength({ label: "Trung bình 👌", color: "bg-yellow-500", percent: 50 });
    } else {
      setStrength({ label: "Yếu ⚠️", color: "bg-rose-500", percent: 25 });
    }
  }, [password]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
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
            🔒 Bảo mật 100% - Mật khẩu sinh ra ngay trên máy bạn
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <span>🔑</span> Trình Tạo Mật Khẩu Mạnh
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          Tạo ngẫu nhiên mật khẩu bảo mật cao, cực kỳ khó bẻ khóa để bảo vệ tài khoản mạng xã hội, email, ngân hàng.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel options (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 space-y-6">
            
            {/* Length slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-2">
                <span className="uppercase">Chiều dài mật khẩu</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">{length} Ký tự</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Checkbox settings */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-750 space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                Tiêu chí mật khẩu
              </label>

              {/* Uppercase */}
              <div className="flex items-center justify-between py-1.5">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Chữ in HOA (A-Z)</h4>
                  <p className="text-[10px] text-gray-500">Bao gồm ký tự in hoa</p>
                </div>
                <input
                  type="checkbox"
                  checked={useUpper}
                  onChange={(e) => setUseUpper(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Lowercase */}
              <div className="flex items-center justify-between py-1.5 border-t border-gray-50 dark:border-gray-750/30">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Chữ thường (a-z)</h4>
                  <p className="text-[10px] text-gray-500">Bao gồm ký tự viết thường</p>
                </div>
                <input
                  type="checkbox"
                  checked={useLower}
                  onChange={(e) => setUseLower(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Numbers */}
              <div className="flex items-center justify-between py-1.5 border-t border-gray-50 dark:border-gray-750/30">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Chữ số (0-9)</h4>
                  <p className="text-[10px] text-gray-500">Bao gồm các số tự nhiên</p>
                </div>
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Symbols */}
              <div className="flex items-center justify-between py-1.5 border-t border-gray-50 dark:border-gray-750/30">
                <div>
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Ký tự đặc biệt (!@#...)</h4>
                  <p className="text-[10px] text-gray-500">Bao gồm các biểu tượng bảo mật</p>
                </div>
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Right Display Panel (col: 5) */}
          <div className="lg:col-span-5 flex flex-col items-center space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-750 shadow-md p-6 w-full flex flex-col items-center">
              
              <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-4 border-b border-gray-100 dark:border-gray-750 w-full pb-2 text-center">
                Mật khẩu tạo ra
              </h3>

              {/* Password String Output */}
              <div className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl py-4 px-3 text-center text-lg font-mono font-bold tracking-wide break-all text-emerald-600 dark:text-emerald-400 select-all mb-4 min-h-[56px] flex items-center justify-center">
                {password || <span className="text-gray-400 italic">Chọn ít nhất 1 tiêu chí</span>}
              </div>

              {/* Strength Meter */}
              {password && (
                <div className="w-full mb-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-500">Độ an toàn:</span>
                    <span className="text-gray-700 dark:text-gray-200 font-bold">{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.percent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="w-full space-y-3">
                <button
                  onClick={handleCopy}
                  disabled={!password}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>📋</span> {copySuccess ? "Đã Sao Chép!" : "Sao Chép Mật Khẩu"}
                </button>

                <button
                  onClick={generatePassword}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
                >
                  <span>🔄</span> Đổi Mật Khẩu Khác
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-500/20 rounded-2xl p-5 text-xs text-yellow-800 dark:text-yellow-400 leading-relaxed shadow-sm w-full">
              <h4 className="font-bold mb-1.5 flex items-center gap-1">
                <span>🔐</span> Khuyên dùng bảo mật:
              </h4>
              Mật khẩu an toàn chuẩn doanh nghiệp nên chứa ít nhất 12 ký tự, kết hợp chữ HOA, chữ thường, chữ số và các ký tự đặc biệt. Hãy thay đổi mật khẩu của bạn định kỳ mỗi 3-6 tháng!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
