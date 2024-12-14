// Lấy phần tử từ DOM
const pinUrlInput = document.getElementById('pin-url');
const downloadButton = document.getElementById('download-button');
const pinInfoDiv = document.getElementById('pin-info');

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

        // Gọi API hoặc xử lý tải từ mã nguồn mở
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

// Hàm lấy thông tin video từ URL
async function fetchVideoData(url) {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/video', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),  // Gửi URL video từ Pinterest
        });

        const data = await response.json();
        console.log('Video download response:', data); // Kiểm tra phản hồi từ server

        if (data.message) {
            alert(data.message);  // Hiển thị thông báo nếu tải thành công
        } else if (data.error) {
            alert('Error: ' + data.error);  // Hiển thị lỗi nếu có
        }

    } catch (error) {
        console.error('Error fetching data:', error);
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
    const downloadButton = document.getElementById('download-btn');

    // Kiểm tra nút tải có tồn tại không
    if (downloadButton) {
        downloadButton.addEventListener('click', function() {
            const videoUrl = document.getElementById('video-url').value;
            
            // Kiểm tra nếu URL trống
            if (!videoUrl) {
                alert('Please enter a video URL.');
                return;
            }
            
            // Xử lý tải video
            console.log(`Downloading from: ${videoUrl}`);
            
            // Hiển thị loader khi bắt đầu tải
            const loader = document.getElementById('loader');
            const message = document.getElementById('message');
            loader.style.display = "block";
            message.innerHTML = "";  // Xóa thông báo lỗi cũ

            fetch("http://127.0.0.1:5000/api/video", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "url": videoUrl })
            })
            .then(response => {
                if (response.ok) {
                    loader.style.display = "none";
                    message.innerHTML = "Download complete!";
                    message.style.color = "green";
                } else {
                    loader.style.display = "none";
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
