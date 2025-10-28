# ZavClip - Tool Hub

[![Netlify Status](https://api.netlify.com/api/v1/badges/24fe35b9-a8d3-4ede-b18a-fd67b70830ac/deploy-status)](https://app.netlify.com/sites/zavclip/deploys)

Website công cụ miễn phí trực tuyến với nhiều tiện ích hữu ích.

## 🚀 Tính năng

- **Chuyển đổi PDF**: Chuyển Word, JPG sang PDF
- **Tạo QR Code**: Tạo mã QR nhanh cho URL, text, wifi
- **Tải TikTok**: Tải video TikTok không logo, chất lượng HD
- **YouTube to MP3**: Chuyển đổi video YouTube sang MP3
- **Nén ảnh**: Giảm dung lượng ảnh online
- **Tải video**: Tải video từ nhiều nền tảng

## 📁 Cấu trúc dự án

```
my-website/
├── index.html              # Trang chủ
├── tools.html              # Danh sách công cụ
├── about.html              # Về chúng tôi
├── contact.html            # Liên hệ
├── netlify.toml            # Cấu hình Netlify
├── sitemap.xml             # Sitemap cho SEO
├── robots.txt              # Robots.txt
└── tools/
    ├── pdf-converter.html
    ├── qr-generator.html
    ├── tiktok-downloader.html
    ├── youtube-mp3.html
    ├── image-compressor.html
    └── video-downloader.html
```

## 🛠 Tech Stack

### Frontend
- **HTML/CSS/JS**: Vanilla JavaScript
- **Styling**: Tailwind CSS (CDN), Font Awesome
- **Libraries**:
  - QRCode.js - Tạo QR code
  - browser-image-compression - Nén ảnh
  - jsPDF - Chuyển đổi PDF
- **Hosting**: Netlify (FREE)

### Backend (Optional)
- **Framework**: Flask + Gunicorn
- **Video Engine**: Playwright + yt-dlp
- **Features**: m3u8 conversion, multi-platform support
- **Hosting**: Render.com / Railway.app (~$10-15/month)

## 🚀 Deployment

### Frontend (Netlify - FREE)

1. Push code lên GitHub
2. Truy cập [Netlify](https://netlify.com)
3. New site from Git → Chọn repo
4. Build command: `echo "No build needed"`
5. Publish directory: `.`
6. Deploy!

**Docs**: `DEPLOY.md`

### Backend (Render/Railway - Optional)

**Khi nào cần backend?**
- Cần download video Instagram, Pinterest, Facebook, Twitter
- Cần advanced features (m3u8 conversion, etc.)

**Setup**:
1. Deploy `backend-app.py` lên Render.com
2. Update frontend tools với API URL
3. Done!

**Docs**: `DEPLOY-BACKEND.md`

**Cost**: $10-15/month cho backend

## 💰 Monetization

Website có thể kiếm tiền qua:
1. **Google AdSense** - Banner quảng cáo
2. **Link CPM** - Shortlink redirect (Short.io, Linkvertise)
3. **Affiliate** - Giới thiệu công cụ Pro (Canva, Suno, etc.)

## 📝 Thêm tool mới

1. Tạo file HTML mới trong folder `tools/`
2. Copy template từ tool có sẵn
3. Thêm link trong `index.html` và `tools.html`
4. Cập nhật `sitemap.xml`
5. Push code lên GitHub (auto deploy)

## 🔗 Liên kết

- Website: https://zavclip.netlify.app
- Live Demo: https://zavclip.netlify.app/tools/qr-generator.html
- GitHub: https://github.com/babyfox1306/video-downloader

## 📄 License

MIT License - Miễn phí sử dụng cho mọi mục đích

