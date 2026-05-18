"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

interface InvoiceItem {
  id: number;
  name: string;
  qty: number;
  price: number;
}

export default function InvoicePage() {
  const [seller, setSeller] = useState("Cửa hàng tạp hóa ZavClip");
  const [buyer, setBuyer] = useState("Nguyễn Văn A");
  const [invoiceNo, setInvoiceNo] = useState(() => `HD-${Math.floor(1000 + Math.random() * 9000)}`);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [vat, setVat] = useState(8); // 8% standard VAT
  const [notes, setNotes] = useState("Cảm ơn quý khách đã mua sắm!");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, name: "Bút bi Thiên Long", qty: 5, price: 5000 },
    { id: 2, name: "Sổ tay da văn phòng", qty: 2, price: 45000 }
  ]);

  const previewRef = useRef<HTMLDivElement | null>(null);

  const handleAddItem = () => {
    const nextId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: nextId, name: "Sản phẩm mới", qty: 1, price: 10000 }]);
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id: number, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.qty * item.price, 0);
  };

  const getTax = () => {
    return (getSubtotal() * vat) / 100;
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const docSoVietNam = (num: number): string => {
    if (num === 0) return "Không đồng";
    const digitWords = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

    function readThreeDigits(n: number, isFirstGroup: boolean): string {
      let hundred = Math.floor(n / 100);
      let ten = Math.floor((n % 100) / 10);
      let single = n % 10;
      let res = "";

      if (hundred > 0 || !isFirstGroup) {
        res += digitWords[hundred] + " trăm ";
      }

      if (ten > 1) {
        res += digitWords[ten] + " mươi ";
      } else if (ten === 1) {
        res += "mười ";
      } else if (ten === 0 && single > 0 && (hundred > 0 || !isFirstGroup)) {
        res += "lẻ ";
      }

      if (single > 0) {
        if (single === 1 && ten > 1) {
          res += "mốt";
        } else if (single === 5 && ten > 0) {
          res += "lăm";
        } else if (single === 4 && ten > 1) {
          res += "tư";
        } else {
          res += digitWords[single];
        }
      }

      return res.trim();
    }

    let temp = BigInt(Math.round(num));
    let groups: number[] = [];
    while (temp > BigInt(0)) {
      groups.push(Number(temp % BigInt(1000)));
      temp = temp / BigInt(1000);
    }

    let words = "";
    for (let i = groups.length - 1; i >= 0; i--) {
      let g = groups[i];
      if (g === 0) continue;
      let isFirstGroup = (i === groups.length - 1);

      let unitName = "";
      if (i === 0) unitName = "";
      else if (i === 1) unitName = " nghìn";
      else if (i === 2) unitName = " triệu";
      else if (i >= 3) {
        let subIndex = i - 3;
        if (subIndex === 0) unitName = " tỷ";
        else if (subIndex === 1) unitName = " nghìn tỷ";
        else if (subIndex === 2) unitName = " triệu tỷ";
      }

      words += " " + readThreeDigits(g, isFirstGroup) + unitName;
    }

    let result = words.trim().replace(/\s+/g, " ") + " đồng chẵn.";
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    if (!previewRef.current) return;
    
    // Fast, lightweight HTML-to-PDF export using jsPDF native layout
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    doc.setFont("Helvetica");
    doc.setFontSize(20);
    doc.text(seller, 40, 60);

    doc.setFontSize(10);
    doc.text(`HOA DON BAN LE: ${invoiceNo}`, 40, 90);
    doc.text(`Ngay xuat: ${date}`, 40, 110);
    doc.text(`Khach hang: ${buyer}`, 40, 130);

    // Items list
    let y = 170;
    doc.setFontSize(12);
    doc.text("Ten San Pham", 40, y);
    doc.text("SL", 300, y);
    doc.text("Don gia", 380, y);
    doc.text("Thanh tien", 480, y);
    doc.line(40, y + 5, 550, y + 5);

    y += 25;
    doc.setFontSize(10);
    items.forEach(item => {
      doc.text(item.name, 40, y);
      doc.text(item.qty.toString(), 300, y);
      doc.text(formatMoney(item.price), 380, y);
      doc.text(formatMoney(item.qty * item.price), 480, y);
      y += 20;
    });

    doc.line(40, y, 550, y);
    y += 20;
    doc.setFontSize(11);
    doc.text(`Cong tien hang: ${formatMoney(getSubtotal())}`, 380, y);
    y += 20;
    doc.text(`Thue VAT (${vat}%): ${formatMoney(getTax())}`, 380, y);
    y += 25;
    doc.setFontSize(12);
    doc.text(`TONG CONG: ${formatMoney(getTotal())}`, 360, y);

    y += 40;
    doc.setFontSize(9);
    doc.text(`Bang chu: ${docSoVietNam(getTotal())}`, 40, y);

    y += 30;
    doc.text(notes, 40, y);

    doc.save(`hoa-don-${invoiceNo}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12 px-4 print:bg-white print:py-0 print:px-0">
      <div className="container mx-auto max-w-6xl print:max-w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link
            href="/vietnam"
            className="text-sm font-semibold text-rose-600 dark:text-rose-455 hover:underline flex items-center gap-1.5"
          >
            <span>➔</span> Quay lại bộ Tiện ích Việt Nam
          </Link>
          <span className="text-xs bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-455 px-3 py-1 rounded-full border border-rose-500/20 font-medium">
            🔒 Xử lý offline - Không lưu giữ bất kỳ hóa đơn nào của bạn
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 print:hidden">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            🧾 Tạo biên lai bán hàng nhanh
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Điền thông tin và sản phẩm để tạo hóa đơn bán lẻ chuyên nghiệp. Hỗ trợ in trực tiếp hoặc xuất file PDF tải về máy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start print:grid-cols-1 print:gap-0">
          {/* Form setup (col: 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-755 shadow-md p-6 space-y-5 print:hidden">
            <h3 className="font-bold text-sm text-gray-855 dark:text-gray-250 border-b border-gray-100 dark:border-gray-750 pb-2">
              Thông tin biên lai
            </h3>

            {/* Seller */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Tên người bán / Cửa hàng</label>
              <input
                type="text"
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-rose-500 text-gray-850 dark:text-white"
              />
            </div>

            {/* Buyer */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Tên khách hàng / Người mua</label>
              <input
                type="text"
                value={buyer}
                onChange={(e) => setBuyer(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-rose-500 text-gray-855 dark:text-white"
              />
            </div>

            {/* Code & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Số hóa đơn</label>
                <input
                  type="text"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-rose-500 text-gray-850 dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase">Ngày xuất</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-rose-500 text-gray-850 dark:text-white"
                />
              </div>
            </div>

            {/* VAT */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Thuế VAT (%)</label>
              <input
                type="number"
                value={vat}
                onChange={(e) => setVat(Number(e.target.value))}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-rose-500 text-gray-850 dark:text-white"
              />
            </div>

            {/* Items edit */}
            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-400 uppercase">Danh sách sản phẩm</label>
                <button
                  onClick={handleAddItem}
                  className="text-xs font-bold text-rose-600 dark:text-rose-455 hover:underline cursor-pointer"
                >
                  + Thêm dòng
                </button>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-gray-50 dark:bg-gray-950 p-2.5 rounded-xl border border-gray-150 dark:border-gray-850">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                      className="col-span-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-750 px-2 py-1 text-xs rounded"
                    />
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, "qty", Number(e.target.value))}
                      className="col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-755 px-1 py-1 text-xs rounded text-center"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, "price", Number(e.target.value))}
                      className="col-span-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-755 px-1 py-1 text-xs rounded text-right"
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="col-span-1 text-rose-500 font-bold text-xs text-center hover:text-rose-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Ghi chú chân trang</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-rose-500 text-gray-850 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handlePrint}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                🖨️ In hóa đơn
              </button>
              <button
                onClick={handleExportPDF}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer text-center shadow-md shadow-rose-500/10"
              >
                📥 Tải file PDF
              </button>
            </div>
          </div>

          {/* Receipt Preview (col: 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-12 text-black max-w-2xl mx-auto w-full min-h-[600px] flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0 print:min-h-0">
            <div ref={previewRef} className="space-y-8">
              {/* Header seller */}
              <div className="border-b-2 border-gray-200 pb-5">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">{seller}</h2>
                <div className="flex justify-between items-center text-[10px] text-gray-500 mt-2 font-medium">
                  <p>Mã hóa đơn: <strong>{invoiceNo}</strong></p>
                  <p>Ngày lập: {date}</p>
                </div>
              </div>

              {/* Buyer info */}
              <div className="text-xs space-y-1">
                <p className="text-gray-550">Khách hàng nhận:</p>
                <p className="font-bold text-sm text-gray-850">{buyer}</p>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto pt-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                      <th className="py-2">Tên sản phẩm / dịch vụ</th>
                      <th className="py-2 text-center w-12">SL</th>
                      <th className="py-2 text-right w-24">Đơn giá</th>
                      <th className="py-2 text-right w-24">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, idx) => (
                      <tr key={item.id} className="text-gray-700">
                        <td className="py-3 font-medium">{item.name}</td>
                        <td className="py-3 text-center">{item.qty}</td>
                        <td className="py-3 text-right">{new Intl.NumberFormat("vi-VN").format(item.price)}</td>
                        <td className="py-3 text-right font-bold text-gray-900">
                          {new Intl.NumberFormat("vi-VN").format(item.qty * item.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-5 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Cộng tiền hàng:</span>
                  <strong className="text-gray-900">{formatMoney(getSubtotal())}</strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Thuế VAT ({vat}%):</span>
                  <strong className="text-gray-900">{formatMoney(getTax())}</strong>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-2 text-sm">
                  <span className="text-gray-900 font-bold">TỔNG CỘNG:</span>
                  <strong className="text-lg font-black text-rose-600">{formatMoney(getTotal())}</strong>
                </div>
              </div>

              {/* Number to words */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-1">
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Bằng chữ</p>
                <p className="text-xs text-gray-700 leading-normal font-bold italic">
                  {docSoVietNam(getTotal())}
                </p>
              </div>
            </div>

            {/* Bottom note */}
            <div className="border-t border-gray-100 pt-6 text-center text-[10px] text-gray-400 font-medium italic mt-8 print:mt-16">
              {notes}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
