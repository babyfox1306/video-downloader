document.addEventListener("DOMContentLoaded", function () {
    // Lấy các phần tử cần thiết từ DOM
    const downloadButton = document.getElementById('download-btn');
    const videoUrlInput = document.getElementById('video-url');
    const loader = document.getElementById('loader');
    const message = document.getElementById('message');
    const downloadContainer = document.getElementById('download-container');
    const downloadLink = document.getElementById('download-link');
    const showInstructionsBtn = document.getElementById('show-instructions');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeInstructionsBtn = document.getElementById('close-instructions');
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress');

    // Kiểm tra các phần tử có tồn tại không
    if (!downloadButton || !videoUrlInput || !loader || !message || !downloadContainer || !downloadLink || !progressContainer || !progressBar) {
        console.error("One or more required DOM elements are missing.");
        return;
    }

    // Hàm gọi API để tải video
    async function downloadVideo(url) {
        // Reset UI
        loader.style.display = 'block';
        message.textContent = 'Processing, please wait...';
        message.style.color = '#333';
        downloadContainer.style.display = 'none';
        progressContainer.style.display = 'none';
        progressBar.value = 0;

        try {
            const response = await fetch("https://video-downloader-38i3.onrender.com/api/video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ url: url }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Unknown server error", details: response.statusText }));
                throw new Error(errorData.details || errorData.error);
            }

            const data = await response.json();

            if (data.success && data.file_url) {
                message.textContent = 'Download ready!';
                message.style.color = 'green';

                downloadLink.href = data.file_url;
                downloadLink.setAttribute('download', data.file_name || 'video.mp4');
                document.getElementById('file-name').textContent = `File: ${data.file_name || 'video.mp4'}`;
                downloadContainer.style.display = 'block';

                // Tự động click để tải về
                downloadLink.click();
            } else {
                throw new Error(data.details || data.error || "Failed to get download link.");
            }

        } catch (error) {
            message.textContent = `Error: ${error.message}`;
            message.style.color = 'red';
            console.error('Download error:', error);
        } finally {
            loader.style.display = 'none';
        }
    }

    // Gắn sự kiện cho nút Download
    downloadButton.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (url) {
            downloadVideo(url);
        } else {
            message.textContent = "Please enter a valid video URL!";
            message.style.color = "red";
        }
    });

    // Xử lý modal hướng dẫn
    if (showInstructionsBtn && instructionsModal && closeInstructionsBtn) {
        showInstructionsBtn.addEventListener('click', () => {
            instructionsModal.style.display = 'flex';
        });

        closeInstructionsBtn.addEventListener('click', () => {
            instructionsModal.style.display = 'none';
        });
    }
});