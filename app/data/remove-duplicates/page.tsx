"use client";

import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function RemoveDuplicatesPage() {
  const [fileName, setFileName] = useState("");
  const [originalCount, setOriginalCount] = useState(0);
  const [cleanedCount, setCleanedCount] = useState(0);
  const [removedCount, setRemovedCount] = useState(0);
  const [cleanedData, setCleanedData] = useState<any[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        try {
          const text = event.target.result as string;
          const workbook = XLSX.read(text, { type: "string" });
          const firstSheet = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheet];
          const rows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });

          if (rows.length === 0) {
            alert("Tệp tin rỗng!");
            setIsProcessing(false);
            return;
          }

          setOriginalCount(rows.length);

          // Deduplicate rows (stringify rows to check uniqueness)
          const seen = new Set<string>();
          const uniqueRows: any[][] = [];

          // Keep header
          if (rows.length > 0) {
            uniqueRows.push(rows[0]);
            seen.add(JSON.stringify(rows[0]));
          }

          for (let i = 1; i < rows.length; i++) {
            const rowStr = JSON.stringify(rows[i]);
            if (!seen.has(rowStr)) {
              seen.add(rowStr);
              uniqueRows.push(rows[i]);
            }
          }

          setCleanedData(uniqueRows);
          setCleanedCount(uniqueRows.length);
          setRemovedCount(rows.length - uniqueRows.length);
        } catch (err) {
          console.error(err);
          alert("Lỗi khi phân tích tệp CSV. Vui lòng kiểm tra lại cấu trúc.");
        } finally {
          setIsProcessing(false);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (cleanedData.length === 0) return;

    try {
      const worksheet = XLSX.utils.aoa_to_sheet(cleanedData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);

      const baseName = fileName.substring(0, fileName.lastIndexOf(".")) || "cleaned";
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}-cleaned.csv`;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi tải tệp tin sạch về máy.");
    }
  };

  const handleClear = () => {
    setFileName("");
    setOriginalCount(0);
    setCleanedCount(0);
    setRemovedCount(0);
    setCleanedData([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/data"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Dữ liệu
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-455 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật 100% - File CSV được lọc sạch ngay trên trình duyệt máy bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🧹 Xóa dòng trùng lặp trong tệp CSV
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Nhanh chóng làm sạch danh sách khách hàng, danh bạ hoặc bảng kê dữ liệu của bạn bằng cách lọc bỏ các dòng trùng lặp giống hệt nhau.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Uploader & Stats (col: 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-col items-center justify-center min-h-[260px] relative">
              {!fileName ? (
                <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[200px]">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-5xl mb-4">🧹</span>
                  <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">
                    Chọn tệp CSV (.csv) cần làm sạch
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Kéo thả tệp tin vào đây</p>
                </div>
              ) : (
                <div className="w-full space-y-4">
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1">
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-450 font-bold uppercase tracking-wider">Tệp tin đang mở</p>
                    <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{fileName}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleClear}
                      className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                    >
                      🔄 Thay tệp khác
                    </button>
                    <button
                      onClick={handleDownload}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-emerald-500/10"
                    >
                      📥 Tải file sạch về
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Metrics cards if processed */}
            {fileName && !isProcessing && (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-4">
                <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Thống kê bộ lọc
                </h3>

                <div className="grid grid-cols-2 gap-3 text-center text-xs">
                  <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl border border-gray-150 dark:border-gray-850">
                    <p className="text-base font-black text-rose-500">{removedCount}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Dòng trùng đã xóa</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl border border-gray-150 dark:border-gray-850">
                    <p className="text-base font-black text-emerald-500">{cleanedCount}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Dòng sạch giữ lại</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cleaned Grid Preview (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2 mb-4">
              Xem trước tệp tin sạch sau khi lọc
            </h3>

            {cleanedData.length > 0 ? (
              <div className="overflow-x-auto max-h-[350px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700">
                      {cleanedData[0]?.map((head, i) => (
                        <th key={i} className="py-2 px-3 whitespace-nowrap">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {cleanedData.slice(1, 11).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="py-2 px-3 text-gray-655 dark:text-gray-300 whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs italic">
                Chưa có dữ liệu bảng tính. Tải tệp CSV bên trái để xem trước bảng biểu sau khi lọc trùng.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
