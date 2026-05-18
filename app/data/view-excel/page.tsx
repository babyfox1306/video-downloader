"use client";

import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function ViewExcelPage() {
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [fileName, setFileName] = useState("");
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState("");
  const [sheetData, setSheetData] = useState<string[][]>([]);
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
          const data = new Uint8Array(event.target.result as ArrayBuffer);
          const wb = XLSX.read(data, { type: "array" });
          setWorkbook(wb);
          setSheetNames(wb.SheetNames);
          
          if (wb.SheetNames.length > 0) {
            loadSheet(wb, wb.SheetNames[0]);
          }
        } catch (err) {
          console.error(err);
          alert("Không thể đọc tệp Excel. Định dạng tệp có thể bị lỗi hoặc không được hỗ trợ.");
        } finally {
          setIsProcessing(false);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const loadSheet = (wb: XLSX.WorkBook, name: string) => {
    setActiveSheet(name);
    const sheet = wb.Sheets[name];
    const json = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
    setSheetData(json as string[][]);
  };

  const handleSheetChange = (name: string) => {
    if (!workbook) return;
    loadSheet(workbook, name);
  };

  const handleClear = () => {
    setWorkbook(null);
    setFileName("");
    setSheetNames([]);
    setActiveSheet("");
    setSheetData([]);
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
            🔒 Bảo mật 100% - Mọi dữ liệu bảng tính chỉ đọc và hiển thị cục bộ
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            👁️ Xem nhanh file Excel online
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Mở nhanh file Excel (.xlsx, .xls) để xem trước cấu trúc bảng và nội dung từng trang tính mà không cần cài đặt phần mềm Microsoft Office.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 items-start">
          {/* Upload panel */}
          {!workbook ? (
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-8 flex flex-col items-center justify-center min-h-[300px] relative">
              <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full max-w-md hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[200px]">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-5xl mb-4">👁️</span>
                <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">
                  Chọn tệp Excel để xem ngay
                </p>
                <p className="text-xs text-gray-400 mt-2">Nhấp hoặc kéo thả tệp tin vào đây</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File details & Sheet switchers */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-wrap justify-between items-center gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Đang xem tệp tin</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{fileName}</p>
                </div>

                {/* Sheet Tabs */}
                <div className="flex flex-wrap gap-1.5 bg-gray-50 dark:bg-gray-950 p-1.5 rounded-xl border border-gray-150 dark:border-gray-850">
                  {sheetNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => handleSheetChange(name)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        activeSheet === name
                          ? "bg-emerald-600 text-white shadow"
                          : "text-gray-600 dark:text-gray-450 hover:bg-gray-100 dark:hover:bg-gray-900"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleClear}
                  className="px-4 py-2 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-455 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  ✕ Đóng tệp Excel
                </button>
              </div>

              {/* Spreadsheets Grid Sheet Table */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6">
                <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2 mb-4">
                  Dữ liệu bảng tính: {activeSheet}
                </h3>

                {sheetData.length > 0 ? (
                  <div className="overflow-auto max-h-[500px] border border-gray-150 dark:border-gray-750 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-gray-950 text-gray-400 font-bold border-b border-gray-150 dark:border-gray-700 sticky top-0 z-10">
                          <th className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-750 bg-gray-50 dark:bg-gray-950 text-center w-10">#</th>
                          {sheetData[0]?.map((head, i) => (
                            <th key={i} className="py-2.5 px-3 border-r border-gray-200 dark:border-gray-750 whitespace-nowrap">
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {sheetData.slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                            <td className="py-2 px-3 border-r border-gray-150 dark:border-gray-800 text-center bg-gray-50/30 dark:bg-gray-900/20 font-bold text-gray-400 w-10">
                              {rIdx + 1}
                            </td>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 px-3 border-r border-gray-150 dark:border-gray-850 text-gray-655 dark:text-gray-300 whitespace-nowrap">
                                {cell !== undefined ? String(cell) : ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400 text-xs italic">
                    Trang tính này hiện không có dữ liệu để hiển thị.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
