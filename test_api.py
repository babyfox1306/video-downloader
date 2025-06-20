import requests
import json

def test_api():
    url = "http://127.0.0.1:5000/api/video"
    data = {"url": "https://www.pinterest.com/pin/5136987070004686/"}
    headers = {"Content-Type": "application/json"}
    
    print("Testing updated Flask API with Playwright...")
    try:
        response = requests.post(url, json=data, headers=headers, timeout=60)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                print("✅ SUCCESS! Video extracted successfully!")
                print(f"📹 Video URL: {result.get('file_url')}")
                print(f"📝 File name: {result.get('file_name')}")
            else:
                print("❌ API returned success=false")
        else:
            print("❌ API request failed")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api() 