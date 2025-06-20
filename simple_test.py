import requests

print("Testing Pinterest connection...")
try:
    r = requests.get('https://www.pinterest.com', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
    print(f"Status: {r.status_code}")
    print("Connection successful!")
except Exception as e:
    print(f"Error: {e}") 