import os
import logging
import re
import json
import asyncio
import subprocess
import sys
import tempfile
import time
from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import yt_dlp
from playwright.async_api import async_playwright

# Configure logging
logging.basicConfig(level=logging.INFO)

# Install Playwright browsers if not already installed
def install_playwright_browsers():
    try:
        logging.info("🔧 Checking Playwright browser installation...")
        result = subprocess.run([sys.executable, "-m", "playwright", "install", "chromium"], 
                              capture_output=True, text=True, timeout=300)
        if result.returncode == 0:
            logging.info("✅ Playwright browsers installed successfully")
        else:
            logging.error(f"❌ Failed to install Playwright browsers: {result.stderr}")
    except Exception as e:
        logging.error(f"❌ Error installing Playwright browsers: {e}")

# Install browsers on startup
install_playwright_browsers()

# Create Flask app
app = Flask(__name__)
# Cho phép tất cả origins và headers cho production
CORS(app, resources={
    r"/api/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False
    }
})

# Create download directory if it doesn't exist
DOWNLOAD_DIR = 'downloads'
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

@app.route('/')
def home():
    return "Welcome to the Video Downloader API!"

@app.route('/healthz')
def health_check():
    return jsonify({"status": "healthy", "service": "video-downloader"}), 200

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
    return 'pinterest.com' in url.lower() or 'pin.it' in url.lower()

# Function detect Instagram - AGGRESSIVE
def is_instagram_url(url):
    return any(domain in url.lower() for domain in ['instagram.com', 'instagr.am'])

# Function detect TikTok - AGGRESSIVE  
def is_tiktok_url(url):
    return any(domain in url.lower() for domain in ['tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'])

# Function detect Facebook - BRING IT ON
def is_facebook_url(url):
    return any(domain in url.lower() for domain in ['facebook.com', 'fb.watch', 'fb.com'])

# Function detect Twitter/X - NO FEAR
def is_twitter_url(url):
    return any(domain in url.lower() for domain in ['twitter.com', 'x.com', 't.co'])

# Function detect Reddit - EASY MONEY
def is_reddit_url(url):
    return any(domain in url.lower() for domain in ['reddit.com', 'v.redd.it'])

# Function to resolve pin.it short URLs to full Pinterest URLs
def resolve_pinterest_short_url(url):
    """
    Resolve pin.it short URLs to full Pinterest URLs
    """
    if 'pin.it' not in url.lower():
        return url
    
    try:
        logging.info(f"🔄 Resolving short URL: {url}")
        
        # Follow redirects to get the full URL
        response = requests.head(url, allow_redirects=True, timeout=10)
        resolved_url = response.url
        
        logging.info(f"✅ Resolved to: {resolved_url}")
        return resolved_url
        
    except Exception as e:
        logging.error(f"❌ Failed to resolve short URL: {e}")
        return url

# Function to clean Pinterest URL
def clean_pinterest_url(url):
    # First resolve short URLs if needed
    url = resolve_pinterest_short_url(url)
    
    match = re.search(r'(https://(www\.)?pinterest\.com/pin/\d+/)', url)
    if match:
        cleaned_url = match.group(1)
        logging.info(f"Cleaned Pinterest URL from {url} to {cleaned_url}")
        return cleaned_url
    return url

# Function to clean filename
def clean_filename(filename):
    import unicodedata
    
    # Remove invalid characters
    filename = re.sub(r'[<>:"/\\|?*]', '', filename)
    
    # Convert Unicode to ASCII-safe version for HTTP headers
    # This handles Vietnamese, Chinese, etc. characters
    try:
        # First try to normalize Unicode
        filename = unicodedata.normalize('NFKD', filename)
        # Convert to ASCII, replacing non-ASCII chars
        filename = filename.encode('ascii', 'ignore').decode('ascii')
        # Remove extra spaces and clean up
        filename = re.sub(r'\s+', ' ', filename).strip()
        
        # If filename becomes empty or too short, use a fallback
        if len(filename) < 3:
            filename = f"video_{int(time.time())}.mp4"
    except Exception as e:
        logging.warning(f"Filename cleaning failed: {e}")
        # Fallback to safe filename
        filename = f"video_{int(time.time())}.mp4"
    
    # Limit length
    if len(filename) > 100:
        filename = filename[:100]
    
    # Ensure it ends with extension
    if not filename.lower().endswith(('.mp4', '.mov', '.avi', '.mkv')):
        if '.' not in filename:
            filename += '.mp4'
    
    return filename

# Function to convert m3u8 to mp4 and return file content
def convert_m3u8_to_mp4_direct(m3u8_url):
    try:
        logging.info(f"🔄 Converting m3u8 to mp4: {m3u8_url}")
        
        # Create temporary file
        temp_file = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
        temp_path = temp_file.name
        temp_file.close()
        
        logging.info(f"📥 Downloading m3u8 stream with ffmpeg...")
        
        try:
            # Use ffmpeg directly to download and convert m3u8 to mp4
            result = subprocess.run([
                'ffmpeg', '-y', '-i', m3u8_url, 
                '-c', 'copy',  # Copy streams without re-encoding for speed
                '-bsf:a', 'aac_adtstoasc',  # Fix AAC stream if needed
                temp_path
            ], capture_output=True, text=True, timeout=60)
            
            if result.returncode == 0 and os.path.exists(temp_path):
                logging.info(f"✅ Successfully converted to mp4")
                # Read file content
                with open(temp_path, 'rb') as f:
                    file_content = f.read()
                # Clean up temp file
                os.unlink(temp_path)
                return file_content
            else:
                logging.error(f"❌ ffmpeg conversion failed: {result.stderr}")
                
                # Fallback: Try with re-encoding
                logging.info(f"🔄 Trying with re-encoding...")
                result = subprocess.run([
                    'ffmpeg', '-y', '-i', m3u8_url,
                    '-c:v', 'libx264', '-c:a', 'aac',
                    '-preset', 'fast',
                    temp_path
                ], capture_output=True, text=True, timeout=120)
                
                if result.returncode == 0 and os.path.exists(temp_path):
                    logging.info(f"✅ Successfully converted with re-encoding")
                    # Read file content
                    with open(temp_path, 'rb') as f:
                        file_content = f.read()
                    # Clean up temp file
                    os.unlink(temp_path)
                    return file_content
                else:
                    logging.error(f"❌ ffmpeg re-encoding also failed: {result.stderr}")
                    
        except subprocess.TimeoutExpired:
            logging.error("❌ ffmpeg conversion timed out")
        except Exception as e:
            logging.error(f"❌ ffmpeg error: {e}")
        finally:
            # Clean up temp file if it exists
            if os.path.exists(temp_path):
                os.unlink(temp_path)
            
        return None
        
    except Exception as e:
        logging.error(f"❌ Conversion failed: {e}")
        return None

# Advanced Pinterest video extraction using Playwright
async def extract_pinterest_video(pin_url):
    async with async_playwright() as p:
        # Launch browser with optimized settings for speed
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-first-run',
                '--safebrowsing-disable-auto-update',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--disable-domain-reliability',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection'
            ]
        )
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 720},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = await context.new_page()
        video_urls = []

        # Listen to network responses for video URLs
        async def handle_response(response):
            url = response.url
            if any(pattern in url.lower() for pattern in ['.mp4', '.m3u8', 'video', 'media']):
                logging.info(f"[NETWORK] Found video URL: {url}")
                video_urls.append(url)
        page.on("response", handle_response)

        logging.info(f"🔗 Opening Pinterest pin: {pin_url}")
        await page.goto(pin_url, timeout=15000)  # Reduced timeout
        await page.wait_for_timeout(1000)  # Minimal wait

        # Quick JavaScript extraction
        logging.info("🔧 Extracting data with JavaScript...")
        js_result = await page.evaluate("""
            () => {
                const results = {};
                
                // Check PWS state first (most reliable)
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
                
                // Quick check for video URLs in attributes
                const videoElements = document.querySelectorAll('[src*="video"], [href*="video"], [data-src*="video"]');
                results.found_urls = [];
                for (let el of videoElements) {
                    const attrs = ['src', 'href', 'data-src'];
                    for (let attr of attrs) {
                        const value = el.getAttribute(attr);
                        if (value && (value.includes('.mp4') || value.includes('.m3u8') || value.includes('video'))) {
                            results.found_urls.push({element: el.tagName, attr: attr, value: value});
                        }
                    }
                }
                
                return results;
            }
        """)

        # Process JavaScript results quickly
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
        
        # Log all found URLs for debugging
        logging.info(f"🎯 Total video URLs found: {len(filtered_urls)}")
        for i, url in enumerate(filtered_urls):
            logging.info(f"🎯 URL {i+1}: {url}")
        
        # Prioritize .m3u8 files for Pinterest
        m3u8_urls = [url for url in filtered_urls if '.m3u8' in url.lower()]
        if m3u8_urls:
            logging.info(f"🎯 Found {len(m3u8_urls)} m3u8 URLs, returning first one")
            return m3u8_urls[0]
        
        # Fallback to first URL
        if filtered_urls:
            logging.info(f"🎯 No m3u8 URLs found, returning first URL")
            return filtered_urls[0]
        
        logging.warning("❌ No video URLs found")
        return None

# Advanced Instagram video extraction - HARDCORE MODE
async def extract_instagram_video(insta_url):
    async with async_playwright() as p:
        # Launch browser with AGGRESSIVE stealth settings
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-first-run',
                '--safebrowsing-disable-auto-update',
                '--disable-client-side-phishing-detection',
                '--disable-component-update',
                '--disable-domain-reliability',
                '--disable-features=TranslateUI',
                '--disable-ipc-flooding-protection',
                '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
            ]
        )
        
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},  # iPhone dimensions
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            is_mobile=True,
            has_touch=True
        )
        
        page = await context.new_page()
        video_urls = []
        
        # AGGRESSIVE network monitoring
        async def handle_response(response):
            url = response.url
            # Look for video sources more aggressively
            if any(pattern in url.lower() for pattern in ['.mp4', '.m3u8', 'video', 'scontent', 'fbcdn', 'cdninstagram']):
                logging.info(f"[INSTAGRAM] Found potential video URL: {url}")
                video_urls.append(url)
        page.on("response", handle_response)
        
        logging.info(f"🔗 Opening Instagram URL: {insta_url}")
        
        try:
            # Try mobile Instagram first (less protection)
            mobile_url = insta_url.replace('instagram.com', 'm.instagram.com')
            await page.goto(mobile_url, timeout=15000)
            
            # Wait for content to load
            await page.wait_for_timeout(2000)
            
            # AGGRESSIVE JavaScript extraction
            js_result = await page.evaluate("""
                () => {
                    const results = {
                        video_elements: [],
                        meta_content: [],
                        script_data: []
                    };
                    
                    // Extract video elements
                    const videos = document.querySelectorAll('video');
                    for (let video of videos) {
                        results.video_elements.push({
                            src: video.src,
                            currentSrc: video.currentSrc,
                            poster: video.poster
                        });
                    }
                    
                    // Extract from meta tags
                    const metas = document.querySelectorAll('meta[property*="video"], meta[name*="video"]');
                    for (let meta of metas) {
                        results.meta_content.push({
                            property: meta.getAttribute('property') || meta.getAttribute('name'),
                            content: meta.getAttribute('content')
                        });
                    }
                    
                    // Look for Instagram's data in script tags
                    const scripts = document.querySelectorAll('script');
                    for (let script of scripts) {
                        const content = script.textContent || script.innerText;
                        if (content && (content.includes('video_url') || content.includes('videoUrl') || content.includes('.mp4'))) {
                            // Extract potential video URLs from script content
                            const videoMatches = content.match(/https?:\\/\\/[^"\\s]+\\.mp4[^"\\s]*/g);
                            if (videoMatches) {
                                results.script_data = results.script_data.concat(videoMatches);
                            }
                        }
                    }
                    
                    return results;
                }
            """)
            
            # Process JavaScript results
            if js_result.get('video_elements'):
                logging.info(f"🎬 Found {len(js_result['video_elements'])} video elements")
                for video in js_result['video_elements']:
                    if video.get('src'):
                        video_urls.append(video['src'])
                    if video.get('currentSrc'):
                        video_urls.append(video['currentSrc'])
            
            if js_result.get('script_data'):
                logging.info(f"📜 Found {len(js_result['script_data'])} video URLs in scripts")
                video_urls.extend(js_result['script_data'])
            
            if js_result.get('meta_content'):
                logging.info(f"📄 Found {len(js_result['meta_content'])} meta video properties")
                for meta in js_result['meta_content']:
                    if meta.get('content') and '.mp4' in meta['content']:
                        video_urls.append(meta['content'])
            
        except Exception as e:
            logging.error(f"❌ Mobile Instagram failed: {e}")
            
            # Fallback to desktop version
            try:
                logging.info("🖥️ Trying desktop Instagram...")
                await page.goto(insta_url, timeout=15000)
                await page.wait_for_timeout(3000)
                
                # Try to find video elements on desktop
                desktop_videos = await page.evaluate("""
                    () => {
                        const videos = document.querySelectorAll('video');
                        return Array.from(videos).map(v => ({
                            src: v.src,
                            currentSrc: v.currentSrc
                        }));
                    }
                """)
                
                for video in desktop_videos:
                    if video.get('src'):
                        video_urls.append(video['src'])
                    if video.get('currentSrc'):
                        video_urls.append(video['currentSrc'])
                        
            except Exception as e2:
                logging.error(f"❌ Desktop Instagram also failed: {e2}")
        
        await browser.close()
        
        # Filter and return best video URL
        filtered_urls = []
        for url in video_urls:
            if url and url.startswith('http') and ('.mp4' in url.lower() or '.m3u8' in url.lower()):
                filtered_urls.append(url)
        
        # Remove duplicates
        filtered_urls = list(set(filtered_urls))
        
        logging.info(f"🎯 Instagram: Found {len(filtered_urls)} video URLs")
        for i, url in enumerate(filtered_urls):
            logging.info(f"🎯 Instagram URL {i+1}: {url}")
        
        if filtered_urls:
            # Return highest quality (usually the longest URL for Instagram)
            best_url = max(filtered_urls, key=len)
            logging.info(f"🏆 Returning best Instagram URL: {best_url}")
            return best_url
        
        logging.warning("❌ No Instagram video URLs found")
        return None

# Advanced Facebook video extraction - AGGRESSIVE MODE
async def extract_facebook_video(fb_url):
    async with async_playwright() as p:
        # Launch browser with mobile user agent (less protection)
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-first-run',
                '--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
            ]
        )
        
        context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            is_mobile=True,
            has_touch=True
        )
        
        page = await context.new_page()
        video_urls = []
        
        # Monitor network for video URLs
        async def handle_response(response):
            url = response.url
            if any(pattern in url.lower() for pattern in ['.mp4', '.m3u8', 'video', 'fbcdn', 'scontent']):
                logging.info(f"[FACEBOOK] Found potential video URL: {url}")
                video_urls.append(url)
        page.on("response", handle_response)
        
        logging.info(f"🔗 Opening Facebook URL: {fb_url}")
        
        try:
            # Try mobile Facebook first - fix URL properly
            if 'www.facebook.com' in fb_url:
                mobile_url = fb_url.replace('www.facebook.com', 'm.facebook.com')
            elif 'facebook.com' in fb_url and 'm.facebook.com' not in fb_url:
                mobile_url = fb_url.replace('facebook.com', 'm.facebook.com')
            else:
                mobile_url = fb_url
            
            logging.info(f"🔄 Trying mobile Facebook URL: {mobile_url}")
            
            try:
                await page.goto(mobile_url, timeout=15000)
                await page.wait_for_timeout(3000)
            except Exception as goto_error:
                logging.warning(f"⚠️ Page load timeout, but continuing with network captured URLs: {goto_error}")
                # Don't fail here, we might have captured video URLs from network requests
                pass
            
            # Extract video elements (only if page loaded successfully)
            try:
                js_result = await page.evaluate("""
                    () => {
                        const results = {
                            video_elements: [],
                            script_data: []
                        };
                        
                        // Get video elements
                        const videos = document.querySelectorAll('video');
                        for (let video of videos) {
                            results.video_elements.push({
                                src: video.src,
                                currentSrc: video.currentSrc
                            });
                        }
                        
                        // Look for video URLs in script tags
                        const scripts = document.querySelectorAll('script');
                        for (let script of scripts) {
                            const content = script.textContent || script.innerText;
                            if (content && content.includes('.mp4')) {
                                const videoMatches = content.match(/https?:\\/\\/[^"\\s]+\\.mp4[^"\\s]*/g);
                                if (videoMatches) {
                                    results.script_data = results.script_data.concat(videoMatches);
                                }
                            }
                        }
                        
                        return results;
                    }
                """)
                
                # Process results
                if js_result.get('video_elements'):
                    for video in js_result['video_elements']:
                        if video.get('src'):
                            video_urls.append(video['src'])
                        if video.get('currentSrc'):
                            video_urls.append(video['currentSrc'])
                
                if js_result.get('script_data'):
                    video_urls.extend(js_result['script_data'])
                    
            except Exception as js_error:
                logging.warning(f"⚠️ JavaScript extraction failed, relying on network captured URLs: {js_error}")
                # Continue with network captured URLs
                
        except Exception as e:
            logging.error(f"❌ Facebook extraction failed: {e}")
        
        await browser.close()
        
        # Filter and return best URL
        filtered_urls = []
        for url in video_urls:
            if url and url.startswith('http') and ('.mp4' in url.lower() or '.m3u8' in url.lower()):
                filtered_urls.append(url)
        
        filtered_urls = list(set(filtered_urls))
        logging.info(f"🎯 Facebook: Found {len(filtered_urls)} video URLs")
        
        if filtered_urls:
            best_url = max(filtered_urls, key=len)
            logging.info(f"🏆 Returning best Facebook URL: {best_url}")
            return best_url
        
        logging.warning("❌ No Facebook video URLs found")
        return None

# Advanced Twitter/X video extraction - NO FEAR MODE
# SPEED OPTIMIZATION: Simplified approach - remove browser pooling for now
# Browser pooling causes issues with event loops, use direct approach

async def extract_twitter_video(twitter_url):
    # SPEED OPTIMIZATION: Use pooled browser instead of creating new one
    import asyncio
    
    # PRODUCTION FIX: Longer timeout for production environment
    try:
        return await asyncio.wait_for(_extract_twitter_video_impl(twitter_url), timeout=45.0)
    except asyncio.TimeoutError:
        logging.error("⏰ Twitter extraction timed out after 45 seconds - trying YT-DLP fallback")
        
        # FALLBACK: Try yt-dlp if Playwright times out
        try:
            import yt_dlp
            ydl_opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': False,
                'skip_download': True,
                'socket_timeout': 15,
                'retries': 2,
                'format': 'best[height>=720]/best[height>=480]/best',  # Prioritize HD quality
                'format_sort': ['res:720', 'fps', 'codec:h264']  # Sort by resolution, fps, codec
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(twitter_url, download=False)
                
                if info and 'url' in info:
                    logging.info(f"✅ TIMEOUT FALLBACK: Found video via yt-dlp: {info['url']}")
                    return info['url']
                elif info and 'formats' in info:
                    # Sort formats by quality (highest first)
                    formats = sorted(info['formats'], 
                                   key=lambda x: (x.get('height', 0), x.get('width', 0), x.get('fps', 0)), 
                                   reverse=True)
                    
                    for fmt in formats:
                        if fmt.get('url') and '.mp4' in fmt.get('url', ''):
                            quality_info = f"{fmt.get('width', '?')}x{fmt.get('height', '?')}"
                            logging.info(f"✅ TIMEOUT FALLBACK: Found HD video format via yt-dlp: {fmt['url']} ({quality_info})")
                            return fmt['url']
                            
        except Exception as fallback_error:
            logging.error(f"❌ TIMEOUT FALLBACK also failed: {fallback_error}")
        
        return None
    except Exception as e:
        logging.error(f"💥 Twitter extraction failed: {e}")
        return None

async def _extract_twitter_video_impl(twitter_url):
    # SPEED OPTIMIZATION: Use optimized browser settings
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--mute-audio',
                '--no-first-run',
                '--single-process',
                '--no-zygote',
                '--disable-blink-features=AutomationControlled',
                '--aggressive-cache-discard',
                '--disable-component-update',
                '--disable-domain-reliability',
                '--disable-ipc-flooding-protection',
                '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            ]
        )
        
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            is_mobile=False,
            has_touch=False
        )
        
        page = await context.new_page()
        video_urls = []
        
        # STRICT network monitoring - ONLY actual tweet videos
        async def handle_response(response):
            url = response.url
            # ONLY accept actual tweet video patterns - REJECT promotional content
            is_tweet_video = any(pattern in url.lower() for pattern in [
                'ext_tw_video',                    # Actual tweet videos
                'amplify_video',                   # Promoted videos  
                'tweet_video',                     # Tweet videos
                'pbs.twimg.com/ext_tw_video',      # PBS hosted tweet videos
                'pbs.twimg.com/amplify_video',     # PBS hosted amplify videos
                'video.twimg.com/ext_tw_video',    # Video CDN tweet videos
                'video.twimg.com/amplify_video'    # Video CDN amplify videos
            ])
            
            # REJECT promotional/UI videos
            is_promotional = any(exclude in url.lower() for exclude in [
                'anniversary-theme', 'inapp_', 'radar_promo', 'sticky/videos',
                'abs.twimg.com', 'ton.twimg.com', '/images/', 'profile_images',
                'static/', 'assets/'
            ])
            
            if is_tweet_video and not is_promotional:
                logging.info(f"[TWITTER] Found ACTUAL video URL: {url}")
                video_urls.append(url)
        page.on("response", handle_response)
        
        logging.info(f"🔗 Opening Twitter URL: {twitter_url}")
        
        try:
            # Normalize URL - convert x.com to twitter.com for better compatibility
            normalized_url = twitter_url.replace('x.com', 'twitter.com')
            
            # PRODUCTION FIX: Longer timeout for slow networks
            await page.goto(normalized_url, timeout=30000, wait_until='domcontentloaded')
            
            # SPEED OPTIMIZATION: Shorter wait time
            await page.wait_for_timeout(2000)
            
            # AGGRESSIVE JavaScript extraction for Twitter
            js_result = await page.evaluate("""
                () => {
                    const results = {
                        video_elements: [],
                        script_data: [],
                        meta_content: [],
                        data_attributes: []
                    };
                    
                    // Extract video elements
                    const videos = document.querySelectorAll('video');
                    for (let video of videos) {
                        results.video_elements.push({
                            src: video.src,
                            currentSrc: video.currentSrc,
                            poster: video.poster,
                            dataset: video.dataset
                        });
                    }
                    
                    // Look for Twitter's video data in script tags
                    const scripts = document.querySelectorAll('script');
                    for (let script of scripts) {
                        const content = script.textContent || script.innerText;
                        if (content && (
                            content.includes('video_url') || 
                            content.includes('videoUrl') || 
                            content.includes('ext_tw_video') ||
                            content.includes('amplify_video') ||
                            content.includes('tweet_video') ||
                            content.includes('pbs.twimg.com')
                        )) {
                            // Extract ACTUAL tweet video URLs - more specific patterns
                            const tweetVideoPatterns = [
                                /https?:\\/\\/[^"\\s]*ext_tw_video[^"\\s]*\\.mp4[^"\\s]*/g,
                                /https?:\\/\\/[^"\\s]*amplify_video[^"\\s]*\\.mp4[^"\\s]*/g,
                                /https?:\\/\\/[^"\\s]*tweet_video[^"\\s]*\\.mp4[^"\\s]*/g,
                                /https?:\\/\\/pbs\\.twimg\\.com\\/ext_tw_video[^"\\s]*/g,
                                /https?:\\/\\/pbs\\.twimg\\.com\\/amplify_video[^"\\s]*/g,
                                /https?:\\/\\/video\\.twimg\\.com\\/ext_tw_video[^"\\s]*/g,
                                /https?:\\/\\/video\\.twimg\\.com\\/amplify_video[^"\\s]*/g
                            ];
                            
                            for (let pattern of tweetVideoPatterns) {
                                const matches = content.match(pattern);
                                if (matches) {
                                    results.script_data = results.script_data.concat(matches);
                                }
                            }
                        }
                    }
                    
                    // Extract from meta tags
                    const metas = document.querySelectorAll('meta[property*="video"], meta[name*="video"]');
                    for (let meta of metas) {
                        results.meta_content.push({
                            property: meta.getAttribute('property') || meta.getAttribute('name'),
                            content: meta.getAttribute('content')
                        });
                    }
                    
                    // FIXED: Look for data attributes that might contain video URLs
                    const allElements = document.querySelectorAll('*');
                    for (let element of allElements) {
                        for (let attr of element.attributes) {
                            if (attr.name.startsWith('data-') && attr.value && attr.value.startsWith('http') && (
                                attr.value.includes('ext_tw_video') || 
                                attr.value.includes('amplify_video') ||
                                attr.value.includes('tweet_video') ||
                                attr.value.includes('pbs.twimg.com') ||
                                attr.value.includes('video.twimg.com')
                            )) {
                                results.data_attributes.push({
                                    attribute: attr.name,
                                    value: attr.value
                                });
                            }
                        }
                    }
                    
                    return results;
                }
            """)
            
            # Process JavaScript results
            if js_result.get('video_elements'):
                logging.info(f"🎬 Found {len(js_result['video_elements'])} video elements")
                for video in js_result['video_elements']:
                    if video.get('src'):
                        video_urls.append(video['src'])
                    if video.get('currentSrc'):
                        video_urls.append(video['currentSrc'])
            
            if js_result.get('script_data'):
                logging.info(f"📜 Found {len(js_result['script_data'])} video URLs in scripts")
                video_urls.extend(js_result['script_data'])
            
            if js_result.get('meta_content'):
                logging.info(f"📄 Found {len(js_result['meta_content'])} meta video properties")
                for meta in js_result['meta_content']:
                    if meta.get('content') and ('.mp4' in meta['content'] or 'video' in meta['content']):
                        video_urls.append(meta['content'])
            
            if js_result.get('data_attributes'):
                logging.info(f"🏷️ Found {len(js_result['data_attributes'])} data attributes with video info")
                for data_attr in js_result['data_attributes']:
                    if data_attr.get('value'):
                        video_urls.append(data_attr['value'])
            
            # SPEED OPTIMIZATION: Skip scrolling if we already have videos
            if len(video_urls) == 0:
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(1000)
            
            # Check for additional videos after scroll
            additional_videos = await page.evaluate("""
                () => {
                    const videos = document.querySelectorAll('video');
                    return Array.from(videos).map(v => ({
                        src: v.src,
                        currentSrc: v.currentSrc
                    }));
                }
            """)
            
            for video in additional_videos:
                if video.get('src'):
                    video_urls.append(video['src'])
                if video.get('currentSrc'):
                    video_urls.append(video['currentSrc'])
                    
        except Exception as e:
            logging.error(f"❌ Desktop Twitter failed: {e}")
            
            # Fallback to mobile version if desktop fails
            try:
                logging.info("📱 Trying mobile Twitter as fallback...")
                
                # Switch to mobile context
                mobile_context = await browser.new_context(
                    viewport={'width': 375, 'height': 812},
                    user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
                    is_mobile=True,
                    has_touch=True
                )
                
                mobile_page = await mobile_context.new_page()
                
                # Setup mobile network monitoring - STRICT filtering
                async def handle_mobile_response(response):
                    url = response.url
                    # ONLY accept actual tweet video patterns
                    is_tweet_video = any(pattern in url.lower() for pattern in [
                        'ext_tw_video', 'amplify_video', 'tweet_video',
                        'pbs.twimg.com/ext_tw_video', 'pbs.twimg.com/amplify_video',
                        'video.twimg.com/ext_tw_video', 'video.twimg.com/amplify_video'
                    ])
                    
                    # REJECT promotional/UI videos
                    is_promotional = any(exclude in url.lower() for exclude in [
                        'anniversary-theme', 'inapp_', 'radar_promo', 'sticky/videos',
                        'abs.twimg.com', 'ton.twimg.com', '/images/', 'profile_images'
                    ])
                    
                    if is_tweet_video and not is_promotional:
                        logging.info(f"[TWITTER-MOBILE] Found ACTUAL video URL: {url}")
                        video_urls.append(url)
                
                mobile_page.on("response", handle_mobile_response)
                
                # SPEED OPTIMIZATION: Faster mobile loading
                mobile_url = normalized_url.replace('twitter.com', 'm.twitter.com')
                await mobile_page.goto(mobile_url, timeout=10000, wait_until='domcontentloaded')
                await mobile_page.wait_for_timeout(1500)
                
                # Extract videos from mobile version
                mobile_videos = await mobile_page.evaluate("""
                    () => {
                        const videos = document.querySelectorAll('video');
                        return Array.from(videos).map(v => ({
                            src: v.src,
                            currentSrc: v.currentSrc
                        }));
                    }
                """)
                
                for video in mobile_videos:
                    if video.get('src'):
                        video_urls.append(video['src'])
                    if video.get('currentSrc'):
                        video_urls.append(video['currentSrc'])
                
                await mobile_context.close()
                        
            except Exception as e2:
                logging.error(f"❌ Mobile Twitter also failed: {e2}")
        
        await browser.close()
        
        # DEBUG: Log all found URLs before filtering
        logging.info(f"🔍 DEBUG: Found {len(video_urls)} total URLs before filtering:")
        for i, url in enumerate(video_urls[:10], 1):  # Log first 10 URLs
            logging.info(f"🔍 RAW URL {i}: {url}")
        
        # SPEED OPTIMIZATION: Early termination if we have good videos
        if len(video_urls) > 0:
            logging.info(f"⚡ SPEED: Found {len(video_urls)} videos via Playwright, skipping fallback")
        else:
            logging.warning("⚠️  No URLs found via network monitoring, trying YT-DLP fallback...")
            
            try:
                # SPEED OPTIMIZATION: Faster yt-dlp with timeout
                import yt_dlp
                
                ydl_opts = {
                    'quiet': True,
                    'no_warnings': True,
                    'extract_flat': False,
                    'skip_download': True,
                    'socket_timeout': 10,  # 10 second timeout
                    'retries': 1  # Only 1 retry
                }
                
                with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                    info = ydl.extract_info(twitter_url, download=False)
                    
                    if info and 'url' in info:
                        video_urls.append(info['url'])
                        logging.info(f"✅ FALLBACK: Found video via yt-dlp: {info['url']}")
                    elif info and 'formats' in info:
                        for fmt in info['formats']:
                            if fmt.get('url') and '.mp4' in fmt.get('url', ''):
                                video_urls.append(fmt['url'])
                                logging.info(f"✅ FALLBACK: Found video format via yt-dlp: {fmt['url']}")
                                break
                                
            except Exception as fallback_error:
                logging.error(f"❌ FALLBACK failed: {fallback_error}")
        
        # STRICT filtering for Twitter video URLs - ONLY ACTUAL TWEET VIDEOS
        filtered_urls = []
        for url in video_urls:
            if url and url.startswith('http'):
                # TEMPORARY: More permissive filtering to debug
                is_actual_video = any(pattern in url.lower() for pattern in [
                    'ext_tw_video',           # Actual tweet videos
                    'amplify_video',          # Promoted videos  
                    'tweet_video',            # Tweet videos
                    'pbs.twimg.com/ext_tw_video',    # PBS hosted tweet videos
                    'pbs.twimg.com/amplify_video',   # PBS hosted amplify videos
                    'video.twimg.com/ext_tw_video',  # Video CDN tweet videos
                    'video.twimg.com/amplify_video', # Video CDN amplify videos
                    '.mp4',                   # Any MP4 file (temporary)
                    'video.twimg.com',        # Any video from twimg CDN
                    'pbs.twimg.com'           # Any PBS hosted content
                ])
                
                # REJECT promotional/UI videos
                is_promotional = any(exclude in url.lower() for exclude in [
                    'anniversary-theme',      # Twitter anniversary videos
                    'inapp_',                # In-app promotional videos
                    'radar_promo',           # Radar promo videos
                    'sticky/videos',         # Sticky promotional videos
                    'abs.twimg.com',         # Absolute Twitter assets
                    'ton.twimg.com',         # Twitter on assets
                    '/images/',              # Image directories
                    'profile_images',        # Profile images
                    'static/',               # Static assets
                    'assets/',               # Asset directories
                ])
                
                if is_actual_video and not is_promotional:
                    filtered_urls.append(url)
        
        # Remove duplicates
        filtered_urls = list(set(filtered_urls))
        
        logging.info(f"🎯 Twitter: Found {len(filtered_urls)} ACTUAL video URLs (filtered out promotional content)")
        for i, url in enumerate(filtered_urls):
            logging.info(f"🎯 Twitter URL {i+1}: {url}")
        
        if filtered_urls:
            # FIXED: Prioritize actual video files over thumbnails
            best_url = None
            
            # FIRST: Separate video files from thumbnails/images
            video_files = [url for url in filtered_urls if '.mp4' in url and 'thumb' not in url and '/img/' not in url]
            thumbnail_files = [url for url in filtered_urls if 'thumb' in url or '/img/' in url or '.jpg' in url]
            
            logging.info(f"📹 Found {len(video_files)} video files and {len(thumbnail_files)} thumbnails")
            
            # Priority 1: HD video files with quality sorting
            if video_files:
                # Sort video files by quality (resolution in filename, then URL length)
                quality_sorted = sorted(video_files, key=lambda url: (
                    # Prioritize by exact resolution hints in URL
                    1494 if '1494x1080' in url else 1080 if '1080' in url else 720 if '720' in url else 480 if '480' in url else 360 if '360' in url else 240 if '240' in url else 0,
                    # Then prioritize ext_tw_video over amplify_video
                    2 if 'ext_tw_video' in url and '/pu/vid/' in url else 1 if 'ext_tw_video' in url else 0 if 'amplify_video' in url else -1,
                    # Then by URL length (more parameters usually = higher quality)
                    len(url)
                ), reverse=True)
                
                best_url = quality_sorted[0]
                logging.info(f"🎬 Selected HD video file: {best_url}")
            
            # Priority 2: If no video files found, try any video-like URL (avoid thumbnails)
            else:
                non_thumb_urls = [url for url in filtered_urls if 'thumb' not in url and '/img/' not in url and '.jpg' not in url]
                if non_thumb_urls:
                    best_url = max(non_thumb_urls, key=len)
                    logging.info(f"🎯 Selected non-thumbnail URL: {best_url}")
                else:
                    # Last resort: any URL
                    best_url = max(filtered_urls, key=len)
                    logging.info(f"⚠️ Fallback to any URL: {best_url}")
            
            logging.info(f"🏆 Returning best Twitter URL: {best_url}")
            return best_url
        
        logging.warning("❌ No Twitter video URLs found")
        return None

# Universal URL resolver for short URLs
def resolve_short_url(url):
    """
    Resolve various short URLs to full URLs - AGGRESSIVE APPROACH
    """
    short_domains = ['pin.it', 'instagr.am', 'fb.watch', 't.co', 'vm.tiktok.com', 'vt.tiktok.com']
    
    if not any(domain in url.lower() for domain in short_domains):
        return url
    
    try:
        logging.info(f"🔄 Resolving short URL: {url}")
        
        # Use session with aggressive headers
        session = requests.Session()
        session.headers.update({
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
        
        response = session.head(url, allow_redirects=True, timeout=10)
        resolved_url = response.url
        
        logging.info(f"✅ Resolved to: {resolved_url}")
        return resolved_url
        
    except Exception as e:
        logging.error(f"❌ Failed to resolve short URL: {e}")
        return url

def process_video_request(data, fast_mode=False):
    """Common function to process video requests"""
    try:
        video_url = data.get("url")

        if not video_url:
            return jsonify({"error": "No URL provided"}), 400
            
        # Override fast_mode if specified
        if fast_mode:
            data["fast_mode"] = True

        if is_pinterest_url(video_url):
            video_url = clean_pinterest_url(video_url)
            logging.info(f"Extracting Pinterest video: {video_url}")

            # Use Playwright to extract video
            try:
                video_url_result = asyncio.run(extract_pinterest_video(video_url))
                
                if video_url_result:
                    logging.info(f"Successfully extracted video URL: {video_url_result}")
                    
                    # Check if it's an m3u8 file and convert it
                    if '.m3u8' in video_url_result.lower():
                        logging.info("🔄 Detected m3u8 file, converting to mp4...")
                        
                        # Check if user wants fast mode (no conversion)
                        fast_mode = data.get("fast_mode", False)
                        if fast_mode:
                            logging.info("⚡ Fast mode: returning m3u8 URL directly")
                            return jsonify({
                                "success": True,
                                "file_url": video_url_result,
                                "file_name": "pinterest_video.m3u8",
                                "file_type": ".m3u8",
                                "message": "Fast mode: Video URL extracted. Use VLC or online converter.",
                                "fast_mode": True
                            })
                        
                        output_filename = f"pinterest_video_{int(time.time())}.mp4"
                        file_content = convert_m3u8_to_mp4_direct(video_url_result)
                        
                        if file_content:
                            # Return the converted file directly
                            response = Response(
                                file_content,
                                mimetype='video/mp4',
                                headers={
                                    'Content-Disposition': f'attachment; filename="{output_filename}"',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Headers': 'Content-Type',
                                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                                }
                            )
                            return response
                        else:
                            # If conversion fails, return the original m3u8 URL
                            return jsonify({
                                "success": True,
                                "file_url": video_url_result,
                                "file_name": "pinterest_video.m3u8",
                                "file_type": ".m3u8",
                                "message": "Video URL extracted. Use VLC or online converter to download.",
                                "conversion_failed": True
                            })
                    else:
                        # For direct mp4 or other formats
                        return jsonify({
                            "success": True,
                            "file_url": video_url_result,
                            "file_name": "pinterest_video.mp4",
                            "file_type": ".mp4",
                            "message": "Video URL extracted successfully. You can download the video using the provided URL."
                        })
                else:
                    return jsonify({"error": "Could not extract video from Pinterest", "success": False}), 404
                    
            except Exception as e:
                logging.error(f"Playwright extraction failed: {e}")
                return jsonify({"error": "Failed to extract video using browser automation", "success": False}), 500

        elif is_instagram_url(video_url):
            logging.info(f"Extracting Instagram video: {video_url}")
            try:
                video_url_result = asyncio.run(extract_instagram_video(video_url))
                
                if video_url_result:
                    logging.info(f"Successfully extracted video URL: {video_url_result}")
                    
                    # Check if it's an m3u8 file and convert it
                    if '.m3u8' in video_url_result.lower():
                        logging.info("🔄 Detected m3u8 file, converting to mp4...")
                        
                        # Check if user wants fast mode (no conversion)
                        fast_mode = data.get("fast_mode", False)
                        if fast_mode:
                            logging.info("⚡ Fast mode: returning m3u8 URL directly")
                            return jsonify({
                                "success": True,
                                "file_url": video_url_result,
                                "file_name": "instagram_video.m3u8",
                                "file_type": ".m3u8",
                                "message": "Fast mode: Video URL extracted. Use VLC or online converter.",
                                "fast_mode": True
                            })
                        
                        output_filename = f"instagram_video_{int(time.time())}.mp4"
                        file_content = convert_m3u8_to_mp4_direct(video_url_result)
                        
                        if file_content:
                            # Return the converted file directly
                            response = Response(
                                file_content,
                                mimetype='video/mp4',
                                headers={
                                    'Content-Disposition': f'attachment; filename="{output_filename}"',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Headers': 'Content-Type',
                                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                                }
                            )
                            return response
                        else:
                            # For direct mp4 or other formats - DOWNLOAD DIRECTLY
                            logging.info("📹 Direct mp4 found, downloading for user...")
                            
                            try:
                                # Download the video file directly
                                response = requests.get(video_url_result, timeout=30, headers={
                                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
                                })
                                
                                if response.status_code == 200:
                                    file_content = response.content
                                    output_filename = f"instagram_video_{int(time.time())}.mp4"
                                    
                                    # Return file directly for AUTO DOWNLOAD
                                    return Response(
                                        file_content,
                                        mimetype='video/mp4',
                                        headers={
                                            'Content-Disposition': f'attachment; filename="{output_filename}"',
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Headers': 'Content-Type',
                                            'Access-Control-Allow-Methods': 'POST, OPTIONS'
                                        }
                                    )
                                else:
                                    logging.error(f"❌ Failed to download Instagram video: {response.status_code}")
                                    # Fallback to URL
                                    return jsonify({
                                        "success": True,
                                        "file_url": video_url_result,
                                        "file_name": "instagram_video.mp4",
                                        "file_type": ".mp4",
                                        "message": "Video URL extracted. Right-click to download."
                                    })
                                    
                            except Exception as e:
                                logging.error(f"❌ Instagram download failed: {e}")
                                # Fallback to URL
                                return jsonify({
                                    "success": True,
                                    "file_url": video_url_result,
                                    "file_name": "instagram_video.mp4",
                                    "file_type": ".mp4",
                                    "message": "Video URL extracted. Right-click to download."
                                })
                    else:
                        # For direct mp4 or other formats
                        return jsonify({
                            "success": True,
                            "file_url": video_url_result,
                            "file_name": "instagram_video.mp4",
                            "file_type": ".mp4",
                            "message": "Video URL extracted successfully. You can download the video using the provided URL."
                        })
                else:
                    return jsonify({"error": "Could not extract video from Instagram", "success": False}), 404
                    
            except Exception as e:
                logging.error(f"Instagram extraction failed: {e}")
                return jsonify({"error": "Failed to extract video using browser automation", "success": False}), 500

        elif is_facebook_url(video_url):
            logging.info(f"Extracting Facebook video: {video_url}")
            try:
                video_url_result = asyncio.run(extract_facebook_video(video_url))
                
                if video_url_result:
                    logging.info(f"Successfully extracted video URL: {video_url_result}")
                    
                    # Check if it's an m3u8 file and convert it
                    if '.m3u8' in video_url_result.lower():
                        logging.info("🔄 Detected m3u8 file, converting to mp4...")
                        
                        # Check if user wants fast mode (no conversion)
                        fast_mode = data.get("fast_mode", False)
                        if fast_mode:
                            logging.info("⚡ Fast mode: returning m3u8 URL directly")
                            return jsonify({
                                "success": True,
                                "file_url": video_url_result,
                                "file_name": "facebook_video.m3u8",
                                "file_type": ".m3u8",
                                "message": "Fast mode: Video URL extracted. Use VLC or online converter.",
                                "fast_mode": True
                            })
                        
                        output_filename = f"facebook_video_{int(time.time())}.mp4"
                        file_content = convert_m3u8_to_mp4_direct(video_url_result)
                        
                        if file_content:
                            # Return the converted file directly
                            response = Response(
                                file_content,
                                mimetype='video/mp4',
                                headers={
                                    'Content-Disposition': f'attachment; filename="{output_filename}"',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Headers': 'Content-Type',
                                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                                }
                            )
                            return response
                        else:
                            # For direct mp4 or other formats - FACEBOOK AUTO DOWNLOAD
                            logging.info("📹 Facebook mp4 found, downloading for user...")
                            
                            try:
                                # Download the video file directly
                                response = requests.get(video_url_result, timeout=30, headers={
                                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
                                })
                                
                                if response.status_code == 200:
                                    file_content = response.content
                                    output_filename = f"facebook_video_{int(time.time())}.mp4"
                                    
                                    # Return file directly for AUTO DOWNLOAD
                                    return Response(
                                        file_content,
                                        mimetype='video/mp4',
                                        headers={
                                            'Content-Disposition': f'attachment; filename="{output_filename}"',
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Headers': 'Content-Type',
                                            'Access-Control-Allow-Methods': 'POST, OPTIONS'
                                        }
                                    )
                                else:
                                    logging.error(f"❌ Failed to download Facebook video: {response.status_code}")
                                    # Fallback to URL
                                    return jsonify({
                                        "success": True,
                                        "file_url": video_url_result,
                                        "file_name": "facebook_video.mp4",
                                        "file_type": ".mp4",
                                        "message": "Video URL extracted. Right-click to download."
                                    })
                                    
                            except Exception as e:
                                logging.error(f"❌ Facebook download failed: {e}")
                                # Fallback to URL
                                return jsonify({
                                    "success": True,
                                    "file_url": video_url_result,
                                    "file_name": "facebook_video.mp4",
                                    "file_type": ".mp4",
                                    "message": "Video URL extracted. Right-click to download."
                                })
                    else:
                        # For direct mp4 or other formats
                        return jsonify({
                            "success": True,
                            "file_url": video_url_result,
                            "file_name": "facebook_video.mp4",
                            "file_type": ".mp4",
                            "message": "Video URL extracted successfully. You can download the video using the provided URL."
                        })
                else:
                    return jsonify({"error": "Could not extract video from Facebook", "success": False}), 404
                    
            except Exception as e:
                logging.error(f"Facebook extraction failed: {e}")
                return jsonify({"error": "Failed to extract video using browser automation", "success": False}), 500

        elif is_twitter_url(video_url):
            logging.info(f"Extracting Twitter video: {video_url}")
            try:
                video_url_result = asyncio.run(extract_twitter_video(video_url))
                
                if video_url_result:
                    logging.info(f"Successfully extracted video URL: {video_url_result}")
                    
                    # Check if it's an m3u8 file and convert it
                    if '.m3u8' in video_url_result.lower():
                        logging.info("🔄 Detected m3u8 file, converting to mp4...")
                        
                        # Check if user wants fast mode (no conversion)
                        fast_mode = data.get("fast_mode", False)
                        if fast_mode:
                            logging.info("⚡ Fast mode: returning m3u8 URL directly")
                            return jsonify({
                                "success": True,
                                "file_url": video_url_result,
                                "file_name": "twitter_video.m3u8",
                                "file_type": ".m3u8",
                                "message": "Fast mode: Video URL extracted. Use VLC or online converter.",
                                "fast_mode": True
                            })
                        
                        output_filename = f"twitter_video_{int(time.time())}.mp4"
                        file_content = convert_m3u8_to_mp4_direct(video_url_result)
                        
                        if file_content:
                            # Return the converted file directly
                            response = Response(
                                file_content,
                                mimetype='video/mp4',
                                headers={
                                    'Content-Disposition': f'attachment; filename="{output_filename}"',
                                    'Access-Control-Allow-Origin': '*',
                                    'Access-Control-Allow-Headers': 'Content-Type',
                                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                                }
                            )
                            return response
                        else:
                            # For direct mp4 or other formats - TWITTER AUTO DOWNLOAD  
                            logging.info("📹 Twitter mp4 found, downloading for user...")
                            
                            try:
                                # Download the video file directly
                                response = requests.get(video_url_result, timeout=30, headers={
                                    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
                                })
                                
                                if response.status_code == 200:
                                    file_content = response.content
                                    output_filename = f"twitter_video_{int(time.time())}.mp4"
                                    
                                    # Return file directly for AUTO DOWNLOAD
                                    return Response(
                                        file_content,
                                        mimetype='video/mp4',
                                        headers={
                                            'Content-Disposition': f'attachment; filename="{output_filename}"',
                                            'Access-Control-Allow-Origin': '*',
                                            'Access-Control-Allow-Headers': 'Content-Type',
                                            'Access-Control-Allow-Methods': 'POST, OPTIONS'
                                        }
                                    )
                                else:
                                    logging.error(f"❌ Failed to download Twitter video: {response.status_code}")
                                    # Fallback to URL
                                    return jsonify({
                                        "success": True,
                                        "file_url": video_url_result,
                                        "file_name": "twitter_video.mp4",
                                        "file_type": ".mp4",
                                        "message": "Video URL extracted. Right-click to download."
                                    })
                                    
                            except Exception as e:
                                logging.error(f"❌ Twitter download failed: {e}")
                                # Fallback to URL
                                return jsonify({
                                    "success": True,
                                    "file_url": video_url_result,
                                    "file_name": "twitter_video.mp4",
                                    "file_type": ".mp4",
                                    "message": "Video URL extracted. Right-click to download."
                                })
                    else:
                        # For direct mp4 or other formats
                        return jsonify({
                            "success": True,
                            "file_url": video_url_result,
                            "file_name": "twitter_video.mp4",
                            "file_type": ".mp4",
                            "message": "Video URL extracted successfully. You can download the video using the provided URL."
                        })
                else:
                    return jsonify({"error": "Could not extract video from Twitter", "success": False}), 404
                    
            except Exception as e:
                logging.error(f"Twitter extraction failed: {e}")
                return jsonify({"error": "Failed to extract video using browser automation", "success": False}), 500

        else:
            # yt-dlp cho các nền tảng khác - AUTO DOWNLOAD MODE với bypass
            logging.info(f"Using yt-dlp for URL: {video_url}")
            ydl_opts = {
                'format': 'bestvideo+bestaudio/best',
                'outtmpl': f"{DOWNLOAD_DIR}/%(title)s.%(ext)s",
                'user_agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
                'quiet': False,
                'no_warnings': False,
                # Bypass bot detection cho YouTube
                'extractor_args': {
                    'youtube': {
                        'player_client': ['android', 'ios', 'web'],
                    }
                },
                # Bypass Facebook detection
                'http_headers': {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                },
                # General bypass settings
                'cookiefile': '',
                'nocheckcertificate': True,
                'prefer_insecure': True,
                'no_check_certificate': True,
                'geo_bypass': True,
                'geo_bypass_country': 'US',
                # Retry settings
                'retries': 10,
                'fragment_retries': 10,
                'file_access_retries': 10,
            }
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(video_url, download=True)
                file_name = ydl.prepare_filename(info)
                file_path = os.path.join(DOWNLOAD_DIR, os.path.basename(file_name.strip()))
                
                # Clean filename for safe download
                clean_name = clean_filename(os.path.basename(file_name.strip()))
                
                # Check if file exists and return it directly for AUTO DOWNLOAD
                if os.path.exists(file_path):
                    logging.info(f"📁 File exists, returning for direct download: {file_path}")
                    
                    try:
                        # Read file content and return directly like Pinterest
                        with open(file_path, 'rb') as f:
                            file_content = f.read()
                        
                        # Clean up the file from server after reading
                        os.remove(file_path)
                        logging.info(f"🗑️ Cleaned up server file: {file_path}")
                        
                        # Return file content directly - AUTO DOWNLOAD! 
                        response = Response(
                            file_content,
                            mimetype='video/mp4',
                            headers={
                                'Content-Disposition': f'attachment; filename="{clean_name}"',
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Headers': 'Content-Type',
                                'Access-Control-Allow-Methods': 'POST, OPTIONS'
                            }
                        )
                        return response
                        
                    except Exception as e:
                        logging.error(f"❌ Failed to read/return file: {e}")
                        # Fallback to old method if direct download fails
                        return jsonify({
                            "file_name": clean_name, 
                            "file_url": f"/api/download/{clean_name}",
                            "success": True,
                            "message": "File ready for download (fallback mode)"
                        }), 200
                else:
                    logging.error(f"❌ Downloaded file not found: {file_path}")
                    return jsonify({"error": "Downloaded file not found", "success": False}), 404

    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return jsonify({"error": "An error occurred while processing the request", "details": str(e), "success": False}), 500

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
        return process_video_request(data, fast_mode=False)
    except Exception as e:
        logging.error(f"Download error: {e}")
        return jsonify({"error": "Processing failed", "details": str(e), "success": False}), 500

@app.route("/api/fast-video", methods=["POST", "OPTIONS"])
def fast_download_video():
    """Fast mode - returns video URL without conversion"""
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

        # Force fast mode for this endpoint
        data["fast_mode"] = True
        
        # Process video with fast mode enabled
        return process_video_request(data, fast_mode=True)

    except Exception as e:
        logging.error(f"Fast mode error: {e}")
        return jsonify({"error": "Fast mode processing failed", "details": str(e), "success": False}), 500

@app.route("/api/download/<filename>", methods=["GET"])
def download_file(filename):
    try:
        file_path = os.path.join(DOWNLOAD_DIR, filename)
        if not os.path.exists(file_path):
            return jsonify({"error": "File not found"}), 404
        
        response = send_from_directory(DOWNLOAD_DIR, filename, as_attachment=True)
        # Add CORS headers for file downloads
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        return response
    except Exception as e:
        logging.error(f"File download error: {e}")
        return jsonify({"error": str(e)}), 404

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True) 