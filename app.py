import os
import logging
import re
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp
import requests

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

# Function to clean Pinterest URL
def clean_pinterest_url(url):
    # Find the canonical pin URL and remove tracking/invite parameters
    match = re.search(r'(https://(www\.)?pinterest\.com/pin/\d+/)', url)
    if match:
        cleaned_url = match.group(1)
        logging.info(f"Cleaned Pinterest URL from {url} to {cleaned_url}")
        return cleaned_url
    return url

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

        # SỬ DỤNG API TRUNG GIAN CHO PINTEREST
        if is_pinterest_url(video_url):
            logging.info(f"Using third-party API for Pinterest URL: {video_url}")
            
            # Gọi API từ RapidAPI
            api_url = "https://pinterest-downloader.p.rapidapi.com/download"
            querystring = {"url": video_url}
            headers = {
                "x-rapidapi-key": os.environ.get("RAPIDAPI_KEY"), # Lấy key từ biến môi trường
                "x-rapidapi-host": "pinterest-downloader.p.rapidapi.com"
            }

            # Kiểm tra xem có API Key không
            if not headers["x-rapidapi-key"]:
                logging.error("RAPIDAPI_KEY is not set in environment variables.")
                return jsonify({"error": "Server configuration error: Missing API Key"}), 500

            response = requests.get(api_url, headers=headers, params=querystring)
            response.raise_for_status() # Ném lỗi nếu request thất bại (4xx, 5xx)
            
            api_data = response.json()
            logging.info(f"Third-party API response: {api_data}")

            # Lấy link video từ kết quả API
            media_url = api_data.get("data", {}).get("video_url")

            if media_url:
                # Trả về link trực tiếp cho frontend
                return jsonify({
                    "success": True,
                    "file_url": media_url,
                    "file_name": "pinterest_video.mp4" # Đặt tên file mặc định
                })
            else:
                raise Exception("Could not find video URL in third-party API response")

        # Giữ lại yt-dlp cho các nền tảng khác
        else:
            logging.info(f"Using yt-dlp for URL: {video_url}")
            ydl_opts = {
                'format': 'bestvideo+bestaudio/best',
                'outtmpl': f"{DOWNLOAD_DIR}/%(title)s.%(ext)s",
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=True)
                file_name = ydl.prepare_filename(info)
                file_name = os.path.basename(file_name.strip())
                file_name = clean_filename(file_name)
                
                return jsonify({
                    "file_name": file_name, 
                    "file_url": f"/api/download/{file_name}",
                    "success": True
                }), 200

    except requests.exceptions.HTTPError as e:
        logging.error(f"Third-party API request failed: {e}")
        return jsonify({"error": "Failed to fetch from third-party API", "details": str(e), "success": False}), 502
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": "Server error", "details": str(e), "success": False}), 500

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
