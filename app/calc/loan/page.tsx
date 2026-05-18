"use client";

import Link from "next/link";
import { useState } from "react";

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
}

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000000); // 500 million
  const [interestRate, setInterestRate] = useState(8.5); // 8.5% per year
  const [term, setTerm] = useState(60); // 60 months (5 years)
  const [method, setMethod] = useState<"decline" | "equal">("decline"); // decline = Dư nợ giảm dần, equal = Gốc đều hàng tháng
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [summary, setSummary] = useState({
    totalPrincipal: 0,
    totalInterest: 0,
    totalPayment: 0,
    firstMonthPayment: 0
  });
  const [calculated, setCalculated] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleCalculate = () => {
    const p = loanAmount;
    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = term;

    let tempSchedule: ScheduleRow[] = [];
    let totalInterest = 0;
    let remaining = p;
    const monthlyPrincipal = p / n;

    if (method === "decline") {
      // Dư nợ giảm dần (Principal & Interest decline)
      // Standard annuity formula: Monthly Payment = P * r * (1 + r)^n / ((1 + r)^n - 1)
      const monthlyPayment = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      for (let i = 1; i <= n; i++) {
        const interest = remaining * r;
        const principal = monthlyPayment - interest;
        remaining -= principal;

        totalInterest += interest;
        tempSchedule.push({
          month: i,
          payment: monthlyPayment,
          principal: principal,
          interest: interest,
          remaining: Math.max(0, remaining)
        });
      }
    } else {
      // Gốc đều hàng tháng, Lãi tính trên dư nợ thực tế
      for (let i = 1; i <= n; i++) {
        const interest = remaining * r;
        const payment = monthlyPrincipal + interest;
        remaining -= monthlyPrincipal;

        totalInterest += interest;
        tempSchedule.push({
          month: i,
          payment: payment,
          principal: monthlyPrincipal,
          interest: interest,
          remaining: Math.max(0, remaining)
        });
      }
    }

    setSchedule(tempSchedule);
    setSummary({
      totalPrincipal: p,
      totalInterest: totalInterest,
      totalPayment: p + totalInterest,
      firstMonthPayment: tempSchedule[0]?.payment || 0
    });
    setCalculated(true);
    setShowSchedule(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/calc"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tính toán
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 An toàn & Bảo mật 100% - Không thu thập dữ liệu tài chính
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            💵 Tính lãi vay ngân hàng
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tính toán số tiền gốc, tiền lãi phải trả hàng tháng khi mua nhà, mua xe giúp bạn chủ động kế hoạch tài chính cá nhân.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form input (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-5">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Thông số khoản vay
            </h3>

            {/* Money amount */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Số tiền cần vay (VND)
              </label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
              <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold">
                Bằng chữ: {formatMoney(loanAmount)}
              </p>
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Lãi suất (%/năm)
              </label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
            </div>

            {/* Term */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Thời gian vay (Tháng)
              </label>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
              <p className="text-[10px] text-gray-450">
                Tương đương: <strong>{(term / 12).toFixed(1)} năm</strong>
              </p>
            </div>

            {/* Method */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Phương thức trả nợ
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMethod("decline")}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    method === "decline"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/10"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Dư nợ giảm dần
                </button>
                <button
                  onClick={() => setMethod("equal")}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                    method === "equal"
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/10"
                      : "bg-gray-50 dark:bg-gray-900 border-gray-250 dark:border-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  Gốc đều lãi thực tế
                </button>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm"
            >
              📊 Tính toán kết quả
            </button>
          </div>

          {/* Amortization Summary & Details (col: 7) */}
          <div className="lg:col-span-7 space-y-6">
            {!calculated ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-8 text-center shadow-md min-h-[350px] flex flex-col justify-center items-center space-y-3">
                <span className="text-5xl">💵</span>
                <p className="text-gray-700 dark:text-gray-300 font-bold">Hãy nhấn nút tính toán</p>
                <p className="text-xs text-gray-400 max-w-xs">
                  Điền các thông số về khoản vay bên trái và nhấn nút để xem bảng phân bổ thanh toán cụ thể.
                </p>
              </div>
            ) : (
              <>
                {/* Summary boxes */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-6">
                  <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                    Tóm tắt thanh toán
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-850">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Trả tháng đầu tiên</p>
                      <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {formatMoney(summary.firstMonthPayment)}
                      </p>
                    </div>

                    <div className="bg-gray-55 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-850">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Tổng lãi phải trả</p>
                      <p className="text-base font-extrabold text-rose-600 dark:text-rose-400 mt-1">
                        {formatMoney(summary.totalInterest)}
                      </p>
                    </div>

                    <div className="bg-gray-55 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-850 col-span-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Tổng gốc và lãi phải trả</p>
                      <p className="text-lg font-black text-gray-900 dark:text-white mt-1">
                        {formatMoney(summary.totalPayment)}
                      </p>
                      <span className="text-[10px] text-gray-455">
                        (Tiền lãi chiếm {( (summary.totalInterest / summary.totalPayment) * 100 ).toFixed(1)}% tổng khoản trả)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Monthly Breakdowns */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6">
                  <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-750 pb-3">
                    <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200">
                      Lịch thanh toán hàng tháng
                    </h3>
                    <button
                      onClick={() => setShowSchedule(!showSchedule)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showSchedule ? " Thu gọn" : " Hiển thị chi tiết"}
                    </button>
                  </div>

                  {showSchedule && (
                    <div className="mt-4 max-h-[300px] overflow-y-auto border border-gray-100 dark:border-gray-700 rounded-2xl">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-gray-950 text-gray-400 font-bold border-b border-gray-100 dark:border-gray-700">
                            <th className="py-2.5 px-3">Tháng</th>
                            <th className="py-2.5 px-3">Gốc + Lãi</th>
                            <th className="py-2.5 px-3">Tiền Gốc</th>
                            <th className="py-2.5 px-3">Tiền Lãi</th>
                            <th className="py-2.5 px-3">Dư nợ còn lại</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          {schedule.map((row) => (
                            <tr key={row.month} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
                              <td className="py-2 px-3 font-bold">{row.month}</td>
                              <td className="py-2 px-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                                {new Intl.NumberFormat("vi-VN").format(Math.round(row.payment))}
                              </td>
                              <td className="py-2 px-3 text-gray-650 dark:text-gray-300">
                                {new Intl.NumberFormat("vi-VN").format(Math.round(row.principal))}
                              </td>
                              <td className="py-2 px-3 text-rose-500">
                                {new Intl.NumberFormat("vi-VN").format(Math.round(row.interest))}
                              </td>
                              <td className="py-2 px-3 text-gray-400 font-mono">
                                {new Intl.NumberFormat("vi-VN").format(Math.round(row.remaining))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
