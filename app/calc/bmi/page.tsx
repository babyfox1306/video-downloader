"use client";

import Link from "next/link";
import { useState } from "react";

export default function BMIPage() {
  const [weight, setWeight] = useState(60); // in kg
  const [height, setHeight] = useState(165); // in cm
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [colorClass, setColorClass] = useState("");
  const [advice, setAdvice] = useState("");

  const calculateBMI = () => {
    if (weight <= 0 || height <= 0) return;
    const heightInMeters = height / 100;
    const computedBmi = weight / (heightInMeters * heightInMeters);
    const finalBmi = Math.round(computedBmi * 10) / 10;
    setBmi(finalBmi);

    // Classification based on WHO Asia-Pacific guidelines
    if (finalBmi < 18.5) {
      setCategory("Nhẹ cân (Gầy)");
      setColorClass("text-blue-500 bg-blue-100 dark:bg-blue-950/40");
      setAdvice("Bạn đang hơi nhẹ cân một chút. Hãy bổ sung dinh dưỡng đầy đủ và rèn luyện thể thao để tăng cân khỏe mạnh nhé!");
    } else if (finalBmi >= 18.5 && finalBmi < 23.0) {
      setCategory("Cân đối (Bình thường)");
      setColorClass("text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40");
      setAdvice("Chỉ số tuyệt vời! Hãy duy trì lối sống lành mạnh, ăn nhiều rau quả và tập thể dục đều đặn hàng ngày.");
    } else if (finalBmi >= 23.0 && finalBmi < 25.0) {
      setCategory("Thừa cân");
      setColorClass("text-orange-500 bg-orange-100 dark:bg-orange-950/40");
      setAdvice("Bạn đang có xu hướng thừa cân. Hãy chú ý giảm bớt đồ ngọt, chất béo và tăng cường vận động đốt calo nhé!");
    } else {
      setCategory("Béo phì");
      setColorClass("text-rose-600 bg-rose-100 dark:bg-rose-950/40");
      setAdvice("Chỉ số ở mức béo phì có thể ảnh hưởng đến sức khỏe tim mạch. Hãy tham khảo ý kiến chuyên gia dinh dưỡng để có chế độ ăn lành mạnh nhé!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/calc"
            className="text-sm font-semibold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tính toán
          </Link>
          <span className="text-xs bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-450 px-3 py-1 rounded-full border border-emerald-500/20 font-medium">
            🔒 Bảo mật tuyệt đối - Không thu thập chỉ số sức khỏe của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            ⚖️ Tính chỉ số BMI (Chỉ số khối cơ thể)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Tính toán chỉ số BMI theo chuẩn WHO châu Á giúp bạn dễ dàng đánh giá tình trạng vóc dáng và sức khỏe cơ thể.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Inputs block (col: 5) */}
          <div className="md:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-6">
            <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Nhập chỉ số cơ thể
            </h3>

            {/* Height Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Chiều cao của bạn (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
              <input
                type="range"
                min="100"
                max="220"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            {/* Weight Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase">
                Cân nặng của bạn (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-3 text-base font-bold focus:outline-none focus:border-emerald-500 text-gray-800 dark:text-white"
              />
              <input
                type="range"
                min="30"
                max="150"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-600"
              />
            </div>

            <button
              onClick={calculateBMI}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs md:text-sm"
            >
              ⚖️ Bắt đầu tính toán
            </button>
          </div>

          {/* Results panel (col: 7) */}
          <div className="md:col-span-7">
            {bmi === null ? (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-8 text-center shadow-md min-h-[300px] flex flex-col justify-center items-center space-y-3">
                <span className="text-5xl">⚖️</span>
                <p className="text-gray-750 dark:text-gray-300 font-bold">Xem kết quả chỉ số BMI</p>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Thiết lập chiều cao và cân nặng ở bên trái, sau đó bấm tính toán để phân tích tình trạng cơ thể.
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 p-6 shadow-md space-y-6">
                <h3 className="font-bold text-sm text-gray-850 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
                  Kết quả chỉ số cơ thể
                </h3>

                <div className="text-center py-6 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-850 space-y-2">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Chỉ số BMI của bạn</p>
                  <p className="text-5xl font-black text-emerald-600 dark:text-emerald-450">{bmi}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                    {category}
                  </span>
                </div>

                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl space-y-1">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">Lời khuyên sức khỏe</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {advice}
                  </p>
                </div>

                {/* Score scale visual */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Thang đo chỉ số BMI (WHO Châu Á)</p>
                  <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
                    <div className={`p-2 rounded-l-lg ${bmi < 18.5 ? "bg-blue-500 text-white font-extrabold" : "bg-gray-100 dark:bg-gray-900 text-gray-450"}`}>
                      &lt; 18.5<br/>Gầy
                    </div>
                    <div className={`p-2 ${bmi >= 18.5 && bmi < 23.0 ? "bg-emerald-500 text-white font-extrabold" : "bg-gray-100 dark:bg-gray-900 text-gray-450"}`}>
                      18.5 - 23<br/>Bình thường
                    </div>
                    <div className={`p-2 ${bmi >= 23.0 && bmi < 25.0 ? "bg-orange-500 text-white font-extrabold" : "bg-gray-100 dark:bg-gray-900 text-gray-450"}`}>
                      23 - 25<br/>Thừa cân
                    </div>
                    <div className={`p-2 rounded-r-lg ${bmi >= 25.0 ? "bg-rose-500 text-white font-extrabold" : "bg-gray-100 dark:bg-gray-900 text-gray-450"}`}>
                      &gt; 25<br/>Béo phì
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
