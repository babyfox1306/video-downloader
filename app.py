import os
import logging
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create Flask app
app = Flask(__name__)
# Cho phép tất cả origins để test
CORS(app, resources={r"/api/*": {"origins": ["*"]}})

# Create download directory if it doesn't exist
DOWNLOAD_DIR = 'downloads'
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

@app.route('/')
def home():
    return "Welcome to the Video Downloader API!"

@app.route('/ads.txt')
def ads_txt():
    try:
        file_path = os.path.join(os.getcwd(), 'ads.txt')
        if not os.path.exists(file_path):
            return "ads.txt file not found", 404
        return send_from_directory(os.getcwd(), 'ads.txt')
    except Exception as e:
        return f"Error serving ads.txt: {str(e)}", 500

# Function detect Pinterest
def is_pinterest_url(url):
    return 'pinterest.com' in url.lower()

# Function to clean filename
def clean_filename(filename):
    # Remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    # Limit length
    if len(filename) > 100:
        filename = filename[:100]
    return filename

@app.route("/api/video", methods=["POST", "OPTIONS"])
def download_video():
    # Handle CORS preflight
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.json
        video_url = data.get("url")

        if not video_url:
            return jsonify({"error": "No URL provided"}), 400

        logging.info(f"Processing URL: {video_url}")

        # Pinterest-specific configuration - ĐƠN GIẢN HÓA
        if is_pinterest_url(video_url):
            logging.info("Detected Pinterest URL")
            ydl_opts = {
                'format': 'best[ext=mp4]/best[ext=webm]/best',
                'outtmpl': f"{DOWNLOAD_DIR}/%(title)s.%(ext)s",
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'no_warnings': True,
                'quiet': True,
                'no_check_certificate': True,
                'ignoreerrors': False,
                'nocheckcertificate': True,
                'prefer_ffmpeg': True,
                'geo_bypass': True,
                'geo_bypass_country': 'US',
                'http_headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-us,en;q=0.5',
                    'Accept-Encoding': 'gzip,deflate',
                    'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.7',
                    'Connection': 'keep-alive',
                }
            }
        else:
            # Default for other platforms
            ydl_opts = {
                'format': 'bestvideo+bestaudio/best',
                'outtmpl': f"{DOWNLOAD_DIR}/%(title)s.%(ext)s",
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }

        # Download video using yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            logging.info("Starting download...")
            info = ydl.extract_info(video_url, download=True)
            file_name = ydl.prepare_filename(info)
            file_name = os.path.basename(file_name.strip())
            file_name = clean_filename(file_name)
            
            logging.info(f"Download completed: {file_name}")

        # Return downloaded file information
        response = jsonify({
            "file_name": file_name, 
            "file_url": f"/api/download/{file_name}",
            "success": True
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 200

    except yt_dlp.utils.DownloadError as e:
        logging.error(f"Download error: {e}")
        response = jsonify({
            "error": "Download failed", 
            "details": str(e),
            "success": False
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 400
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        response = jsonify({
            "error": "Server error", 
            "details": str(e),
            "success": False
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route("/api/download/<filename>", methods=["GET"])
def download_file(filename):
    try:
        file_path = os.path.join(DOWNLOAD_DIR, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404
        return send_from_directory(DOWNLOAD_DIR, filename, as_attachment=True)
    except Exception as e:
        logging.error(f"File not found: {e}")
        return jsonify({"error": str(e)}), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
