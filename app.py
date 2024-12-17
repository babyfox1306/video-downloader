import os
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import yt_dlp

# Configure logging
logging.basicConfig(level=logging.INFO)

# Create Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Create download directory if it doesn't exist
DOWNLOAD_DIR = 'downloads'
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

@app.route('/')
def home():
    return "Welcome to the Video Downloader API!"

@app.route("/api/video", methods=["POST"])
def download_video():
    try:
        # Get data from request
        data = request.json
        video_url = data.get("url")

        if not video_url:
            return jsonify({"error": "No URL provided"}), 400

        # Configure yt-dlp
        ydl_opts = {
            'format': 'bestvideo+bestaudio/best',
            'outtmpl': f"{DOWNLOAD_DIR}/%(title)s.%(ext)s",
        }

        # Download video using yt-dlp
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            file_name = ydl.prepare_filename(info)
            file_name = os.path.basename(file_name.strip())  # Clean filename

        # Return only file link to frontend
        file_link = f"https://your-website.com/api/download/{file_name}"
        return jsonify({"file_name": file_name, "file_link": file_link}), 200

    except yt_dlp.utils.DownloadError as e:
        logging.error(f"Download error: {e}")
        return jsonify({"error": "Failed to download video"}), 500
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/download/<filename>", methods=["GET"])
def download_file(filename):
    try:
        file_path = os.path.join(DOWNLOAD_DIR, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404
        # Send file from download directory
        return send_from_directory(DOWNLOAD_DIR, filename, as_attachment=True)
    except Exception as e:
        logging.error(f"File not found: {e}")
        return jsonify({"error": str(e)}), 404

if __name__ == "__main__":
    # Run Flask server
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
