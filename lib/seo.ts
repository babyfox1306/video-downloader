import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://zavclip.com";

export const DEFAULT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZavClip - Công cụ văn phòng online miễn phí",
    template: "%s | ZavClip",
  },
  description:
    "Bộ công cụ PDF, ảnh, video, tính toán, tiện ích Việt Nam. Miễn phí, không cần cài đặt, file không rời khỏi máy bạn.",
  keywords: [
    "zavclip",
    "công cụ online",
    "pdf",
    "nén ảnh",
    "tiktok downloader",
    "meme",
    "tiện ích việt nam",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "ZavClip",
    title: "ZavClip - Công cụ văn phòng online miễn phí",
    description:
      "Bộ công cụ PDF, ảnh, video, tính toán, tiện ích Việt Nam. Miễn phí, chạy trên trình duyệt.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZavClip - Công cụ văn phòng online miễn phí",
    description:
      "Bộ công cụ PDF, ảnh, video, tính toán, tiện ích Việt Nam. Miễn phí, chạy trên trình duyệt.",
  },
  robots: { index: true, follow: true },
};

export type PageSeo = {
  title: string;
  description: string;
  /** 0–1, default 0.7 tools / 0.9 hubs / 1 home */
  priority?: number;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
};

/** All public app routes (excludes /api/*) */
export const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    title: "ZavClip - Công cụ văn phòng online miễn phí",
    description:
      "Bộ công cụ PDF, ảnh, tính toán, tiện ích Việt Nam - miễn phí, không cần cài đặt, file không rời máy bạn.",
    priority: 1,
    changeFrequency: "weekly",
  },
  "/downloader": {
    title: "Tải video TikTok, Instagram Reels, YouTube",
    description:
      "Tải video TikTok không logo, Instagram Reels và YouTube. Chuyển MP3 trên trình duyệt, miễn phí.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/meme": {
    title: "Tạo meme viral online",
    description:
      "Chế meme từ 100+ template viral, thêm chữ, tải ảnh nét về máy. Miễn phí, không cần đăng ký.",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/soundboard": {
    title: "Soundboard meme & game",
    description:
      "50+ âm thanh hiệu ứng meme và nhạc game thịnh hành. Bấm phát tức thì, tải về máy.",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/face-swap": {
    title: "Face Swap video (sắp ra mắt)",
    description:
      "Hoán đổi khuôn mặt trong video — tính năng đang phát triển trên ZavClip.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/tts": {
    title: "TTS Clip Maker (sắp ra mắt)",
    description:
      "Tạo clip viral với text-to-speech — tính năng đang phát triển trên ZavClip.",
    priority: 0.5,
    changeFrequency: "monthly",
  },
  // PDF hub
  "/pdf": {
    title: "Công cụ PDF online",
    description:
      "Nén, gộp, tách, xoay PDF, chuyển Word sang PDF, PDF sang ảnh — miễn phí trên trình duyệt.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/pdf/compress": {
    title: "Nén file PDF",
    description: "Giảm kích thước file PDF để dễ gửi qua Email, Zalo mà không làm mờ chữ.",
  },
  "/pdf/merge": {
    title: "Gộp nhiều PDF thành một",
    description: "Ghép nhiều file PDF riêng lẻ thành một file duy nhất, tự do sắp xếp thứ tự.",
  },
  "/pdf/split": {
    title: "Tách trang PDF",
    description: "Chia nhỏ file PDF dài thành từng trang riêng biệt hoặc trích xuất các trang.",
  },
  "/pdf/rotate": {
    title: "Xoay trang PDF",
    description: "Xoay thẳng lại các trang tài liệu bị scan ngược 90°, 180° nhanh chóng.",
  },
  "/pdf/remove-pages": {
    title: "Xóa trang trong PDF",
    description: "Xem trước và loại bỏ nhanh những trang lỗi, trang trống hoặc nội dung thừa.",
  },
  "/pdf/pdf-to-jpg": {
    title: "PDF ra ảnh JPG",
    description: "Tách các trang PDF rồi lưu thành từng tệp ảnh JPG để dễ xem trên điện thoại.",
  },
  "/pdf/pdf-to-png": {
    title: "PDF ra ảnh PNG",
    description: "Đổi định dạng các trang PDF thành hình ảnh PNG sắc nét.",
  },
  "/pdf/jpg-to-pdf": {
    title: "Ảnh thành file PDF",
    description: "Gộp nhiều tệp ảnh JPG, PNG chụp tài liệu lại thành một file PDF hoàn chỉnh.",
  },
  "/pdf/word-to-pdf": {
    title: "Word sang PDF",
    description: "Chuyển đổi file tài liệu Word (.docx) sang định dạng PDF tiện lợi.",
  },
  "/pdf/pdf-to-txt": {
    title: "Lấy chữ từ PDF",
    description: "Đọc và trích xuất toàn bộ văn bản trong file PDF rồi lưu thành file txt.",
  },
  // Image hub
  "/image": {
    title: "Chỉnh sửa ảnh online",
    description:
      "Nén ảnh, đổi định dạng, xóa nền AI, cắt, resize, watermark — chạy cục bộ trên trình duyệt.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/image/compress": {
    title: "Nén ảnh JPG, PNG, WEBP",
    description: "Giảm dung lượng hình ảnh mà vẫn giữ độ nét, hỗ trợ nén hàng loạt.",
  },
  "/image/convert": {
    title: "Đổi định dạng ảnh",
    description: "Chuyển đổi qua lại giữa PNG, JPG, WEBP, BMP, GIF, ICO cực nhanh.",
  },
  "/image/resize": {
    title: "Đổi kích thước ảnh",
    description: "Thay đổi kích thước theo pixel hoặc khung mẫu CCCD, Facebook, Zalo.",
  },
  "/image/remove-bg": {
    title: "Xóa nền ảnh bằng AI",
    description: "Tách người hoặc vật thể, tạo phông nền trong suốt tự động bằng AI cục bộ.",
  },
  "/image/watermark": {
    title: "Đóng watermark ảnh",
    description: "Chèn logo hoặc chữ bản quyền lên ảnh để bảo vệ hình ảnh cá nhân.",
  },
  "/image/crop": {
    title: "Cắt ảnh online",
    description: "Cắt bớt phần thừa tự do hoặc theo tỉ lệ 1:1, 16:9, 4:3.",
  },
  "/image/rotate-flip": {
    title: "Xoay và lật ảnh",
    description: "Xoay 90/180/270 độ hoặc lật ngược ảnh theo chiều ngang, dọc.",
  },
  "/image/heic-to-jpg": {
    title: "HEIC sang JPG",
    description: "Đổi ảnh HEIC từ iPhone sang JPG để xem trên mọi máy tính.",
  },
  "/image/svg-to-png": {
    title: "SVG sang PNG",
    description: "Chuyển file đồ họa vector SVG thành hình ảnh PNG sắc nét.",
  },
  "/image/add-border": {
    title: "Thêm viền ảnh",
    description: "Thêm khung viền màu xung quanh ảnh với độ dày tùy chỉnh.",
  },
  // Text hub
  "/text": {
    title: "Tiện ích văn phòng & văn bản",
    description:
      "Đếm từ, QR, mật khẩu, barcode, JSON, Base64, so sánh văn bản — miễn phí offline.",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/text/number-to-words": {
    title: "Số → Chữ tiếng Việt",
    description: "Đọc số tiền, số đếm lớn thành văn bản chữ tiếng Việt chuẩn xác.",
  },
  "/text/case-convert": {
    title: "Chuyển kiểu chữ",
    description: "Chuyển nhanh sang viết hoa, thường, hoa đầu từ, hoa đầu câu.",
  },
  "/text/text-diff": {
    title: "So sánh 2 văn bản",
    description: "Highlight phần thêm, xóa giữa hai tài liệu văn bản.",
  },
  "/text/clean-text": {
    title: "Dọn dẹp văn bản",
    description: "Xóa khoảng trắng thừa, dòng trống, chuẩn hóa dấu câu.",
  },
  "/text/keyword-count": {
    title: "Phân tích từ khóa",
    description: "Đếm tần suất và mật độ phần trăm từ khóa trong văn bản.",
  },
  "/text/word-count": {
    title: "Đếm từ & ký tự",
    description: "Đếm số từ, chữ, dòng và thời gian đọc ước lượng.",
  },
  "/text/qr-generator": {
    title: "Tạo mã QR",
    description: "Tạo QR từ link, WiFi, email, số điện thoại, tin nhắn.",
  },
  "/text/barcode-generator": {
    title: "Tạo mã vạch",
    description: "Tạo mã vạch chuẩn cho hàng hóa và nhãn sản phẩm.",
  },
  "/text/base64": {
    title: "Mã hóa Base64",
    description: "Chuyển chữ hoặc ảnh sang Base64 và ngược lại trên trình duyệt.",
  },
  "/text/json-formatter": {
    title: "Định dạng JSON",
    description: "Làm đẹp, căn lề và kiểm tra lỗi cú pháp JSON.",
  },
  "/text/password-generator": {
    title: "Tạo mật khẩu mạnh",
    description: "Tạo mật khẩu ngẫu nhiên an toàn, chống hack tài khoản.",
  },
  "/text/lorem-ipsum": {
    title: "Tạo văn bản giả Lorem",
    description: "Tạo đoạn chữ mẫu dài ngắn tùy ý cho thiết kế.",
  },
  "/text/color-picker": {
    title: "Bảng màu & mã HEX",
    description: "Chọn màu, xem mã HEX, RGB và lưu tông màu phối hợp.",
  },
  // Calc hub
  "/calc": {
    title: "Tính toán & tra cứu",
    description: "Lãi vay ngân hàng, BMI, đổi đơn vị sào mẫu, tuổi, chênh ngày.",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/calc/loan": {
    title: "Tính lãi vay ngân hàng",
    description: "Lịch trả nợ chi tiết theo dư nợ giảm dần hoặc gốc đều.",
  },
  "/calc/bmi": {
    title: "Tính chỉ số BMI",
    description: "Kiểm tra BMI theo tiêu chuẩn WHO cho người châu Á.",
  },
  "/calc/unit-convert": {
    title: "Đổi đơn vị đo lường",
    description: "Đổi độ dài, khối lượng, diện tích, tiền tệ, sào, mẫu Việt Nam.",
  },
  "/calc/age": {
    title: "Tính tuổi chính xác",
    description: "Xem đã sống bao nhiêu ngày, giờ và đếm ngược sinh nhật.",
  },
  "/calc/date-diff": {
    title: "Tính chênh lệch ngày",
    description: "Tính số ngày, tuần, tháng giữa hai mốc thời gian.",
  },
  // Vietnam hub
  "/vietnam": {
    title: "Tiện ích Việt Nam",
    description: "Âm lịch, CCCD, mock data, đọc QR, hóa đơn bán lẻ — offline.",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/vietnam/lunar-calendar": {
    title: "Âm Dương lịch Việt Nam",
    description: "Tra cứu âm lịch, Can Chi, hoàng đạo — tính toán offline trên máy bạn.",
  },
  "/vietnam/cccd-check": {
    title: "Kiểm tra số CCCD",
    description: "Giải mã tỉnh thành, giới tính, năm sinh từ số căn cước 12 số.",
  },
  "/vietnam/fake-name": {
    title: "Tạo dữ liệu giả Việt Nam",
    description: "Mock data họ tên, email, SĐT, địa chỉ VN cho kiểm thử phần mềm.",
  },
  "/vietnam/qr-reader": {
    title: "Đọc mã QR từ ảnh",
    description: "Tải ảnh chứa QR lên để đọc nội dung văn bản ẩn.",
  },
  "/vietnam/invoice": {
    title: "Tạo hóa đơn bán hàng",
    description: "Hóa đơn biên lai chuyên nghiệp, đổi số thành chữ, in ấn tiện lợi.",
  },
  // Design hub
  "/design": {
    title: "Thiết kế nhanh online",
    description: "Placeholder, gradient CSS, box-shadow, favicon, resize social.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  "/design/placeholder-image": {
    title: "Tạo ảnh placeholder",
    description: "Tạo ảnh mẫu với kích thước, màu nền và chữ tùy ý cho layout.",
  },
  "/design/gradient": {
    title: "Tạo CSS Gradient",
    description: "Thiết kế dải màu gradient và xuất mã CSS dùng ngay.",
  },
  "/design/shadow": {
    title: "Tạo CSS box-shadow",
    description: "Điều chỉnh đổ bóng và sao chép mã CSS shadow.",
  },
  "/design/favicon": {
    title: "Tạo favicon.ico",
    description: "Nén ảnh vuông thành favicon đa kích thước cho website.",
  },
  "/design/social-resize": {
    title: "Resize ảnh mạng xã hội",
    description: "Cắt ảnh chuẩn Facebook, Zalo, TikTok, ảnh thẻ CCCD.",
  },
  // Data hub
  "/data": {
    title: "Bảng tính & chuyển đổi dữ liệu",
    description: "CSV, Excel, JSON chuyển đổi, xem Excel, lọc trùng dòng.",
    priority: 0.8,
    changeFrequency: "weekly",
  },
  "/data/csv-to-excel": {
    title: "CSV sang Excel",
    description: "Chuyển file CSV thành Excel (.xlsx) tải về.",
  },
  "/data/excel-to-csv": {
    title: "Excel sang CSV",
    description: "Trích xuất dữ liệu Excel thành tệp CSV gọn nhẹ.",
  },
  "/data/json-to-csv": {
    title: "JSON ↔ CSV",
    description: "Chuyển đổi hai chiều giữa JSON và CSV/Excel.",
  },
  "/data/view-excel": {
    title: "Xem file Excel online",
    description: "Mở file Excel xem dạng bảng, chuyển sheet không cần Office.",
  },
  "/data/remove-duplicates": {
    title: "Lọc dòng trùng CSV/Excel",
    description: "Lọc bản ghi trùng lặp và xuất tệp sạch về máy.",
  },
  // Video hub
  "/video": {
    title: "Xử lý video & audio online",
    description: "Cắt video, tách nhạc MP3, nén video, đổi định dạng audio — FFmpeg trên browser.",
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/video/trim": {
    title: "Cắt video online",
    description: "Cắt đoạn video mong muốn hoàn toàn trên trình duyệt.",
  },
  "/video/extract-audio": {
    title: "Tách nhạc từ video",
    description: "Trích xuất MP3, WAV từ clip video offline.",
  },
  "/video/compress": {
    title: "Nén video online",
    description: "Nén file video lớn để gửi Zalo, Messenger, email.",
  },
  "/video/convert-audio": {
    title: "Đổi định dạng audio",
    description: "Chuyển MP3, WAV, AAC, M4A, OGG cục bộ.",
  },
  // Other (legacy hub)
  "/other": {
    title: "Công cụ khác",
    description: "QR, nén ảnh hàng loạt, xóa nền AI — bộ công cụ bổ sung.",
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/other/qrcode": {
    title: "Tạo mã QR (phiên bản khác)",
    description: "Tạo QR từ link hoặc chữ, đổi màu và tải ảnh về.",
  },
  "/other/image-compressor": {
    title: "Nén ảnh hàng loạt",
    description: "Nén nhiều ảnh JPG/PNG cùng lúc, giữ chất lượng rõ nét.",
  },
  "/other/background-remover": {
    title: "Xóa nền ảnh AI",
    description: "Tách chủ thể khỏi ảnh bằng AI chạy trên trình duyệt.",
  },
};

export const SITEMAP_PATHS = Object.keys(PAGE_SEO);

export function getPageMetadata(path: string): Metadata {
  const seo = PAGE_SEO[path];
  if (!seo) {
    return {
      title: "ZavClip",
      description: DEFAULT_METADATA.description as string,
    };
  }

  const isHome = path === "/";
  const title = isHome ? seo.title : seo.title;

  return {
    title,
    description: seo.description,
    alternates: { canonical: path === "/" ? SITE_URL : `${SITE_URL}${path}` },
    openGraph: {
      title: isHome ? seo.title : `${seo.title} | ZavClip`,
      description: seo.description,
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    },
    twitter: {
      title: isHome ? seo.title : `${seo.title} | ZavClip`,
      description: seo.description,
    },
  };
}
