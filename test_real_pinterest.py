import requests
import json
from bs4 import BeautifulSoup
import re

def test_real_pinterest():
    # URL Pinterest video thật từ user
    test_url = "https://www.pinterest.com/pin/5136987070004686/"
    
    print("🔍 Testing Pinterest scraping with REAL URL...")
    print(f"URL: {test_url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
    }
    
    try:
        # 1. Lấy HTML từ Pinterest
        print("📡 Fetching Pinterest page...")
        response = requests.get(test_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        print(f"✅ Page fetched successfully! Status: {response.status_code}")
        print(f"📄 Content length: {len(response.text)} characters")
        
        # 2. Parse HTML
        print("🔧 Parsing HTML with BeautifulSoup...")
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 3. Tìm script chứa dữ liệu
        print("🔍 Looking for Pinterest data script...")
        data_script = soup.find("script", {"id": "__PWS_INITIAL_STATE__", "type": "application/json"})
        
        if data_script:
            print("✅ Found Pinterest data script!")
            print("🔧 Parsing JSON data...")
            json_data = json.loads(data_script.string)
            print("🎥 Extracting video URL...")
            if 'resourceResponses' in json_data:
                for resource in json_data['resourceResponses']:
                    if 'response' in resource and 'data' in resource['response']:
                        data = resource['response']['data']
                        if 'videos' in data and 'video_list' in data['videos']:
                            video_list = data['videos']['video_list']
                            print(f"📹 Available video qualities: {list(video_list.keys())}")
                            best_video = video_list.get('V_EXP7', video_list.get('V_720P', video_list.get('V_HLSV4', {})))
                            media_url = best_video.get('url')
                            if media_url:
                                print(f"✅ SUCCESS! Video URL found: {media_url}")
                                title = data.get('title', 'pinterest_video')
                                print(f"📝 Title: {title}")
                                return {
                                    "success": True,
                                    "video_url": media_url,
                                    "title": title,
                                    "qualities": list(video_list.keys())
                                }
            print("❌ Could not extract video URL from JSON data")
        else:
            print("❌ Could not find __PWS_INITIAL_STATE__ script")
            print("🔍 Scanning <meta> tags for video URLs...")
            meta_tags = soup.find_all('meta')
            found_video = False
            for meta in meta_tags:
                prop = meta.get('property', '') + meta.get('name', '')
                content = meta.get('content', '')
                if 'video' in prop.lower() or ('.mp4' in content):
                    print(f"🎥 Found video meta: {meta}")
                    if content.startswith('http') and '.mp4' in content:
                        print(f"✅ Video URL: {content}")
                        found_video = True
            if not found_video:
                print("🔍 Scanning <script> tags for video URLs...")
                scripts = soup.find_all('script')
                for i, script in enumerate(scripts):
                    if script.string and ('.mp4' in script.string or 'video' in script.string.lower()):
                        print(f"📜 Script #{i+1} may contain video URL!")
                        preview = script.string[:300]
                        print(f"   Content preview: {preview}")
                        # Try to extract .mp4 URLs
                        urls = re.findall(r'https?://[^\s"\']+\.mp4', script.string)
                        for url in urls:
                            print(f"✅ Found video URL in script: {url}")
                        if urls:
                            found_video = True
            if not found_video:
                print("❌ No video URL found in <meta> or <script> tags.")
            return False
        return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Network error: {e}")
        return False
    except json.JSONDecodeError as e:
        print(f"❌ JSON parsing error: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    result = test_real_pinterest()
    if result:
        print("\n🎉 SUCCESS! Video extraction completed!")
        print(f"📹 Video URL: {result['video_url']}")
        print(f"📝 Title: {result['title']}")
        print(f"🎯 Available qualities: {result['qualities']}")
    else:
        print("\n❌ FAILED! Could not extract video.") 