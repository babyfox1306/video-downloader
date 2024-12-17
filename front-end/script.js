document.addEventListener("DOMContentLoaded", function () {
    // Lấy phần tử từ DOM
    const pinUrlInput = document.getElementById('pin-url');
    const downloadButton = document.getElementById('download-btn');
    const pinInfoDiv = document.getElementById('pin-info');
    const loader = document.getElementById('loader');
    const message = document.getElementById('message');
    const videoUrlInput = document.getElementById('video-url');
    const downloadContainer = document.getElementById('download-container');
    const downloadVideoBtn = document.getElementById('download-video-btn');
    const progressBar = document.getElementById("progress");
    const progressContainer = document.getElementById("progress-container");
    const fileNameElement = document.getElementById("file-name");
    const downloadLink = document.getElementById("download-link");

    // Kiểm tra nếu các phần tử tồn tại
    if (!downloadButton || !pinUrlInput || !pinInfoDiv || !loader || !message || !videoUrlInput || !downloadContainer || !downloadVideoBtn || !progressBar || !progressContainer || !fileNameElement || !downloadLink) {
        console.error("One or more required DOM elements are missing.");
        return;
    }

    // Hàm kiểm tra URL Pinterest
    function validatePinterestUrl(url) {
        const regex = /^https:\/\/(www\.)?pinterest\.com\/pin\/\d+/;
        return regex.test(url);
    }

    // Hàm lấy thông tin pin và tải video
    async function fetchPinData(url) {
        try {
            if (!validatePinterestUrl(url)) {
                throw new Error('Invalid Pinterest URL!');
            }

            pinInfoDiv.innerHTML = '<p>Fetching data...</p>';

            const response = await fetch('/download-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await response.json();

            if (data.success) {
                pinInfoDiv.innerHTML = `
                    <h2>${data.title}</h2>
                    <img src="${data.thumbnail}" alt="Pin thumbnail">
                    <a href="${data.downloadLink}" download>Download Video</a>
                `;
            } else {
                throw new Error(data.message || 'Error downloading pin');
            }
        } catch (error) {
            console.error('Error fetching pin data:', error);
            pinInfoDiv.innerHTML = `<p>${error.message}</p>`;
        }
    }

    // Hàm tải video
    async function downloadVideo(url) {
        loader.style.display = "block";
        message.innerHTML = "";  // Xóa thông báo lỗi cũ

        try {
            const response = await fetch("https://cors-anywhere.herokuapp.com/https://video-downloader-38i3.onrender.com/api/video", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            });
            const data = await response.json();

            loader.style.display = "none";

            if (data.file_url) {
                message.innerHTML = "Download complete!";
                message.style.color = "green";

                // Tạo liên kết tải về tự động
                const link = document.createElement("a");
                link.href = data.file_url; // Đảm bảo server trả về file URL
                link.download = data.file_name; // Đặt tên file tự động
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                message.innerHTML = "Failed to download. Please try again!";
                message.style.color = "red";
            }
        } catch (error) {
            loader.style.display = "none";
            message.innerHTML = "Error: " + error.message;
            message.style.color = "red";
        }
    }

    // Xử lý sự kiện click cho nút tải
    document.getElementById("download-btn").addEventListener("click", function () {
        const url = document.getElementById("video-url").value;
        const loader = document.getElementById("loader");
        const message = document.getElementById("message");
        const progressBar = document.getElementById("progress");
        const progressContainer = document.getElementById("progress-container");
        const downloadContainer = document.getElementById("download-section");
        const fileNameElement = document.getElementById("file-name");
        const downloadLink = document.getElementById("download-link");

        // Reset UI
        loader.style.display = "none";
        message.innerHTML = "";
        downloadContainer.style.display = "none";
        progressContainer.style.display = "block";
        progressBar.value = 0;

        // Validate URL
        if (!url) {
            progressContainer.style.display = "none";
            message.innerHTML = "Please enter a valid video URL!";
            message.style.color = "red";
            return;
        }

        // Show loading spinner
        loader.style.display = "block";

        // Create XMLHttpRequest to track progress
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://video-downloader-38i3.onrender.com/api/video", true);
        xhr.setRequestHeader("Content-Type", "application/json");

        // Track upload progress
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                progressBar.value = percentComplete;
            }
        };

        // Handle response
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                progressContainer.style.display = "none";
                loader.style.display = "none";

                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    message.innerHTML = "Download ready!";
                    message.style.color = "green";

                    const encodedFileName = encodeURIComponent(response.file_name);
                    fileNameElement.innerHTML = `File: ${response.file_name}`;
                    downloadLink.href = `https://video-downloader-38i3.onrender.com/api/download/${encodedFileName}`;
                    downloadContainer.style.display = "block";

                    // Auto download the file
                    const link = document.createElement("a");
                    link.href = downloadLink.href;
                    link.download = response.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    const errorResponse = JSON.parse(xhr.responseText);
                    message.innerHTML = `Error: ${errorResponse.error || "Failed to download video."}`;
                    message.style.color = "red";
                }
            }
        };

        // Send request with video URL
        xhr.send(JSON.stringify({ url: url }));
    });
});