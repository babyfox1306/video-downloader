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
            file_name = ydl.prepare_filename(info)

        return jsonify({"file_name": os.path.basename(file_name), "file_path": file_name}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/download/<filename>", methods=["GET"])
def download_file(filename):
    return send_from_directory('downloads', filename)

if __name__ == "__main__":
    app.run(debug=True)
