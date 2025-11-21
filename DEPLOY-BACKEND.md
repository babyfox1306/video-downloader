# 🚀 Deploy Backend Video Downloader

Backend API từ [video-downloader repo](https://github.com/babyfox1306/video-downloader) đã được tích hợp vào ZavClip.

## 📦 Backend Files

- `backend-app.py` - Flask API server
- `requirements.txt` - Python dependencies
- `gunicorn.conf.py` - Gunicorn config
- `build.sh` - Build script

## 🏗️ Architecture

```
ZavClip Tool Hub:
├── Frontend (Netlify):
│   ├── index.html
│   ├── tools.html
│   ├── tools/*.html
│   └── Static assets (CSS, JS, images)
│
└── Backend API (Render/Railway):
    ├── backend-app.py
    ├── requirements.txt
    ├── gunicorn.conf.py
    └── build.sh
```

## 🚀 Deployment Options

### Option 1: Render.com (Recommended)

1. **Create account**: [render.com](https://render.com)
2. **New Web Service** → Connect GitHub
3. **Settings**:
   - Name: `zavclip-backend`
   - Environment: `Python 3`
   - Build command: `./build.sh`
   - Start command: `gunicorn backend-app:app`
   - Add environment variables if needed
4. Deploy!

**Budget**: ~$7-15/month (Render Free tier available)

### Option 2: Railway.app

1. **Create account**: [railway.app](https://railway.app)
2. **New Project** → Connect GitHub
3. **Settings**:
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn backend-app:app`
4. Deploy!

**Budget**: ~$5-10/month

### Option 3: Heroku (Paid)

1. Create Heroku app
2. Push code: `git push heroku main`
3. Add buildpack: `heroku buildpacks:add heroku/python`

**Budget**: ~$7-25/month

## 🔧 Frontend Configuration

Sau khi backend deploy, update frontend để trỏ về API URL:

```javascript
// Update trong tools/tiktok-downloader.html và các tools khác
const API_URL = 'https://your-backend-url.onrender.com';
// hoặc
const API_URL = 'https://your-backend-url.railway.app';
```

## 📊 Backend Features

### Supported Platforms:
- ✅ Pinterest (Playwright)
- ✅ Instagram (Playwright)
- ✅ Facebook (Playwright)
- ✅ Twitter/X (Playwright + yt-dlp fallback)
- ✅ YouTube (yt-dlp)
- ✅ TikTok (yt-dlp)
- ✅ Vimeo (yt-dlp)
- ✅ Reddit (yt-dlp)

### API Endpoints:

```bash
POST /api/video
Body: {"url": "https://..."}

Response: File download hoặc JSON với file_url
```

```bash
POST /api/fast-video
Body: {"url": "https://..."}

Response: {"file_url": "...", "fast_mode": true}
```

### Features:
- ⚡ Fast mode (no conversion)
- 🔄 m3u8 to MP4 conversion (with ffmpeg)
- 📱 Short URL resolution
- 🛡️ CORS enabled
- ⚡ Optimized with Playwright caching

## 🔌 Tích hợp vào Tools

Example: `tools/tiktok-downloader.html`

```javascript
async function downloadTikTok() {
    const url = document.getElementById('tiktokUrl').value;
    const resultDiv = document.getElementById('result');
    
    // Gọi API backend
    const response = await fetch('https://your-backend.onrender.com/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
    });
    
    if (response.ok) {
        // Handle download
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'video.mp4';
        a.click();
    }
}
```

## 💰 Cost Estimate

**Monthly costs**:
- Frontend (Netlify): **FREE** ✅
- Backend (Render/Railway): **$7-15**
- Domain: **$10-15/year**

**Total**: ~**$10-20/month**

## 🎯 Next Steps

1. Deploy backend lên Render/Railway
2. Update frontend tools với API URL
3. Test tất cả platforms
4. Deploy frontend lên Netlify
5. Add Google Analytics & AdSense
6. **START EARNING! 🚀**

## 📝 Notes

- Backend cần ffmpeg cho m3u8 conversion
- Playwright browsers auto-install via build.sh
- CORS đã enable cho tất cả origins
- Auto timeout cho long-running requests
- Health check endpoint: `/healthz`

## 🔗 Links

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Netlify Docs](https://docs.netlify.com)

