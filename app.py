import os
import subprocess
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Kiểm tra và tạo thư mục nếu chưa tồn tại
if not os.path.exists('downloads'):
    os.makedirs('downloads')

@app.route('/')
def home():
    return "Welcome to the Flask API!"

@app.route("/api/video", methods=["POST"])
def download_video():
    try:
        data = request.json
        video_url = data.get("url")

        if not video_url:
            return jsonify({"error": "No URL provided"}), 400

        output_dir = 'downloads'
        ydl_opts = {
            'format': 'bestvideo+bestaudio/best',
            'outtmpl': f"{output_dir}/%(title)s.%(ext)s",
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            filename = ydl.prepare_filename(info)
            file_url = f"/downloads/{os.path.basename(filename)}"
            return jsonify({
                "message": "Download successful",
                "file_url": file_url,
                "file_name": os.path.basename(filename)
            }), 200

    except yt_dlp.DownloadError as e:
        return jsonify({"error": f"Download failed: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Internal error: {str(e)}"}), 500

@app.route('/downloads/<path:filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory('downloads', filename)

@app.route('/download-pin', methods=['POST'])
def download_pin():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({'success': False, 'message': 'No URL provided'}), 400

    # Kiểm tra URL có phải Pinterest không
    if "pinterest.com" not in url:
        return jsonify({'success': False, 'message': 'Invalid Pinterest URL'}), 400

    # Lấy video URL từ Pinterest
    video_url = get_video_url(url)
    if not video_url:
        return jsonify({'success': False, 'message': 'Failed to fetch video URL'}), 500

    return jsonify({'success': True, 'message': 'Video URL fetched successfully', 'video_url': video_url})

def get_video_url(pinterest_url):
    try:
        response = requests.get(pinterest_url)
        if response.status_code != 200:
            print(f"Failed to retrieve data from Pinterest. Status code: {response.status_code}")
            return None
        soup = BeautifulSoup(response.content, 'html.parser')
        video_tag = soup.find('video')
        if video_tag:
            video_url = video_tag['src']
            return video_url
        else:
            print("No video found on this Pinterest page.")
            return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
