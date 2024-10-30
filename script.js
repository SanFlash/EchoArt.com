const token = "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";
const inputTxt = document.getElementById("input");
const image = document.getElementById("image");
const button = document.getElementById("btn");
const buttonDifferent = document.getElementById("btnDifferent");
const voiceButton = document.getElementById("voiceBtn");
const imageContainer = document.getElementById("imageContainer");
const downloadButton = document.getElementById("downloadBtn"); // Download button reference

async function query(unique = false) {
    try {
        image.src = "bakugo.gif";  // Placeholder image during generation
        imageContainer.style.display = "block";

        // Add a unique identifier (timestamp) to the prompt if generating a different image
        const prompt = unique ? `${inputTxt.value} ${Date.now()}` : inputTxt.value;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({ "inputs": prompt }),
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Convert response to a blob (image format)
        const result = await response.blob();
        return result;
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to generate image. Please try again.");
    }
}

// Button click to generate the image
button.addEventListener("click", async function () {
    const response = await query();
    if (response) {
        const objectURL = URL.createObjectURL(response);
        image.src = objectURL;
        buttonDifferent.style.display = "block"; // Show the Generate Different button after image generation
        downloadButton.style.display = "block"; // Show the Download button after image generation
        downloadButton.onclick = () => downloadImage(objectURL); // Set the download action
    }
});

// New button click to generate a different image
buttonDifferent.addEventListener("click", async function () {
    const response = await query(true); // Pass `true` to indicate a unique generation request
    if (response) {
        const objectURL = URL.createObjectURL(response);
        image.src = objectURL;
        downloadButton.onclick = () => downloadImage(objectURL); // Update download action with new image
    }
});

// Function to handle voice input
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
    };

    recognition.onspeechend = () => {
        recognition.stop();
        voiceButton.textContent = "🎤 Speak";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        inputTxt.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        alert("Error with speech recognition. Please try again.");
        voiceButton.textContent = "🎤 Speak";
    };

    recognition.start();
}

// Add event listener for the voice button
voiceButton.addEventListener("click", startVoiceRecognition);

// Function to download the generated image
function downloadImage(imageUrl) {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated_image.png"; // Default name for the downloaded image
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
