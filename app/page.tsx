import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZavClip - Công cụ văn phòng online Miễn phí & Bảo mật",
  description: "ZavClip: Bộ công cụ văn phòng online chạy trực tiếp trên máy của bạn. Nén PDF, gộp PDF, chỉnh sửa ảnh, đếm từ, tạo mã QR, chế meme, và soundboard hoàn toàn miễn phí và bảo mật tuyệt đối.",
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
    name: "Tiện ích",
    emoji: "📝",
    href: "/text",
    description: "Đếm từ, tạo mã QR, mật khẩu ngẫu nhiên, barcode, format định dạng JSON, tra cứu mã màu sắc.",
    badge: "8 công cụ",
    colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 dark:border-emerald-500/30 group-hover:border-emerald-500 dark:group-hover:border-emerald-400 group-hover:shadow-emerald-500/10",
    badgeColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-550 dark:text-emerald-400"
  },
  {
    name: "Meme Generator",
    emoji: "😂",
    href: "/meme",
    description: "Chế meme từ 100+ template viral hàng đầu, thêm nhiều chữ, kéo thả kéo dãn, tải ảnh nét về máy.",
    badge: "Mới",
    colorClass: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 dark:border-purple-500/30 group-hover:border-purple-500 dark:group-hover:border-purple-400 group-hover:shadow-purple-500/10",
    badgeColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400",
    iconBg: "bg-purple-50 dark:bg-purple-950/30 text-purple-550 dark:text-purple-400"
  },
  {
    name: "Soundboard",
    emoji: "🎵",
    href: "/soundboard",
    description: "50+ âm thanh hiệu ứng meme & nhạc game thịnh hành nhất hiện nay, bấm phát tức thì & tải về máy.",
    badge: "50 âm thanh",
    colorClass: "from-amber-500/10 to-yellow-500/10 border-amber-500/20 dark:border-amber-500/30 group-hover:border-amber-500 dark:group-hover:border-amber-400 group-hover:shadow-amber-500/10",
    badgeColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400",
    iconBg: "bg-amber-50 dark:bg-amber-950/30 text-amber-550 dark:text-amber-400"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-16 px-4 flex flex-col justify-center items-center">
      <div className="container mx-auto max-w-5xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white dark:bg-gray-800 text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-750 shadow-sm">
            🔒 Bảo mật tuyệt đối · Chạy trực tiếp trên trình duyệt · Không cần đăng ký
          </span>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Công cụ văn phòng online <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Miễn phí & Bảo mật
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Xử lý file PDF, tối ưu hóa ảnh và các tiện ích văn phòng trực tiếp ngay trên máy của bạn.
            <strong className="text-gray-850 dark:text-gray-250 font-bold block mt-1">Ảnh và tài liệu không bao giờ bị upload lên mạng!</strong>
          </p>
        </div>

        {/* Grid Hubs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {HUB_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group block bg-gradient-to-br ${card.colorClass} bg-white dark:bg-gray-800/80 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 border relative overflow-hidden`}
            >
              {/* Badge */}
              <span className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full border border-current/5 ${card.badgeColor}`}>
                {card.badge}
              </span>

              {/* Large Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-inner transition-transform group-hover:scale-110 ${card.iconBg}`}>
                {card.emoji}
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white transition-colors">
                {card.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed">
                {card.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Trust Bar Footer */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-150 dark:border-gray-755 rounded-3xl p-6 shadow-sm max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <span className="text-xl">🚀</span>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Không cần cài đặt</p>
              <p className="text-[10px] text-gray-400">Chạy ngay trên Web</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl">🎁</span>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Hoàn toàn miễn phí</p>
              <p className="text-[10px] text-gray-400">Không giới hạn tính năng</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl">🛡️</span>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">File không upload</p>
              <p className="text-[10px] text-gray-400">Bảo mật dữ liệu tuyệt đối</p>
            </div>
            <div className="space-y-1">
              <span className="text-xl">🔌</span>
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">Hoạt động ngoại tuyến</p>
              <p className="text-[10px] text-gray-400">Xử lý ngay cả khi không có mạng</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
