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
    colorClass: "from-rose-500/10 to-orange-500/10 border-rose-500/20 dark:border-rose-500/30 group-hover:border-rose-500 dark:group-hover:border-rose-400 group-hover:shadow-rose-500/10",
    badgeColor: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400",
    iconBg: "bg-rose-50 dark:bg-rose-950/30 text-rose-550 dark:text-rose-400"
  },
  {
    name: "Chỉnh sửa ảnh",
    emoji: "🖼️",
    href: "/image",
    description: "Nén ảnh, đổi định dạng PNG/JPG/WEBP, xóa nền bằng AI, cắt, resize ngay tại chỗ.",
    badge: "10 công cụ",
    colorClass: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 dark:border-blue-500/30 group-hover:border-blue-500 dark:group-hover:border-blue-400 group-hover:shadow-blue-500/10",
    badgeColor: "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/30 text-blue-550 dark:text-blue-400"
  },
  {
    name: "Tiện ích văn phòng",
    emoji: "📝",
    href: "/text",
    description: "Đếm từ, tạo mã QR, mật khẩu ngẫu nhiên, barcode, format định dạng JSON, tra cứu mã màu sắc.",
    badge: "8 công cụ",
    colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 dark:border-emerald-500/30 group-hover:border-emerald-500 dark:group-hover:border-emerald-400 group-hover:shadow-emerald-500/10",
    badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-550 dark:text-emerald-400"
  },
  {
    name: "Tạo Meme",
    emoji: "😂",
    href: "/meme",
    description: "Chế meme từ 100+ template viral hàng đầu, thêm nhiều chữ, kéo thả kéo dãn, tải ảnh nét về máy.",
    badge: "Thiết kế",
    colorClass: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 dark:border-purple-500/30 group-hover:border-purple-500 dark:group-hover:border-purple-400 group-hover:shadow-purple-500/10",
    badgeColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-550 dark:text-purple-400"
  },
  {
    name: "Bảng âm thanh",
    emoji: "🎵",
    href: "/soundboard",
    description: "50+ âm thanh hiệu ứng meme & nhạc game thịnh hành nhất hiện nay, bấm phát tức thì & tải về máy.",
    badge: "50 âm thanh",
    colorClass: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 dark:border-amber-500/30 group-hover:border-amber-500 dark:group-hover:border-amber-400 group-hover:shadow-amber-500/10",
    badgeColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-550 dark:text-amber-400"
  },
  {
    name: "Tiện ích Việt Nam",
    emoji: "🇻🇳",
    href: "/vietnam",
    description: "Xem Âm Dương lịch, kiểm tra số thẻ CCCD, tạo họ tên giả cho dev và thiết kế hóa đơn bán lẻ nhanh.",
    badge: "5 công cụ",
    colorClass: "from-red-500/10 to-yellow-500/10 border-red-500/20 dark:border-red-500/30 group-hover:border-red-500 dark:group-hover:border-red-400 group-hover:shadow-red-500/10",
    badgeColor: "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-450",
    iconBg: "bg-red-50 dark:bg-red-950/30 text-red-550 dark:text-red-455"
  },
  {
    name: "Tính toán & Tra cứu",
    emoji: "🧮",
    href: "/calc",
    description: "Tính bảng lãi vay ngân hàng, đổi đơn vị đo lường (mẫu/sào), chỉ số BMI, tuổi chính xác.",
    badge: "6 công cụ",
    colorClass: "from-teal-500/10 to-emerald-500/10 border-teal-500/20 dark:border-teal-500/30 group-hover:border-teal-500 dark:group-hover:border-teal-400 group-hover:shadow-teal-500/10",
    badgeColor: "bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400",
    iconBg: "bg-teal-50 dark:bg-teal-950/30 text-teal-550 dark:text-teal-400"
  },
  {
    name: "Thiết kế nhanh",
    emoji: "🎨",
    href: "/design",
    description: "Tạo ảnh mẫu placeholder, thiết kế màu dải CSS Gradient, tạo bóng box-shadow và nén favicon.ico.",
    badge: "5 công cụ",
    colorClass: "from-cyan-500/10 to-sky-500/10 border-cyan-500/20 dark:border-cyan-500/30 group-hover:border-cyan-500 dark:group-hover:border-cyan-400 group-hover:shadow-cyan-500/10",
    badgeColor: "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400",
    iconBg: "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-550 dark:text-cyan-400"
  },
  {
    name: "Bảng tính & Dữ liệu",
    emoji: "📊",
    href: "/data",
    description: "Đổi đuôi file Excel, CSV, JSON qua lại nhanh chóng, xem file Excel online, lọc trùng dòng dữ liệu.",
    badge: "5 công cụ",
    colorClass: "from-indigo-500/10 to-violet-500/10 border-indigo-500/20 dark:border-indigo-500/30 group-hover:border-indigo-500 dark:group-hover:border-indigo-400 group-hover:shadow-indigo-500/10",
    badgeColor: "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400",
    iconBg: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-550 dark:text-indigo-400"
  },
  {
    name: "Xử lý Video & Audio",
    emoji: "🎬",
    href: "/video",
    description: "Cắt video online, tách nhạc MP3 từ clip, nén dung lượng video, đổi định dạng file âm thanh.",
    badge: "4 công cụ",
    colorClass: "from-pink-500/10 to-rose-500/10 border-pink-500/20 dark:border-pink-500/30 group-hover:border-pink-500 dark:group-hover:border-pink-400 group-hover:shadow-pink-500/10",
    badgeColor: "bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400",
    iconBg: "bg-pink-50 dark:bg-pink-950/30 text-pink-550 dark:text-pink-400"
  },
  {
    name: "Ý tưởng đóng góp",
    emoji: "💡",
    href: "#",
    description: "Bạn cần thêm công cụ văn phòng nào? Gửi ý kiến cho chúng tôi để cùng phát triển miễn phí.",
    badge: "Ý kiến",
    colorClass: "from-slate-500/10 to-gray-500/10 border-slate-500/20 dark:border-slate-500/30 group-hover:border-slate-500 dark:group-hover:border-slate-400 group-hover:shadow-slate-500/10",
    badgeColor: "bg-slate-100 dark:bg-slate-950/60 text-slate-700 dark:text-slate-400",
    iconBg: "bg-slate-50 dark:bg-slate-950/30 text-slate-550 dark:text-slate-400"
  },
  {
    name: "Sắp ra mắt",
    emoji: "🚀",
    href: "#",
    description: "Nhiều tiện ích chuyển đổi tài liệu, biểu đồ tự động và công cụ văn phòng thông minh đang hoàn thiện.",
    badge: "Đang làm",
    colorClass: "from-zinc-500/10 to-neutral-500/10 border-zinc-500/20 dark:border-zinc-500/30 group-hover:border-zinc-500 dark:group-hover:border-zinc-400 group-hover:shadow-zinc-500/10",
    badgeColor: "bg-zinc-100 dark:bg-zinc-950/60 text-zinc-700 dark:text-zinc-400",
    iconBg: "bg-zinc-50 dark:bg-zinc-950/30 text-zinc-550 dark:text-zinc-400"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-16 px-4 flex flex-col justify-center items-center">
      <div className="container mx-auto max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            ZavClip — <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">Công cụ văn phòng miễn phí</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-655 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Xử lý PDF, ảnh, tính toán ngay trên trình duyệt. Không cần cài đặt. File không rời khỏi máy bạn.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 border border-emerald-500/10 shadow-sm">
              ✓ Miễn phí
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/30 text-xs font-extrabold text-teal-700 dark:text-teal-400 border border-teal-500/10 shadow-sm">
              ✓ Không cài đặt
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/30 text-xs font-extrabold text-cyan-700 dark:text-cyan-400 border border-cyan-500/10 shadow-sm">
              ✓ File không upload
            </span>
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/30 text-xs font-extrabold text-indigo-700 dark:text-indigo-400 border border-indigo-500/10 shadow-sm">
              ✓ Offline được
            </span>
          </div>
        </div>

        {/* Grid Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {HUB_CARDS.map((card) => {
            const isPlaceholder = card.href === "#";
            const CardComponent = isPlaceholder ? "div" : Link;
            return (
              <CardComponent
                key={card.name}
                href={card.href}
                className={`group block bg-gradient-to-br ${card.colorClass} bg-white dark:bg-gray-800/80 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform ${!isPlaceholder ? "hover:-translate-y-1.5 cursor-pointer" : ""} border relative overflow-hidden`}
              >
                {/* Badge */}
                <span className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full border border-current/5 ${card.badgeColor}`}>
                  {card.badge}
                </span>

                {/* Large Icon */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-inner transition-transform ${!isPlaceholder ? "group-hover:scale-110" : ""} ${card.iconBg}`}>
                  {card.emoji}
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">
                  {card.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
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
