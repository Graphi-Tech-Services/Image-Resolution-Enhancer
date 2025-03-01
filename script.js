document.getElementById("upload").addEventListener("change", handleImage);
document.getElementById("download").addEventListener("click", downloadImage);

document.getElementById("drop-area").addEventListener("dragover", allowDrag);
document.getElementById("drop-area").addEventListener("drop", handleDrop);

document.getElementById("brightness").addEventListener("input", updateImage);
document.getElementById("contrast").addEventListener("input", updateImage);

document.getElementById("scale").addEventListener("change", updateImage);
document.getElementById("quality").addEventListener("input", updateImage);

document.getElementById("format").addEventListener("change", updateImage);

let originalImage = new Image();

function allowDrag(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleImage({ target: { files: [file] } });
}

function handleImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            originalImage.src = e.target.result;
            originalImage.onload = function () {
                drawImage(originalImage, "originalCanvas");
                updateImage();
            };
        };
        reader.readAsDataURL(file);
    }
}

function drawImage(img, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
}

function updateImage() {
    if (!originalImage.src) return;
    
    const scale = parseFloat(document.getElementById("scale").value);
    const quality = parseFloat(document.getElementById("quality").value);
    const format = document.getElementById("format").value;
    const brightness = document.getElementById("brightness").value;
    const contrast = document.getElementById("contrast").value;
    
    const enhancedCanvas = document.getElementById("enhancedCanvas");
    const ctx = enhancedCanvas.getContext("2d");
    
    enhancedCanvas.width = originalImage.width * scale;
    enhancedCanvas.height = originalImage.height * scale;
    
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    ctx.drawImage(originalImage, 0, 0, enhancedCanvas.width, enhancedCanvas.height);
    
    const sizeChange = ((enhancedCanvas.width * enhancedCanvas.height) / (originalImage.width * originalImage.height) * 100) - 100;
    document.getElementById("changePercentage").textContent = `Resolution Increased by ${sizeChange.toFixed(2)}%`;
}

function downloadImage() {
    const enhancedCanvas = document.getElementById("enhancedCanvas");
    if (!enhancedCanvas || enhancedCanvas.width === 0) {
        alert("Please upload and process an image before downloading.");
        return;
    }
    
    const format = document.getElementById("format").value;
    const quality = parseFloat(document.getElementById("quality").value);
    
    const link = document.createElement("a");
    link.download = `high_res_image.${format.split("/")[1]}`;
    link.href = enhancedCanvas.toDataURL(format, quality);
    link.click();
}