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

        # Listen to all network responses with more patterns
        async def handle_response(response):
            url = response.url
            # Check multiple video patterns
            if any(pattern in url.lower() for pattern in ['.mp4', '.m3u8', 'video', 'media']):
                print(f"[NETWORK] Found potential video URL: {url}")
                video_urls.append(url)
        page.on("response", handle_response)

        print(f"🔗 Opening Pinterest pin: {pin_url}")
        await page.goto(pin_url, timeout=60000)
        await page.wait_for_timeout(3000)

        # Auto-scroll to trigger video loading
        print("📜 Auto-scrolling to trigger video loading...")
        for i in range(3):
            await page.evaluate("window.scrollBy(0, 500)")
            await page.wait_for_timeout(1000)
        
        # Try to click on video player if exists
        try:
            video_elements = await page.query_selector_all("video, [data-test-id*='video'], [class*='video']")
            if video_elements:
                print(f"🎥 Found {len(video_elements)} video elements, trying to interact...")
                for video in video_elements:
                    await video.click()
                    await page.wait_for_timeout(2000)
        except:
            pass

        # Inject JavaScript to extract video data from global variables
        print("🔧 Injecting JavaScript to extract video data...")
        js_result = await page.evaluate("""
            () => {
                const results = {};
                
                // Check for video in global variables
                if (window.__PWS_INITIAL_STATE__) {
                    results.pws_state = window.__PWS_INITIAL_STATE__;
                }
                
                // Check for video in any script tags
                const scripts = document.querySelectorAll('script');
                for (let script of scripts) {
                    if (script.textContent && script.textContent.includes('video')) {
                        results.script_content = script.textContent.substring(0, 500);
                    }
                }
                
                // Check for video elements and their sources
                const videos = document.querySelectorAll('video');
                results.video_elements = [];
                for (let video of videos) {
                    results.video_elements.push({
                        src: video.src,
                        currentSrc: video.currentSrc,
                        poster: video.poster
                    });
                }
                
                // Check for any elements with video URLs
                const allElements = document.querySelectorAll('*');
                for (let el of allElements) {
                    const attrs = ['src', 'href', 'data-src', 'data-href'];
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
        
        print("📊 JavaScript extraction results:")
        if js_result.get('pws_state'):
            print("✅ Found PWS state data")
            # Try to extract video from PWS state
            try:
                pws_data = js_result['pws_state']
                if isinstance(pws_data, str):
                    pws_data = json.loads(pws_data)
                # Navigate through the data structure
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
                    print(f"📹 Video src: {video['src']}")
                    video_urls.append(video['src'])
                if video.get('currentSrc'):
                    print(f"📹 Video currentSrc: {video['currentSrc']}")
                    video_urls.append(video['currentSrc'])
        
        if js_result.get('found_urls'):
            print(f"🔗 Found {len(js_result['found_urls'])} potential video URLs")
            for item in js_result['found_urls']:
                print(f"📹 {item['element']}.{item['attr']}: {item['value']}")
                video_urls.append(item['value'])

        # Try to find video in meta tags
        print("🔍 Scanning meta tags...")
        meta_videos = await page.evaluate("""
            () => {
                const metas = document.querySelectorAll('meta');
                const results = [];
                for (let meta of metas) {
                    const content = meta.getAttribute('content');
                    if (content && (content.includes('.mp4') || content.includes('video'))) {
                        results.push({
                            property: meta.getAttribute('property'),
                            name: meta.getAttribute('name'),
                            content: content
                        });
                    }
                }
                return results;
            }
        """)
        
        if meta_videos:
            print(f"🏷️ Found {len(meta_videos)} video meta tags")
            for meta in meta_videos:
                print(f"📹 Meta: {meta['property'] or meta['name']} = {meta['content']}")
                video_urls.append(meta['content'])

        await browser.close()
        
        # Filter and return the best video URL
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