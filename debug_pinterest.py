import requests
import json
from bs4 import BeautifulSoup
import re

def debug_pinterest_structure():
    test_url = "https://pin.it/7olTJ8aw4"
    
    print("🔍 Debugging Pinterest page structure...")
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
        response = requests.get(test_url, headers=headers, timeout=30)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        print(f"📄 Total HTML length: {len(response.text)} characters")
        
        # Tìm tất cả script tags
        scripts = soup.find_all("script")
        print(f"📜 Found {len(scripts)} script tags")
        
        # Tìm script có chứa dữ liệu video
        video_scripts = []
        for i, script in enumerate(scripts):
            if script.string:
                content = script.string.lower()
                if any(keyword in content for keyword in ['video', 'pin', 'pinterest', 'media', 'url']):
                    video_scripts.append((i, script))
                    print(f"📜 Script #{i+1} - Potential video data found")
                    print(f"   Content preview: {script.string[:300]}...")
        
        # Tìm meta tags có thể chứa video URL
        meta_tags = soup.find_all("meta")
        print(f"🏷️  Found {len(meta_tags)} meta tags")
        
        for meta in meta_tags:
            if meta.get('property') and 'video' in meta.get('property', '').lower():
                print(f"🎥 Video meta tag: {meta}")
        
        # Tìm link tags có thể chứa video
        link_tags = soup.find_all("link")
        print(f"🔗 Found {len(link_tags)} link tags")
        
        for link in link_tags:
            if link.get('rel') and 'video' in str(link.get('rel')).lower():
                print(f"🎥 Video link tag: {link}")
        
        # Tìm các div có thể chứa video player
        video_divs = soup.find_all("div", class_=re.compile(r'video|player|media', re.I))
        print(f"📺 Found {len(video_divs)} potential video divs")
        
        # Tìm tất cả source tags
        source_tags = soup.find_all("source")
        print(f"🎬 Found {len(source_tags)} source tags")
        
        for source in source_tags:
            print(f"🎬 Source: {source}")
        
        # Tìm tất cả video tags
        video_tags = soup.find_all("video")
        print(f"🎥 Found {len(video_tags)} video tags")
        
        for video in video_tags:
            print(f"🎥 Video tag: {video}")
            if video.get('src'):
                print(f"   Source: {video.get('src')}")
        
        # Tìm các script có chứa JSON data
        json_scripts = []
        for i, script in enumerate(scripts):
            if script.string and ('{' in script.string and '}' in script.string):
                try:
                    # Thử parse JSON
                    json.loads(script.string)
                    json_scripts.append((i, script))
                    print(f"📋 Script #{i+1} - Valid JSON found")
                except:
                    pass
        
        print(f"\n📊 Summary:")
        print(f"   - Total scripts: {len(scripts)}")
        print(f"   - Video-related scripts: {len(video_scripts)}")
        print(f"   - JSON scripts: {len(json_scripts)}")
        print(f"   - Video tags: {len(video_tags)}")
        print(f"   - Source tags: {len(source_tags)}")
        
        # Lưu HTML để phân tích offline
        with open('pinterest_debug.html', 'w', encoding='utf-8') as f:
            f.write(response.text)
        print(f"\n💾 HTML saved to 'pinterest_debug.html' for offline analysis")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    debug_pinterest_structure() 