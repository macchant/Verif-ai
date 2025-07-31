// app.js (Corrected Version)

// Select the important HTML elements
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const predictionList = document.getElementById('prediction-list');
const contentContainer = document.getElementById('content-container');
const loader = document.getElementById('loader');

let model; // Variable to hold the loaded AI model

// Main function to set up the application
async function setup() {
    loader.classList.remove('hidden');
    model = await mobilenet.load();
    loader.classList.add('hidden');
    document.querySelector('.uploader').classList.remove('hidden');
    console.log('Model loaded successfully!');
}

// Function to handle the image file upload
function handleImageUpload() {
    const file = imageUpload.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    // When the file is read, set it as the image source
    reader.onload = e => {
        imagePreview.src = e.target.result;
    };

    // This event listener is the key fix. It waits for the image to fully load.
    imagePreview.onload = async () => {
        contentContainer.classList.remove('hidden');
        predictionList.innerHTML = '<li>Analyzing...</li>';

        // Now that the image is loaded, we can safely classify it
        const predictions = await model.classify(imagePreview);

        predictionList.innerHTML = ''; // Clear "Analyzing..." message

        // Display the top 3 predictions
        predictions.slice(0, 3).forEach(prediction => {
            const li = document.createElement('li');
            const confidence = (prediction.probability * 100).toFixed(2);
            li.innerText = `${prediction.className} (${confidence}%)`;
            predictionList.appendChild(li);
        });
    };

    reader.readAsDataURL(file);
}

// Add event listener to the file input
imageUpload.addEventListener('change', handleImageUpload);

// Run the setup function when the script loads
setup();
