import requests
import time

def check_deploy():
    url = "https://video-downloader-38i3.onrender.com/api/video"
    data = {"url": "https://www.pinterest.com/pin/1234567890123456789/"}
    headers = {"Content-Type": "application/json"}
    
    print("🔍 Checking deployment status...")
    print("⏳ Waiting for deployment to complete...")
    
    for i in range(5):  # Thử 5 lần
        try:
            print(f"Attempt {i+1}/5...")
            response = requests.post(url, json=data, headers=headers, timeout=30)
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
            # Nếu không còn lỗi "Missing API Key", có nghĩa là deploy thành công
            if "Missing API Key" not in response.text:
                print("✅ New deployment is working!")
                return True
            else:
                print("⏳ Still using old version, waiting...")
                time.sleep(30)  # Đợi 30 giây
                
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(30)
    
    print("❌ Deployment might still be in progress or failed")
    return False

if __name__ == "__main__":
    check_deploy() 