import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZavClip - Công cụ văn phòng online miễn phí",
  description: "Bộ công cụ PDF, ảnh, tính toán, tiện ích Việt Nam - miễn phí, không cần cài đặt, file không rời máy bạn",
};

const HUB_CARDS = [
  {
    name: "Công cụ PDF",
    emoji: "📄",
    href: "/pdf",
    description: "Nén, gộp, tách, xoay, chuyển Word sang PDF, chuyển PDF sang ảnh cực nhanh và tiện lợi.",
    badge: "10 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Chỉnh sửa ảnh",
    emoji: "🖼️",
    href: "/image",
    description: "Nén ảnh, đổi định dạng PNG/JPG/WEBP, xóa nền bằng AI, cắt, resize ngay tại chỗ.",
    badge: "10 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Tiện ích văn phòng",
    emoji: "📝",
    href: "/text",
    description: "Đếm từ, tạo mã QR, mật khẩu ngẫu nhiên, barcode, format định dạng JSON, tra cứu mã màu sắc.",
    badge: "8 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Tạo Meme",
    emoji: "😂",
    href: "/meme",
    description: "Chế meme từ 100+ template viral hàng đầu, thêm nhiều chữ, kéo thả kéo dãn, tải ảnh nét về máy.",
    badge: "Thiết kế",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Bảng âm thanh",
    emoji: "🎵",
    href: "/soundboard",
    description: "50+ âm thanh hiệu ứng meme & nhạc game thịnh hành nhất hiện nay, bấm phát tức thời & tải về máy.",
    badge: "50 âm thanh",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Tiện ích Việt Nam",
    emoji: "🇻🇳",
    href: "/vietnam",
    description: "Xem Âm Dương lịch, kiểm tra số thẻ CCCD, tạo họ tên giả cho dev và thiết kế hóa đơn bán lẻ nhanh.",
    badge: "5 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Tính toán & Tra cứu",
    emoji: "🧮",
    href: "/calc",
    description: "Tính bảng lãi vay ngân hàng, đổi đơn vị đo lường (mẫu/sào), chỉ số BMI, tuổi chính xác.",
    badge: "6 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Thiết kế nhanh",
    emoji: "🎨",
    href: "/design",
    description: "Tạo ảnh mẫu placeholder, thiết kế màu dải CSS Gradient, tạo bóng box-shadow và nén favicon.ico.",
    badge: "5 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Bảng tính & Dữ liệu",
    emoji: "📊",
    href: "/data",
    description: "Đổi đuôi file Excel, CSV, JSON qua lại nhanh chóng, xem file Excel online, lọc trùng dòng dữ liệu.",
    badge: "5 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Xử lý Video & Audio",
    emoji: "🎬",
    href: "/video",
    description: "Cắt video online, tách nhạc MP3 từ clip, nén dung lượng video, đổi định dạng file âm thanh.",
    badge: "4 công cụ",
    colorClass: "hover:border-[#4F46E5] dark:hover:border-[#6366F1]",
    badgeColor: "text-[#4F46E5] dark:text-[#6366F1] bg-indigo-50 dark:bg-indigo-950/40"
  },
  {
    name: "Ý tưởng đóng góp",
    emoji: "💡",
    href: "#",
    description: "Bạn cần thêm công cụ văn phòng nào? Gửi ý kiến cho chúng tôi để cùng phát triển miễn phí.",
    badge: "Ý kiến",
    colorClass: "",
    badgeColor: "text-[#6B7280] dark:text-[#94A3B8] bg-gray-100 dark:bg-slate-800"
  },
  {
    name: "Sắp ra mắt",
    emoji: "🚀",
    href: "#",
    description: "Nhiều tiện ích chuyển đổi tài liệu, biểu đồ tự động và công cụ văn phòng thông minh đang hoàn thiện.",
    badge: "Đang làm",
    colorClass: "",
    badgeColor: "text-[#6B7280] dark:text-[#94A3B8] bg-gray-100 dark:bg-slate-800"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] py-16 px-4 flex flex-col justify-center items-center transition-colors">
      <div className="container mx-auto max-w-6xl">
        
        {/* Cruip Elegant Hero Section */}
        <div className="text-center mb-16 space-y-5">
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] dark:text-[#F1F5F9] tracking-tight leading-tight">
            Công cụ văn phòng miễn phí
          </h1>
          
          <p className="text-base md:text-lg text-[#6B7280] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
            Xử lý PDF, ảnh, tính toán ngay trên trình duyệt. File không bao giờ rời máy bạn.
          </p>

          {/* Minimalist Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <span className="text-[#4F46E5] dark:text-[#6366F1]">✓</span> Miễn phí
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#4F46E5] dark:text-[#6366F1]">✓</span> Không cài đặt
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#4F46E5] dark:text-[#6366F1]">✓</span> File không upload
            </span>
            <span className="flex items-center gap-1">
              <span className="text-[#4F46E5] dark:text-[#6366F1]">✓</span> Offline được
            </span>
          </div>
        </div>

        {/* Clean Cruip Tool Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {HUB_CARDS.map((card) => {
            const isPlaceholder = card.href === "#";
            const CardComponent = isPlaceholder ? "div" : Link;
            return (
              <CardComponent
                key={card.name}
                href={card.href}
                className={`group block bg-white dark:bg-[#1E293B] rounded-xl p-6 shadow-sm border border-[#E5E7EB] dark:border-[#334155] transition-all duration-200 relative overflow-hidden ${
                  !isPlaceholder 
                    ? "hover:shadow-md hover:-translate-y-0.5 hover:border-[#4F46E5] dark:hover:border-[#6366F1] cursor-pointer" 
                    : ""
                }`}
              >
                {/* Badge top-right */}
                <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded ${card.badgeColor}`}>
                  {card.badge}
                </span>

                {/* Left side minimal icon & Title row */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl leading-none">{card.emoji}</span>
                  <h3 className="text-base font-bold text-[#111827] dark:text-[#F1F5F9] transition-colors group-hover:text-[#4F46E5] dark:group-hover:text-[#6366F1]">
                    {card.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs md:text-[13px] text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                  {card.description}
                </p>
              </CardComponent>
            );
          })}
        </div>

      </div>
    </div>
  );
}
