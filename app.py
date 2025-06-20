import os
import logging
import re
import json
import asyncio
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import yt_dlp
from playwright.async_api import async_playwright

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

# Advanced Pinterest video extraction using Playwright
async def extract_pinterest_video(pin_url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        video_urls = []

        # Listen to all network responses
        async def handle_response(response):
            url = response.url
            if any(pattern in url.lower() for pattern in ['.mp4', '.m3u8', 'video', 'media']):
                logging.info(f"[NETWORK] Found video URL: {url}")
                video_urls.append(url)
        page.on("response", handle_response)

        logging.info(f"🔗 Opening Pinterest pin: {pin_url}")
        await page.goto(pin_url, timeout=60000)
        await page.wait_for_timeout(3000)

        # Auto-scroll to trigger video loading
        logging.info("📜 Auto-scrolling...")
        for i in range(3):
            await page.evaluate("window.scrollBy(0, 500)")
            await page.wait_for_timeout(1000)

        # Try to click on video elements
        try:
            video_elements = await page.query_selector_all("video, [data-test-id*='video']")
            if video_elements:
                logging.info(f"🎥 Found {len(video_elements)} video elements")
                for video in video_elements:
                    await video.click()
                    await page.wait_for_timeout(2000)
        except:
            pass

        # Extract data with JavaScript
        logging.info("🔧 Extracting data with JavaScript...")
        js_result = await page.evaluate("""
            () => {
                const results = {};
                
                // Check PWS state
                if (window.__PWS_INITIAL_STATE__) {
                    results.pws_state = window.__PWS_INITIAL_STATE__;
                }
                
                // Check video elements
                const videos = document.querySelectorAll('video');
                results.video_elements = [];
                for (let video of videos) {
                    results.video_elements.push({
                        src: video.src,
                        currentSrc: video.currentSrc
                    });
                }
                
                // Check all elements for video URLs
                const allElements = document.querySelectorAll('*');
                for (let el of allElements) {
                    const attrs = ['src', 'href', 'data-src'];
                    for (let attr of attrs) {
                        const value = el.getAttribute(attr);
                        if (value && (value.includes('.mp4') || value.includes('video'))) {
                            results.found_urls = results.found_urls || [];
                            results.found_urls.push({element: el.tagName, attr: attr, value: value});
                        }
                    }
                }
                
                return results;
            }
        """)

        # Process JavaScript results
        if js_result.get('pws_state'):
            logging.info("✅ Found PWS state data")
            try:
                pws_data = js_result['pws_state']
                if isinstance(pws_data, str):
                    pws_data = json.loads(pws_data)
                if 'resourceResponses' in pws_data:
                    for resource in pws_data['resourceResponses']:
                        if 'response' in resource and 'data' in resource['response']:
                            data = resource['response']['data']
                            if 'videos' in data:
                                logging.info("🎥 Found videos in PWS state!")
                                video_list = data['videos'].get('video_list', {})
                                for quality, video_data in video_list.items():
                                    if isinstance(video_data, dict) and 'url' in video_data:
                                        url = video_data['url']
                                        logging.info(f"📹 {quality}: {url}")
                                        video_urls.append(url)
            except Exception as e:
                logging.error(f"❌ Error parsing PWS state: {e}")

        if js_result.get('video_elements'):
            logging.info(f"🎬 Found {len(js_result['video_elements'])} video elements")
            for video in js_result['video_elements']:
                if video.get('src'):
                    video_urls.append(video['src'])
                if video.get('currentSrc'):
                    video_urls.append(video['currentSrc'])

        if js_result.get('found_urls'):
            logging.info(f"🔗 Found {len(js_result['found_urls'])} potential video URLs")
            for item in js_result['found_urls']:
                video_urls.append(item['value'])

        await browser.close()
        
        # Filter and return best video URL
        filtered_urls = []
        for url in video_urls:
            if url and url.startswith('http') and any(ext in url.lower() for ext in ['.mp4', '.m3u8', 'video']):
                filtered_urls.append(url)
        
        return filtered_urls[0] if filtered_urls else None

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
            logging.info(f"Extracting Pinterest video: {video_url}")

            # Use Playwright to extract video
            try:
                video_url_result = asyncio.run(extract_pinterest_video(video_url))
                
                if video_url_result:
                    logging.info(f"Successfully extracted video URL: {video_url_result}")
                    return jsonify({
                        "success": True,
                        "file_url": video_url_result,
                        "file_name": "pinterest_video.mp4"
                    })
                else:
                    return jsonify({"error": "Could not extract video from Pinterest", "success": False}), 404
                    
            except Exception as e:
                logging.error(f"Playwright extraction failed: {e}")
                return jsonify({"error": "Failed to extract video using browser automation", "success": False}), 500

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

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while processing the request", "details": str(e), "success": False}), 500

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
