import requests
import os

def download_background():
    """
    Downloads a new background image and saves it to the front-end directory.
    """
    image_url = "https://images.unsplash.com/photo-1557683316-973673baf926"  # A beautiful gradient image from Unsplash
    save_path = os.path.join("front-end", "background.jpg")
    
    print("🌅 Downloading new background image...")
    
    try:
        # Create a streaming request to download the image
        response = requests.get(image_url, stream=True)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Save the image to the specified path
        with open(save_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        print(f"✅ Background image successfully downloaded and saved to '{save_path}'")
        return True
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error downloading the image: {e}")
        return False
    except IOError as e:
        print(f"❌ Error saving the image: {e}")
        return False

if __name__ == "__main__":
    download_background() 