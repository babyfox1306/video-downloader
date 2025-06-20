import os
import logging
import re
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
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

# Function to clean Pinterest URL
def clean_pinterest_url(url):
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

        if is_pinterest_url(video_url):
            video_url = clean_pinterest_url(video_url)
            logging.info(f"Scraping Pinterest URL: {video_url}")

            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
            }
            
            # 1. Giả làm trình duyệt để lấy HTML
            page_response = requests.get(video_url, headers=headers)
            page_response.raise_for_status() # Báo lỗi nếu không lấy được trang
            
            # 2. Dùng BeautifulSoup để phân tích
            soup = BeautifulSoup(page_response.text, 'html.parser')
            
            # 3. Tìm script chứa dữ liệu
            data_script = soup.find("script", {"id": "__PWS_INITIAL_STATE__", "type": "application/json"})
            if not data_script:
                raise Exception("Could not find data script in Pinterest page.")
                
            json_data = json.loads(data_script.string)

            # Lấy link video chất lượng cao nhất
            video_list = json_data['resourceResponses'][0]['response']['data']['videos']['video_list']
            best_video = video_list.get('V_EXP7', video_list.get('V_720P', video_list.get('V_HLSV4', {})))
            media_url = best_video.get('url')

            if not media_url:
                raise Exception("Could not extract video URL from JSON data.")

            # Lấy tiêu đề để làm tên file
            title = json_data['resourceResponses'][0]['response']['data'].get('title', 'pinterest_video')
            file_name = clean_filename(title) + ".mp4"
            
            logging.info(f"Successfully extracted video URL: {media_url}")
            return jsonify({
                "success": True,
                "file_url": media_url,
                "file_name": file_name
            })

        else:
            # Giữ lại yt-dlp cho các nền tảng khác
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
        logging.error(f"Failed to fetch Pinterest page: {e}")
        return jsonify({"error": "Could not access the Pinterest page. It might be private or deleted.", "details": str(e), "success": False}), 404
    except Exception as e:
        logging.error(f"An expert-level error occurred: {e}")
        return jsonify({"error": "A sophisticated error occurred. Please tell the expert.", "details": str(e), "success": False}), 500

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
