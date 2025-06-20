document.addEventListener("DOMContentLoaded", function () {
    // Lấy phần tử từ DOM - CHỈ LẤY NHỮNG CÁI TỒN TẠI
    const downloadButton = document.getElementById('download-btn');
    const loader = document.getElementById('loader');
    const message = document.getElementById('message');
    const videoUrlInput = document.getElementById('video-url');
    const downloadContainer = document.getElementById('download-container');
    const downloadVideoBtn = document.getElementById('download-video-btn');

    // Kiểm tra nếu các phần tử tồn tại
    if (!downloadButton || !loader || !message || !videoUrlInput || !downloadContainer || !downloadVideoBtn) {
        console.error("One or more required DOM elements are missing.");
        return;
    }

    // Hàm kiểm tra URL Pinterest
    function validatePinterestUrl(url) {
        const regex = /^https:\/\/(www\.)?pinterest\.com\/pin\/\d+/;
        return regex.test(url);
    }

    // Hàm tải video với debug chi tiết
    async function downloadVideo(url) {
        loader.style.display = "block";
        message.innerHTML = "Processing video... Please wait...";
        message.style.color = "black";

        console.log("Starting download for URL:", url);

        try {
            const requestBody = { url: url };
            console.log("Request body:", requestBody);

            // Thử gọi API trực tiếp trước
            let response;
            try {
                console.log("Calling API directly...");
                response = await fetch("https://video-downloader-38i3.onrender.com/api/video", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                });
                console.log("Response status:", response.status);
                console.log("Response headers:", response.headers);
            } catch (corsError) {
                console.log("CORS error, trying with proxy...", corsError);
                // Fallback: dùng CORS proxy
                response = await fetch("https://cors-anywhere.herokuapp.com/https://video-downloader-38i3.onrender.com/api/video", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                });
            }
            
            // Kiểm tra response status
            if (!response.ok) {
                const text = await response.text();
                console.error("Error response:", text);
                throw new Error(`HTTP ${response.status}: ${text}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            loader.style.display = "none";

            if (data.success && data.file_url) {
                message.innerHTML = "Download ready! Click the button below.";
                message.style.color = "green";
                
                downloadContainer.style.display = "block";
                
                // Cập nhật link download
                downloadVideoBtn.href = data.file_url;
                downloadVideoBtn.setAttribute('download', data.file_name || 'pinterest_video.mp4');
                
                // Loại bỏ sự kiện onclick cũ để tránh xung đột
                downloadVideoBtn.onclick = null; 

                // Gợi ý: Có thể tự động click để tải ngay
                // downloadVideoBtn.click();

            } else {
                message.innerHTML = "Error: " + (data.details || data.error || "Unknown error");
                message.style.color = "red";
            }
        } catch (error) {
            loader.style.display = "none";
            message.innerHTML = "Error: " + error.message;
            message.style.color = "red";
            console.error("Download error:", error);
        }
    }

    // Xử lý sự kiện click cho nút tải
    downloadButton.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
            downloadVideo(url);
        } else {
            message.innerHTML = "Please enter a valid video URL!";
            message.style.color = "red";
        }
    });
});