const checkedImages = [];  // Array to store selected images for slideshow
let currentSlideIndex = 0; // Track the current image being displayed in the slideshow

// Function to add an image to the checked images list
function addCheckedImage(imageUrl) {
    checkedImages.push(imageUrl);
    document.getElementById("checkedImageContainer").style.display = "block";
    showSlide(currentSlideIndex);
}

// Function to display the current slide in the slideshow
function showSlide(index) {
    const checkedImageSlideshow = document.getElementById("checkedImageSlideshow");
    checkedImageSlideshow.innerHTML = ""; // Clear previous image

    const imgElement = document.createElement("img");
    imgElement.src = checkedImages[index];
    imgElement.alt = `Slide ${index + 1}`;
    imgElement.style.width = "600px"; // Adjust the width as needed
    imgElement.style.height = "500px";
    checkedImageSlideshow.appendChild(imgElement);
}

// Function to move to the next slide
function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % checkedImages.length;
    showSlide(currentSlideIndex);
}

// Function to move to the previous slide
function prevSlide() {
    currentSlideIndex = (currentSlideIndex - 1 + checkedImages.length) % checkedImages.length;
    showSlide(currentSlideIndex);
}

// Event listeners for Next and Previous buttons
document.getElementById("nextBtn").addEventListener("click", nextSlide);
document.getElementById("prevBtn").addEventListener("click", prevSlide);

// Modify the generateMultipleImages function to add checkboxes and functionality for adding images to the slideshow
async function generateMultipleImages() {
    const prompt = inputTxt.value.trim();
    const numImages = parseInt(numImagesInput?.value, 10) || 1;

    if (!prompt) {
        alert("Please enter a prompt.");
        return;
    }

    if (isInappropriateContent(prompt)) {
        alert("Content not allowed. Please avoid using inappropriate or explicit terms.");
        return;
    }

    imageGallery.innerHTML = '';
    imageContainer.style.display = "block";
    multiButton.disabled = true;

    for (let i = 0; i < numImages; i++) {
        const imageWrapper = document.createElement("div");
        imageWrapper.style.textAlign = "center";
        imageWrapper.style.marginBottom = "20px";

        const loadingImage = document.createElement("img");
        loadingImage.src = loadingGifUrl;
        loadingImage.alt = "Loading...";
        loadingImage.style.width = "600px";
        loadingImage.style.height = "500px";
        imageWrapper.appendChild(loadingImage);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.display = "block";
        checkbox.style.margin = "10px auto";
        checkbox.onclick = () => {
            if (checkbox.checked) {
                addCheckedImage(imageUrl); // Add image to slideshow when checkbox is checked
            }
        };

        imageGallery.appendChild(imageWrapper);
        imageWrapper.appendChild(checkbox);

        const imageUrl = await query(prompt, true);
        if (imageUrl) {
            imageWrapper.removeChild(loadingImage);

            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = `Generated Image ${i + 1}`;
            imgElement.style.width = "500px";
            imgElement.style.height = "500px";
            imageWrapper.appendChild(imgElement);
        }
    }

    multiButton.disabled = false;
}
