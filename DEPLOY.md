# 🚀 Hướng dẫn Deploy ZavClip lên Netlify

## Bước 1: Push code lên GitHub

```bash
# Khởi tạo Git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit: ZavClip Tool Hub"

# Kết nối với GitHub (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/zavclip.git

# Push code
git branch -M main
git push -u origin main
```

## Bước 2: Deploy lên Netlify

### Cách 1: Deploy qua GitHub (Khuyến nghị)

1. Truy cập [https://netlify.com](https://netlify.com)
2. Đăng ký/Đăng nhập với GitHub
3. Click **"New site from Git"**
4. Chọn GitHub và cho phép truy cập
5. Chọn repository `zavclip`
6. Cấu hình Build Settings:
   - **Branch to deploy**: `main`
   - **Build command**: (để trống hoặc `echo "Static site"`)
   - **Publish directory**: `.`
7. Click **"Deploy site"**
8. Chờ 1-2 phút để deploy xong
9. Netlify sẽ tự động generate URL như: `https://random-name-123.netlify.app`

### Cách 2: Deploy bằng CLI

```bash
# Cài đặt Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

## Bước 3: Đổi domain tùy chỉnh

1. Vào **Site settings** → **Domain management**
2. Click **"Options"** → **"Add custom domain"**
3. Nhập domain: `zavclip.com`
4. Làm theo hướng dẫn để setup DNS:
   - Loại A record: `185.199.108.153`
   - Hoặc CNAME: `your-site.netlify.app`

## Bước 4: Tích hợp Google AdSense (Kiếm tiền)

1. Đăng ký Google AdSense tại [https://adsense.google.com](https://adsense.google.com)
2. Thêm meta tag vào `<head>` của tất cả các file HTML:
```html
<meta name="google-adsense-account" content="ca-pub-XXXXX">
```

3. Chèn script vào cuối `<body>`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXX" crossorigin="anonymous"></script>
```

4. Chèn ads vào các trang:
```html
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXX"
     data-ad-slot="XXXXX"
     data-ad-format="auto"></ins>
```

## Bước 5: Tối ưu SEO

Website đã có sẵn:
- ✅ `sitemap.xml` - Google index nhanh
- ✅ `robots.txt` - Cho phép bots
- ✅ Meta tags description
- ✅ Semantic HTML

### Submit lên Google Search Console

1. Truy cập [Google Search Console](https://search.google.com/search-console)
2. Add property: `zavclip.com`
3. Verify ownership (chọn Netlify method)
4. Submit sitemap: `https://zavclip.com/sitemap.xml`

## Bước 6: Kiểm tra

Mở các URL sau để test:
- https://your-domain.netlify.app/
- https://your-domain.netlify.app/tools.html
- https://your-domain.netlify.app/tools/qr-generator.html
- https://your-domain.netlify.app/tools/image-compressor.html

## 📊 Metrics & Analytics

Thêm Google Analytics:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXX');
</script>
```

## 🐛 Troubleshooting

### Lỗi: 404 Not Found
→ Kiểm tra đường dẫn trong HTML (phải dùng `/` không phải `../`)

### Lỗi: CORS policy
→ Netlify đã handle qua `netlify.toml`

### Lỗi: Tool không hoạt động
→ Mở DevTools (F12) kiểm tra console errors

## 🎉 Done!

Website đã sẵn sàng và có thể kiếm tiền qua ads! 🚀

