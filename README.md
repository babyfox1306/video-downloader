# Pinterest Video Downloader

A web application for downloading videos from Pinterest. Built with Flask backend and vanilla JavaScript frontend.

## Features

- Download videos from Pinterest URLs
- Clean, modern UI
- Cross-origin resource sharing (CORS) support
- Error handling and fallback mechanisms

## Tech Stack

- **Backend**: Flask, yt-dlp
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Render.com (backend), Static hosting (frontend)

## Project Structure

```
video-downloader/
├── app.py              # Flask backend API
├── script.js           # Frontend JavaScript
├── index.html          # Main HTML page
├── style.css           # Styling
├── requirements.txt    # Python dependencies
├── cors-proxy.js       # Cloudflare Worker for CORS
└── README.md           # This file
```

## Setup

### Backend (Local Development)

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the Flask server:
```bash
python app.py
```

The server will run on `http://localhost:5000`

### Frontend

Open `index.html` in a web browser or serve it using a local server.

## API Endpoints

- `POST /api/video` - Download video from URL
- `GET /api/download/<filename>` - Download file
- `GET /ads.txt` - Serve ads.txt file

## Deployment

### Backend (Render.com)

1. Connect your GitHub repository to Render
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python app.py`
4. Deploy

### Frontend

Upload the frontend files to your static hosting provider.

## CORS Issues

If you encounter CORS issues, you can:

1. Use the provided Cloudflare Worker (`cors-proxy.js`)
2. Deploy the worker to Cloudflare Workers
3. Update the frontend to use the worker URL

## License

MIT License 