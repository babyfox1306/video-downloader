"use client";

import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function JSONToCSVPage() {
  const [jsonText, setJsonText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = (format: "csv" | "xlsx") => {
    if (!jsonText.trim()) return;

    try {
      const parsed = JSON.parse(jsonText);
      
      // Check if it's an array of objects
      if (!Array.isArray(parsed)) {
        alert("Dữ liệu JSON đầu vào phải là một mảng các đối tượng (Array of Objects). Ví dụ:\n[\n  { \"tên\": \"A\", \"tuổi\": 20 },\n  { \"tên\": \"B\", \"tuổi\": 22 }\n]");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(parsed);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      if (format === "xlsx") {
        XLSX.writeFile(workbook, `converted-${Date.now()}.xlsx`);
      } else {
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `converted-${Date.now()}.csv`;
        link.click();
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi! Dữ liệu JSON không hợp lệ, vui lòng kiểm tra lại cú pháp.");
    }
  };

  const handleLoadDemo = () => {
    const demo = [
      { "Mã nhân viên": "NV001", "Họ tên": "Nguyễn Văn A", "Bộ phận": "Hành chính", "Lương": 12000000 },
      { "Mã nhân viên": "NV002", "Họ tên": "Trần Thị B", "Bộ phận": "Kế toán", "Lương": 15000000 },
      { "Mã nhân viên": "NV003", "Họ tên": "Phạm Văn C", "Bộ phận": "Kỹ thuật", "Lương": 18000000 }
    ];
    setJsonText(JSON.stringify(demo, null, 2));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/data"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Dữ liệu
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật tuyệt đối - Dữ liệu JSON được chuyển đổi 100% tại máy của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              🔀 Chuyển đổi JSON sang CSV / Excel
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Dán đoạn dữ liệu cấu trúc JSON của bạn để xuất ngay ra tệp bảng tính Excel (.xlsx) hoặc CSV dạng bảng mượt mà.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLoadDemo}
              className="px-4 py-2 border border-gray-250 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Xem mẫu thử
            </button>
            <button
              onClick={() => setJsonText("")}
              className="px-4 py-2 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-455 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Xóa hết
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Editor Input (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-5 space-y-2.5">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Nhập mã JSON cần chuyển đổi (Mảng các đối tượng)
            </label>
            <textarea
              placeholder="Dán mã JSON tại đây..."
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full h-96 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-xs font-mono focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200 leading-normal"
            />
          </div>

          {/* Action Panel (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-6">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Xuất tệp tin
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              Vui lòng đảm bảo định dạng JSON là một danh sách phẳng các dòng (được biểu thị bằng mảng). Các trường khóa trong object sẽ tự động làm hàng tiêu đề cột (Header) của bảng Excel/CSV.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleConvert("xlsx")}
                disabled={!jsonText.trim()}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm disabled:opacity-50"
              >
                📥 Tải file Excel (.xlsx)
              </button>
              <button
                onClick={() => handleConvert("csv")}
                disabled={!jsonText.trim()}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm disabled:opacity-50"
              >
                📥 Tải file CSV (.csv)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
