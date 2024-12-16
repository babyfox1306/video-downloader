// Lấy phần tử từ DOM
const pinUrlInput = document.getElementById('pin-url');
const downloadButton = document.getElementById('download-button');
const pinInfoDiv = document.getElementById('pin-info');
const loader = document.getElementById('loader');
const message = document.getElementById('message');
const videoUrlInput = document.getElementById('video-url');

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
        const response = await fetch("https://video-downloader-38i3.onrender.com/api/video", {
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

// Thêm sự kiện nút tải
downloadButton.addEventListener('click', () => {
    const url = pinUrlInput.value.trim();
    if (url) {
        fetchPinData(url);
    } else {
        pinInfoDiv.innerHTML = '<p>Please enter a valid Pinterest URL.</p>';
    }
});

// Chắc chắn rằng DOM đã được tải xong trước khi thực thi
document.addEventListener("DOMContentLoaded", function() {
    const videoUrlInput = document.getElementById('video-url');
    const downloadButton = document.getElementById('download-btn');
    const loader = document.getElementById('loader');
    const message = document.getElementById('message');
    const downloadContainer = document.getElementById('download-container');
    const downloadVideoBtn = document.getElementById('download-video-btn');

    // Kiểm tra nút tải có tồn tại không
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            const url = videoUrlInput.value.trim();
            
            // Kiểm tra nếu URL trống
            if (!url) {
                message.innerHTML = "Please enter a valid video URL!";
                message.style.color = "red";
                return;
            }
            
            // Hiển thị loader khi bắt đầu tải
            loader.style.display = "block";
            message.innerHTML = "";  // Xóa thông báo lỗi cũ
            downloadContainer.style.display = "none";  // Ẩn nút tải video

            fetch("https://video-downloader-38i3.onrender.com/api/video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "url": url })
            })
            .then(response => response.json())
            .then(data => {
                loader.style.display = "none";
                
                // Kiểm tra nếu video tải thành công
                if (data.file_url) {
                    message.innerHTML = "Download complete!";
                    message.style.color = "green";
                    
                    // Hiển thị nút tải video
                    downloadContainer.style.display = "block";
                    downloadVideoBtn.onclick = function() {
                        const link = document.createElement("a");
                        link.href = data.file_url; // Đảm bảo server trả về file URL
                        link.download = data.file_name; // Đặt tên file tự động
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    };
                } else {
                    message.innerHTML = "Failed to download. Please try again!";
                    message.style.color = "red";
                }
            })
            .catch(error => {
                loader.style.display = "none";
                message.innerHTML = "Error: " + error.message;
                message.style.color = "red";
            });
        });
    } else {
        console.error("Download button not found.");
    }
});