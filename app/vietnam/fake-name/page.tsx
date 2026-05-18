"use client";

import Link from "next/link";
import { useState } from "react";

interface FakeRecord {
  id: number;
  fullName: string;
  gender: string;
  birthDate: string;
  phone: string;
  email: string;
  cccd: string;
  company: string;
  address: string;
}

export default function FakeNamePage() {
  const [count, setCount] = useState(10);
  const [records, setRecords] = useState<FakeRecord[]>([]);

  const HOS = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
  
  const DEM_NAMS = ["Văn", "Hữu", "Minh", "Quốc", "Đức", "Gia", "Hoàng", "Anh", "Duy", "Thành", "Đình", "Quang", "Tuấn"];
  const TEN_NAMS = ["Anh", "Bình", "Cường", "Dũng", "Duy", "Đạt", "Giang", "Hải", "Hiếu", "Hoàng", "Hùng", "Huy", "Khoa", "Lâm", "Long", "Minh", "Nam", "Phong", "Phúc", "Quân", "Sơn", "Thành", "Thắng", "Thịnh", "Toàn", "Tuấn", "Trung", "Việt"];

  const DEM_NUS = ["Thị", "Ngọc", "Quỳnh", "Vân", "Phương", "Thu", "Thảo", "Minh", "Khánh", "Anh", "Thanh", "Mai", "Kim"];
  const TEN_NUS = ["Anh", "Bích", "Chi", "Dung", "Dương", "Giang", "Hà", "Hạnh", "Hoa", "Huyền", "Huệ", "Khánh", "Lan", "Linh", "Liên", "Mai", "My", "Ngọc", "Oanh", "Phương", "Quỳnh", "Thảo", "Trang", "Trinh", "Vân", "Vy"];

  const PROVINCES = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Bình Dương", "Đồng Nai", "Quảng Ninh", "Khánh Hòa", "Thanh Hóa", "Nghệ An"];
  const STREETS = ["Lê Lợi", "Nguyễn Huệ", "Trần Hưng Đạo", "Hai Bà Trưng", "Lý Thường Kiệt", "Điện Biên Phủ", "Bùi Viện", "Nguyễn Trãi", "Lê Hồng Phong"];
  
  const COMPANIES = [
    "Công nghệ số ZavTech", "Đầu tư và Xây dựng Hưng Thịnh", "Thương mại dịch vụ Đại Nam", "Giải pháp thông minh Việt Nam",
    "Bán lẻ và Tiêu dùng An Bình", "Địa ốc Trường Sơn", "Vận tải quốc tế Trường Hải", "May mặc Xuất khẩu Hòa Bình"
  ];

  const generateData = () => {
    let temp: FakeRecord[] = [];

    for (let i = 1; i <= count; i++) {
      const isMale = Math.random() > 0.5;
      const gender = isMale ? "Nam" : "Nữ";

      // 1. Full name
      const ho = HOS[Math.floor(Math.random() * HOS.length)];
      let dem = "";
      let ten = "";

      if (isMale) {
        dem = DEM_NAMS[Math.floor(Math.random() * DEM_NAMS.length)];
        ten = TEN_NAMS[Math.floor(Math.random() * TEN_NAMS.length)];
      } else {
        dem = DEM_NUS[Math.floor(Math.random() * DEM_NUS.length)];
        ten = TEN_NUS[Math.floor(Math.random() * TEN_NUS.length)];
      }
      const fullName = `${ho} ${dem} ${ten}`;

      // 2. Birthday (Age 18 - 60)
      const birthYear = Math.floor(Math.random() * (2006 - 1965 + 1)) + 1965;
      const birthMonth = Math.floor(Math.random() * 12) + 1;
      const birthDay = Math.floor(Math.random() * 28) + 1;
      const formattedMonth = birthMonth < 10 ? `0${birthMonth}` : birthMonth;
      const formattedDay = birthDay < 10 ? `0${birthDay}` : birthDay;
      const birthDate = `${formattedDay}/${formattedMonth}/${birthYear}`;

      // 3. Phone (Vina/Viettel/Mobi standard prefixes)
      const prefixes = ["090", "091", "098", "096", "035", "038", "077", "086", "088"];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = Math.floor(1000000 + Math.random() * 9000000).toString().substring(1);
      const phone = `${prefix}${suffix}`;

      // 4. Email
      const unsignedName = fullName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, "");
      const email = `${unsignedName}${Math.floor(Math.random() * 99)}@gmail.com`;

      // 5. CCCD
      const provCode = Math.floor(1 + Math.random() * 96).toString().padStart(3, "0");
      const genderCode = isMale ? (birthYear >= 2000 ? "2" : "0") : (birthYear >= 2000 ? "3" : "1");
      const yearCode = birthYear.toString().substring(2);
      const randSeq = Math.floor(100000 + Math.random() * 900000);
      const cccd = `${provCode}${genderCode}${yearCode}${randSeq}`;

      // 6. Address
      const prov = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
      const street = STREETS[Math.floor(Math.random() * STREETS.length)];
      const houseNo = Math.floor(Math.random() * 150) + 1;
      const address = `Số ${houseNo}, đường ${street}, ${prov}`;

      // 7. Company
      const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];

      temp.push({
        id: i,
        fullName,
        gender,
        birthDate,
        phone,
        email,
        cccd,
        company,
        address
      });
    }

    setRecords(temp);
  };

  const handleExportJSON = () => {
    if (records.length === 0) return;
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vietnamese-test-data-${records.length}.json`;
    link.click();
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = ["ID", "Họ Tên", "Giới Tính", "Ngày Sinh", "Số Điện Thoại", "Email", "CCCD", "Công Ty", "Địa Chỉ"];
    const rows = records.map(r => [
      r.id,
      `"${r.fullName}"`,
      `"${r.gender}"`,
      `"${r.birthDate}"`,
      `"${r.phone}"`,
      `"${r.email}"`,
      `"${r.cccd}"`,
      `"${r.company}"`,
      `"${r.address}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `vietnamese-test-data-${records.length}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/vietnam"
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích Việt Nam
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Thiết lập offline - Phục vụ lập trình viên test data
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🎲 Tạo họ tên & Thông tin giả Việt Nam
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Công cụ hỗ trợ các bạn lập trình viên tạo nhanh dữ liệu kiểm thử (Mock Data) chuẩn Việt Nam như họ tên, giới tính, email, SĐT, CCCD, địa chỉ, công ty.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (col: 4) */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Cấu hình dữ liệu
            </h3>

            {/* Slider for count */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 dark:text-gray-300">
                <span>Số lượng bản ghi:</span>
                <span className="text-rose-600 dark:text-rose-450 text-sm">{count} dòng</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-rose-600"
              />
            </div>

            <button
              onClick={generateData}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm"
            >
              🎲 Tạo Dữ Liệu Ngẫu Nhiên
            </button>

            {records.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleExportCSV}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  📥 Tải file CSV
                </button>
                <button
                  onClick={handleExportJSON}
                  className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer text-center"
                >
                  📥 Tải file JSON
                </button>
              </div>
            )}
          </div>

          {/* Records Table View (col: 8) */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2 mb-4">
              Bảng xem trước dữ liệu
            </h3>

            {records.length > 0 ? (
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700">
                      <th className="py-2.5 px-3">Họ Tên</th>
                      <th className="py-2.5 px-3">Giới tính</th>
                      <th className="py-2.5 px-3">Ngày sinh</th>
                      <th className="py-2.5 px-3">SĐT</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">CCCD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {records.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                        <td className="py-2 px-3 font-bold text-gray-900 dark:text-white whitespace-nowrap">{r.fullName}</td>
                        <td className="py-2 px-3 text-gray-655 dark:text-gray-300">{r.gender}</td>
                        <td className="py-2 px-3 text-gray-655 dark:text-gray-300">{r.birthDate}</td>
                        <td className="py-2 px-3 font-mono text-emerald-600 dark:text-emerald-450">{r.phone}</td>
                        <td className="py-2 px-3 text-gray-400 truncate max-w-[120px]">{r.email}</td>
                        <td className="py-2 px-3 font-mono text-gray-400">{r.cccd}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs italic">
                Chưa có dữ liệu ngẫu nhiên được tạo. Nhấp nút tạo ở bên trái để điền ngẫu nhiên.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
