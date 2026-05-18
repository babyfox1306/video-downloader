"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { diff_match_patch, Diff } from "diff-match-patch";

export default function TextDiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffHtml, setDiffHtml] = useState<string>("");
  const [diffCount, setDiffCount] = useState({ added: 0, removed: 0, equal: 0 });

  useEffect(() => {
    if (!text1 && !text2) {
      setDiffHtml("");
      setDiffCount({ added: 0, removed: 0, equal: 0 });
      return;
    }

    try {
      const dmp = new diff_match_patch();
      const diffs = dmp.diff_main(text1, text2);
      dmp.diff_cleanupSemantic(diffs);

      let added = 0;
      let removed = 0;
      let equal = 0;

      const html = diffs
        .map(([op, text]) => {
          // op: -1 = delete, 0 = equal, 1 = insert
          const escaped = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br/>");

          if (op === 1) {
            added += text.length;
            return `<span class="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-0.5 rounded border border-emerald-300/30 font-bold">${escaped}</span>`;
          } else if (op === -1) {
            removed += text.length;
            return `<span class="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-350 px-0.5 rounded border border-rose-300/30 line-through">${escaped}</span>`;
          } else {
            equal += text.length;
            return `<span>${escaped}</span>`;
          }
        })
        .join("");

      setDiffHtml(html);
      setDiffCount({ added, removed, equal });
    } catch (e) {
      console.error(e);
    }
  }, [text1, text2]);

  const handleClear = () => {
    setText1("");
    setText2("");
  };

  const handleLoadDemo = () => {
    setText1("Chào mừng bạn đến với zavclip.com - bộ công cụ văn phòng chạy offline hoàn toàn miễn phí.");
    setText2("Chào mừng quý khách đến với zavclip.com - hệ thống công cụ văn phòng online cực nhanh & bảo mật.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/text"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 An toàn tuyệt đối - So sánh cục bộ 100% tại máy của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              🔍 So sánh hai đoạn văn bản
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Tìm điểm khác biệt giữa hai văn bản, hợp đồng, hoặc đoạn code ngay lập tức. Highlight rõ nét phần thêm và bớt.
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
              onClick={handleClear}
              className="px-4 py-2 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Xóa hết
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Parallel Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Văn bản gốc (Bản A)
              </label>
              <textarea
                placeholder="Nhập hoặc dán văn bản gốc vào đây..."
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                className="w-full h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200 leading-relaxed font-sans shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                Văn bản mới (Bản B)
              </label>
              <textarea
                placeholder="Nhập hoặc dán phiên bản mới cần so sánh vào đây..."
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                className="w-full h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-sm focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-gray-200 leading-relaxed font-sans shadow-sm"
              />
            </div>
          </div>

          {/* Stats Bar */}
          {(text1 || text2) && (
            <div className="bg-white dark:bg-gray-800 border border-gray-150 dark:border-gray-750 p-4 rounded-2xl flex flex-wrap gap-6 items-center justify-center text-xs font-bold shadow-sm">
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                Đã xóa: <strong className="text-sm">{diffCount.removed} ký tự</strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                Thêm mới: <strong className="text-sm">{diffCount.added} ký tự</strong>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2.5 h-2.5 rounded bg-gray-400" />
                Giữ nguyên: <strong className="text-sm">{diffCount.equal} ký tự</strong>
              </div>
            </div>
          )}

          {/* Live Output Highlight View */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-755 rounded-3xl p-6 shadow-md space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
              Kết quả so sánh chi tiết
            </h3>

            {diffHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: diffHtml }}
                className="text-sm md:text-base leading-relaxed text-gray-850 dark:text-gray-200 font-sans break-words whitespace-pre-wrap min-h-[150px] overflow-y-auto max-h-[400px]"
              />
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs italic">
                Chưa có dữ liệu so sánh. Hãy nhập chữ vào cả 2 ô bên trên để xem kết quả highlight khác biệt.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
