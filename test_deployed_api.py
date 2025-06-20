import requests
import json

def test_deployed_api(pinterest_url=None):
    if not pinterest_url:
        print("⚠️  Please provide a real Pinterest video URL to test!")
        return
    
    url = "https://video-downloader-38i3.onrender.com/api/video"
    data = {"url": pinterest_url}
    headers = {"Content-Type": "application/json"}
    
    print("🔍 Testing deployed API with Pinterest URL...")
    print(f"URL: {pinterest_url}")
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=30)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print("✅ SUCCESS! Video extracted successfully!")
                print(f"Video URL: {result.get('file_url')}")
                print(f"File Name: {result.get('file_name')}")
                return True
            else:
                print("❌ API returned success=false")
                return False
        else:
            print(f"❌ API returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🎯 Deployed API Test")
    print("=" * 40)
    print("Để test với URL thật, hãy gọi:")
    print("test_deployed_api('URL_PINTEREST_CỦA_BẠN')")
    print("=" * 40)
    
    # Ví dụ test với URL mẫu (sẽ fail vì không phải URL thật)
    test_deployed_api("https://www.pinterest.com/pin/1234567890123456789/") 