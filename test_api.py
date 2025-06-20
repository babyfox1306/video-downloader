import requests
import json

def test_api():
    url = "https://video-downloader-38i3.onrender.com/api/video"
    data = {"url": "https://www.pinterest.com/pin/1234567890123456789/"}
    headers = {"Content-Type": "application/json"}
    
    print("Testing deployed API...")
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_api() 