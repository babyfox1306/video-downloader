"use client";

import Link from "next/link";
import { useState } from "react";

const PROVINCES_MAP: Record<string, string> = {
  "001": "Hà Nội",
  "002": "Hà Giang",
  "004": "Cao Bằng",
  "006": "Bắc Kạn",
  "008": "Tuyên Quang",
  "010": "Lào Cai",
  "011": "Điện Biên",
  "012": "Lai Châu",
  "014": "Sơn La",
  "015": "Yên Bái",
  "017": "Hòa Bình",
  "019": "Thái Nguyên",
  "020": "Lạng Sơn",
  "022": "Quảng Ninh",
  "024": "Bắc Giang",
  "025": "Phú Thọ",
  "026": "Vĩnh Phúc",
  "027": "Bắc Ninh",
  "030": "Hải Dương",
  "031": "Hải Phòng",
  "033": "Hưng Yên",
  "034": "Thái Bình",
  "035": "Hà Nam",
  "036": "Nam Định",
  "037": "Ninh Bình",
  "038": "Thanh Hóa",
  "040": "Nghệ An",
  "042": "Hà Tĩnh",
  "044": "Quảng Bình",
  "045": "Quảng Trị",
  "046": "Thừa Thiên Huế",
  "048": "Đà Nẵng",
  "049": "Quảng Nam",
  "051": "Quảng Ngãi",
  "052": "Bình Định",
  "054": "Phú Yên",
  "056": "Khánh Hòa",
  "058": "Ninh Thuận",
  "060": "Bình Thuận",
  "062": "Kon Tum",
  "064": "Gia Lai",
  "066": "Đắk Lắk",
  "067": "Đắk Nông",
  "068": "Lâm Đồng",
  "070": "Bình Phước",
  "072": "Tây Ninh",
  "074": "Bình Dương",
  "075": "Đồng Nai",
  "077": "Bà Rịa - Vũng Tàu",
  "079": "TP. Hồ Chí Minh",
  "080": "Long An",
  "082": "Tiền Giang",
  "083": "Bến Tre",
  "084": "Trà Vinh",
  "086": "Vĩnh Long",
  "087": "Đồng Tháp",
  "089": "An Giang",
  "091": "Kiên Giang",
  "092": "Cần Thơ",
  "093": "Hậu Giang",
  "094": "Sóc Trăng",
  "095": "Bạc Liêu",
  "096": "Cà Mau"
};

export default function CCCDCheckPage() {
  const [cccd, setCccd] = useState("");
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheck = () => {
    setErrorMsg("");
    setResult(null);

    const clean = cccd.replace(/\s/g, "");
    if (clean.length !== 12) {
      setErrorMsg("Số CCCD phải đúng 12 chữ số.");
      return;
    }
    if (!/^\d+$/.test(clean)) {
      setErrorMsg("Số CCCD chỉ được phép chứa các chữ số từ 0 đến 9.");
      return;
    }

    // 1. Province/city code (First 3 digits)
    const provinceCode = clean.substring(0, 3);
    const province = PROVINCES_MAP[provinceCode] || "Mã tỉnh/thành không tồn tại trên hệ thống";

    // 2. Gender & Century code (4th digit)
    // 0: Nam (Century 20, i.e. 19xx)
    // 1: Nữ (Century 20, i.e. 19xx)
    // 2: Nam (Century 21, i.e. 20xx)
    // 3: Nữ (Century 21, i.e. 20xx)
    // 4: Nam (Century 22, i.e. 21xx)
    // 5: Nữ (Century 22, i.e. 21xx)
    // 6: Nam (Century 23, i.e. 22xx)
    // 7: Nữ (Century 23, i.e. 22xx)
    const genderDigit = parseInt(clean.charAt(3), 10);
    let gender = "";
    let birthCentury = 0;

    switch (genderDigit) {
      case 0:
        gender = "Nam";
        birthCentury = 1900;
        break;
      case 1:
        gender = "Nữ";
        birthCentury = 1900;
        break;
      case 2:
        gender = "Nam";
        birthCentury = 2000;
        break;
      case 3:
        gender = "Nữ";
        birthCentury = 2000;
        break;
      case 4:
        gender = "Nam";
        birthCentury = 2100;
        break;
      case 5:
        gender = "Nữ";
        birthCentury = 2100;
        break;
      case 6:
        gender = "Nam";
        birthCentury = 2200;
        break;
      case 7:
        gender = "Nữ";
        birthCentury = 2200;
        break;
      default:
        setErrorMsg("Mã số thế hệ/giới tính (ký tự thứ 4) không hợp lệ.");
        return;
    }

    // 3. Birth year (5th and 6th digits)
    const yearDigits = parseInt(clean.substring(4, 6), 10);
    const birthYear = birthCentury + yearDigits;

    // 4. Random sequence (last 6 digits)
    const randomSeq = clean.substring(6);

    setResult({
      province,
      gender,
      birthYear,
      randomSeq
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/vietnam"
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích Việt Nam
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Bảo mật 100% - Mọi dữ liệu chỉ kiểm tra cục bộ, KHÔNG lưu trữ
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🪪 Giải mã & Kiểm tra số CCCD
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Nhập số Căn cước công dân (12 chữ số) để kiểm tra tính hợp lệ và giải mã thông tin nơi đăng ký khai sinh, giới tính, và năm sinh hoàn toàn offline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* DOB Input (col: 5) */}
          <div className="md:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-6">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Nhập số Căn cước công dân
            </h3>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Số thẻ (12 chữ số)
              </label>
              <input
                type="text"
                maxLength={12}
                placeholder="Ví dụ: 037096001234..."
                value={cccd}
                onChange={(e) => setCccd(e.target.value.replace(/[^0-9]/g, ""))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-rose-500 text-gray-800 dark:text-white tracking-widest text-center"
              />
            </div>

            <button
              onClick={handleCheck}
              disabled={cccd.length !== 12}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm disabled:opacity-50"
            >
              🔍 Giải mã thông tin
            </button>
          </div>

          {/* Results panel (col: 7) */}
          <div className="md:col-span-7">
            {errorMsg && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-rose-650 dark:text-rose-400 rounded-2xl text-xs font-bold shadow-sm">
                ⚠️ Lỗi: {errorMsg}
              </div>
            )}

            {!result && !errorMsg && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-8 text-center shadow-md min-h-[300px] flex flex-col justify-center items-center space-y-3">
                <span className="text-5xl">🪪</span>
                <p className="text-gray-750 dark:text-gray-300 font-bold">Giải mã số thẻ Căn cước</p>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Nhập đủ 12 chữ số CCCD bên trái và ấn nút kiểm tra để giải mã chi tiết các ký tự số định danh.
                </p>
              </div>
            )}

            {result && !errorMsg && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-5">
                <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Dữ liệu giải mã từ CCCD
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-750 pb-2.5">
                    <span className="text-gray-500 font-medium">Nơi đăng ký khai sinh:</span>
                    <strong className="text-sm font-bold text-gray-900 dark:text-white">
                      {result.province}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-750 pb-2.5">
                    <span className="text-gray-500 font-medium">Giới tính:</span>
                    <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/10">
                      {result.gender}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-xs border-b border-gray-50 dark:border-gray-750 pb-2.5">
                    <span className="text-gray-500 font-medium">Năm sinh:</span>
                    <strong className="text-sm font-bold text-gray-900 dark:text-white">
                      {result.birthYear}
                    </strong>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Mã số ngẫu nhiên:</span>
                    <strong className="text-sm font-bold text-gray-400 font-mono tracking-wider">
                      {result.randomSeq}
                    </strong>
                  </div>
                </div>

                <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-3.5 rounded-xl text-[10px] text-rose-800 dark:text-rose-400 font-bold leading-normal">
                  ⚠️ Lưu ý quan trọng: Công cụ này phân tích cấu trúc mã số định danh 12 số hoàn toàn offline. ZavClip không bao giờ lưu trữ hay truyền số CCCD của bạn lên mạng. Bạn có thể ngắt kết nối mạng trước khi kiểm tra để hoàn toàn yên tâm.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
