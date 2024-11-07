const token = "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";
const inputTxt = document.getElementById("input");
const imageGallery1 = document.getElementById("imageGallery");
const imageGallery2 = document.getElementById("imageGallery2");
const multiButton = document.getElementById("multiBtn");
const voiceButton = document.getElementById("voiceBtn");
const enhanceButton = document.getElementById("enhanceBtn");
const imageContainer = document.getElementById("imageContainer");
const numImagesInput = document.getElementById("numImages");

const loadingGifUrl = "bakugo.gif";

// Keywords for filtering inappropriate content
const bannedKeywords = [
    "nudity", "explicit", "exploitation", "porn", "sexual", "adult", "erotic", 
    "fetish", "incest", "underage", "child", "pedo", "obscene", "nude", 
    "topless", "sex", "intercourse", "provocative", "lewd", "suggestive", 
    "strip", "x-rated", "NSFW", "sensual", "intimate", "seductive", 
    "exposed", "scantily clad", "provocative", "voyeur", "bdsm", 
    "lingerie", "underwear", "fetishism", "breasts", "genitals", 
    "buttocks", "orgasm", "arousal", "foreplay", "kink", "masturbation", 
    "penetration", "pornographic", "hardcore", "softcore", "taboo", 
    "escort", "naked", "bare"
];

// Determine which gallery to use based on the page
const imageGallery = imageGallery1 || imageGallery2;

async function query(prompt, unique = false) {
    const uniquePrompt = unique ? `${prompt} ${Date.now()}` : prompt;

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ "inputs": uniquePrompt }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.blob();
        return URL.createObjectURL(result);
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to generate image. Please try again.");
        return null;
    }
}

// Check for inappropriate content
function isInappropriateContent(prompt) {
    return bannedKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
}

// Generate multiple images function with content filter
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

        imageGallery.appendChild(imageWrapper);

        const imageUrl = await query(prompt, true);
        if (imageUrl) {
            imageWrapper.removeChild(loadingImage);

            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = `Generated Image ${i + 1}`;
            imgElement.style.width = "500px";
            imgElement.style.height = "500px";
            imageWrapper.appendChild(imgElement);

            // Container for buttons to center-align them below the image
            const buttonContainer = document.createElement("div");
            buttonContainer.style.display = "flex";
            buttonContainer.style.justifyContent = "center";
            buttonContainer.style.gap = "10px";
            buttonContainer.style.marginTop = "10px";

            const downloadButton = document.createElement("button");
            downloadButton.textContent = "Download";
            downloadButton.style.fontSize = "10px";
            downloadButton.onclick = () => downloadImage(imageUrl);

            const regenerateButton = document.createElement("button");
            regenerateButton.textContent = "Regenerate";
            regenerateButton.style.fontSize = "10px";
            regenerateButton.onclick = async () => {
                imgElement.src = loadingGifUrl;
                const newImageUrl = await query(prompt, true);
                if (newImageUrl) {
                    imgElement.src = newImageUrl;
                }
            };

            buttonContainer.appendChild(downloadButton);
            buttonContainer.appendChild(regenerateButton);
            imageWrapper.appendChild(buttonContainer);
        }
    }

    multiButton.disabled = false;
}

// Event listener setup
multiButton?.addEventListener("click", generateMultipleImages);

function startVoiceRecognition() {
    if (!("webkitSpeechRecognition" in window)) {
        alert("Your browser does not support speech recognition. Please try Chrome.");
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
        voiceButton.textContent = "🎤 Listening...";
        voiceButton.disabled = true;
    };

    recognition.onspeechend = () => {
        recognition.stop();
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputTxt.value = transcript;
        voiceButton.textContent = "🎤 Speak";
        voiceButton.disabled = false;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Error with speech recognition. Please try again.");
        voiceButton.textContent = "🎤 Speak";
        voiceButton.disabled = false;
    };

    recognition.onend = () => {
        voiceButton.textContent = "🎤 Speak";
        voiceButton.disabled = false;
    };

    recognition.start();
}

voiceButton?.addEventListener("click", startVoiceRecognition);

function downloadImage(imageUrl) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function enhancePrompt() {
    const basePrompt = inputTxt.value.trim();
    if (basePrompt) {
        const enhancedPrompt = `${basePrompt}, highly detailed, vibrant colors, in a professional style`;
        
        inputTxt.value = enhancedPrompt;
    } else {
        alert("Please enter a base description before enhancing.");
    }
}

enhanceButton?.addEventListener("click", enhancePrompt);
