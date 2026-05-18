"use client";

import Link from "next/link";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function CSVToExcelPage() {
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState<string[][]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const text = event.target.result as string;
        setCsvContent(text);

        // Parse preview
        try {
          const workbook = XLSX.read(text, { type: "string" });
          const firstSheet = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheet];
          const json = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 });
          setPreviewData(json.slice(0, 10) as string[][]); // Preview top 10 rows
        } catch (err) {
          console.error(err);
        } finally {
          setIsProcessing(false);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleConvert = () => {
    if (!csvContent) return;

    try {
      const workbook = XLSX.read(csvContent, { type: "string" });
      const baseName = fileName.substring(0, fileName.lastIndexOf(".")) || "converted";
      XLSX.writeFile(workbook, `${baseName}.xlsx`);
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi chuyển đổi tệp CSV sang Excel.");
    }
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
            🔒 Xử lý offline - Tệp tin của bạn tuyệt đối không rời máy tính
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            📊 Chuyển đổi CSV sang Excel
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Nạp nhanh tệp tin CSV (.csv) từ phần mềm, quảng cáo hoặc kế toán của bạn để xuất ra định dạng Excel (.xlsx) mượt mà.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Uploader (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 flex flex-col items-center justify-center min-h-[300px] relative">
            {!csvContent ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-3 border-dashed border-gray-250 dark:border-gray-700 rounded-2xl w-full hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors relative cursor-pointer min-h-[250px]">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <span className="text-5xl mb-4">📊</span>
                <p className="font-bold text-gray-750 dark:text-gray-300 text-sm">
                  Chọn tệp tin CSV (.csv)
                </p>
                <p className="text-xs text-gray-400 mt-2">Kéo thả tệp tin của bạn vào đây</p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl space-y-1">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-450 font-bold uppercase tracking-wider">Tệp tin đang mở</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-white truncate">{fileName}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCsvContent(null)}
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
                  >
                    🔄 Đổi tệp tin khác
                  </button>
                  <button
                    onClick={handleConvert}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-emerald-500/10"
                  >
                    📥 Tải file Excel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Preview (col: 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200 border-b border-gray-100 dark:border-gray-750 pb-2 mb-4">
              Xem trước 10 dòng đầu tiên
            </h3>

            {previewData.length > 0 ? (
              <div className="overflow-x-auto max-h-[350px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700">
                      {previewData[0]?.map((head, i) => (
                        <th key={i} className="py-2 px-3 whitespace-nowrap">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {previewData.slice(1).map((row, rIdx) => (
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
                Chưa có dữ liệu bảng tính. Tải tệp CSV bên trái để xem trước bảng biểu.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
