import requests
import json
from bs4 import BeautifulSoup
import re

def test_pinterest_scraping(test_url=None):
    if not test_url:
        # URL mẫu - bạn có thể thay đổi URL này
        test_url = "https://www.pinterest.com/pin/1234567890123456789/"
        print("⚠️  Using sample URL. Please provide a real Pinterest video URL for testing!")
    
    print("🔍 Testing Pinterest scraping logic...")
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
        print("📡 Fetching page...")
        response = requests.get(test_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        print(f"Status Code: {response.status_code}")
        print(f"Content Length: {len(response.text)} characters")
        
        # 2. Parse HTML
        print("🔧 Parsing HTML...")
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 3. Tìm script chứa dữ liệu
        print("🔍 Looking for data script...")
        data_script = soup.find("script", {"id": "__PWS_INITIAL_STATE__", "type": "application/json"})
        
        if data_script:
            print("✅ Found data script!")
            json_data = json.loads(data_script.string)
            
            # 4. Trích xuất video URL
            print("🎬 Extracting video URL...")
            try:
                video_list = json_data['resourceResponses'][0]['response']['data']['videos']['video_list']
                best_video = video_list.get('V_EXP7', video_list.get('V_720P', video_list.get('V_HLSV4', {})))
                media_url = best_video.get('url')
                
                if media_url:
                    print(f"✅ SUCCESS! Video URL: {media_url}")
                    return True
                else:
                    print("❌ No video URL found in data")
                    print("Available video formats:", list(video_list.keys()))
                    return False
            except (KeyError, IndexError) as e:
                print(f"❌ Error extracting video data: {e}")
                print("JSON structure might be different than expected")
                return False
        else:
            print("❌ Could not find data script")
            # Tìm tất cả script tags để debug
            scripts = soup.find_all("script")
            print(f"Found {len(scripts)} script tags")
            for i, script in enumerate(scripts[:5]):  # Chỉ in 5 script đầu
                print(f"Script {i}: {script.get('id', 'No ID')} - {script.get('type', 'No type')}")
            return False
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out")
        return False
    except requests.exceptions.HTTPError as e:
        print(f"❌ HTTP Error: {e}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    # Bạn có thể thay đổi URL này để test với URL Pinterest video thật
    test_url = "https://www.pinterest.com/pin/1234567890123456789/"
    
    print("🎯 Pinterest Video Scraper Test")
    print("=" * 40)
    print("Để test với URL thật, hãy thay đổi biến test_url trong script này")
    print("hoặc gọi hàm: test_pinterest_scraping('URL_PINTEREST_CỦA_BẠN')")
    print("=" * 40)
    
    test_pinterest_scraping(test_url) 