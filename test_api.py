import requests
import json

def test_api():
    url = "https://video-downloader-38i3.onrender.com/api/video"
    
    # Test data
    test_url = "https://www.pinterest.com/pin/1234567890/"  # Example Pinterest URL
    
    payload = {
        "url": test_url
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    try:
        print("Testing API...")
        print(f"URL: {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")
        
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print("Success!")
            print(f"Response: {response.json()}")
        else:
            print("Error!")
            print(f"Response Text: {response.text}")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_api() 