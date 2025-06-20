import asyncio
from playwright.async_api import async_playwright
import re
import json

PIN_URL = "https://www.pinterest.com/pin/5136987070004686/"

async def extract_video_url(pin_url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()
        video_urls = []

        # Listen to all network responses
        async def handle_response(response):
            url = response.url
            if any(pattern in url.lower() for pattern in ['.mp4', '.m3u8', 'video', 'media']):
                print(f"[NETWORK] Found video URL: {url}")
                video_urls.append(url)
        page.on("response", handle_response)

        print(f"🔗 Opening Pinterest pin: {pin_url}")
        await page.goto(pin_url, timeout=60000)
        await page.wait_for_timeout(3000)

        # Auto-scroll to trigger video loading
        print("📜 Auto-scrolling...")
        for i in range(3):
            await page.evaluate("window.scrollBy(0, 500)")
            await page.wait_for_timeout(1000)

        # Try to click on video elements
        try:
            video_elements = await page.query_selector_all("video, [data-test-id*='video']")
            if video_elements:
                print(f"🎥 Found {len(video_elements)} video elements")
                for video in video_elements:
                    await video.click()
                    await page.wait_for_timeout(2000)
        except:
            pass

        # Extract data with JavaScript
        print("🔧 Extracting data with JavaScript...")
        js_result = await page.evaluate("""
            () => {
                const results = {};
                
                // Check PWS state
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
                
                // Check all elements for video URLs
                const allElements = document.querySelectorAll('*');
                for (let el of allElements) {
                    const attrs = ['src', 'href', 'data-src'];
                    for (let attr of attrs) {
                        const value = el.getAttribute(attr);
                        if (value && (value.includes('.mp4') || value.includes('video'))) {
                            results.found_urls = results.found_urls || [];
                            results.found_urls.push({element: el.tagName, attr: attr, value: value});
                        }
                    }
                }
                
                return results;
            }
        """)

        # Process JavaScript results
        if js_result.get('pws_state'):
            print("✅ Found PWS state data")
            try:
                pws_data = js_result['pws_state']
                if isinstance(pws_data, str):
                    pws_data = json.loads(pws_data)
                if 'resourceResponses' in pws_data:
                    for resource in pws_data['resourceResponses']:
                        if 'response' in resource and 'data' in resource['response']:
                            data = resource['response']['data']
                            if 'videos' in data:
                                print("🎥 Found videos in PWS state!")
                                video_list = data['videos'].get('video_list', {})
                                for quality, video_data in video_list.items():
                                    if isinstance(video_data, dict) and 'url' in video_data:
                                        url = video_data['url']
                                        print(f"📹 {quality}: {url}")
                                        video_urls.append(url)
            except Exception as e:
                print(f"❌ Error parsing PWS state: {e}")

        if js_result.get('video_elements'):
            print(f"🎬 Found {len(js_result['video_elements'])} video elements")
            for video in js_result['video_elements']:
                if video.get('src'):
                    video_urls.append(video['src'])
                if video.get('currentSrc'):
                    video_urls.append(video['currentSrc'])

        if js_result.get('found_urls'):
            print(f"🔗 Found {len(js_result['found_urls'])} potential video URLs")
            for item in js_result['found_urls']:
                video_urls.append(item['value'])

        await browser.close()
        
        # Filter and return best video URL
        filtered_urls = []
        for url in video_urls:
            if url and url.startswith('http') and any(ext in url.lower() for ext in ['.mp4', '.m3u8', 'video']):
                filtered_urls.append(url)
        
        return filtered_urls[0] if filtered_urls else None

if __name__ == "__main__":
    video_url = asyncio.run(extract_video_url(PIN_URL))
    if video_url:
        print(f"\n🎉 SUCCESS! Video URL: {video_url}")
    else:
        print("\n❌ FAILED! Could not extract video URL.") 