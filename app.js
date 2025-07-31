// Select the important HTML elements
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const predictionList = document.getElementById('prediction-list');
const contentContainer = document.getElementById('content-container');
const loader = document.getElementById('loader');

let model; // Variable to hold the loaded AI model

// Main function to set up the application
async function setup() {
    // Show the loader while the model is loading
    loader.classList.remove('hidden');

    // Load the pre-trained MobileNet model from TensorFlow.js
    model = await mobilenet.load();
    
    // Hide the loader and show the uploader once the model is ready
    loader.classList.add('hidden');
    document.querySelector('.uploader').classList.remove('hidden');

    console.log('Model loaded successfully!');
}

// Function to predict the content of an image
async function predictImage() {
    // Get the uploaded file
    const file = imageUpload.files[0];
    if (!file) {
        return; // Exit if no file is selected
    }

    // Show the main content area and display the image preview
    contentContainer.classList.remove('hidden');
    const reader = new FileReader();
    reader.onload = e => {
        imagePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);

    // Clear previous results
    predictionList.innerHTML = '<li>Analyzing...</li>';

    // Use the model to classify the image
    const predictions = await model.classify(imagePreview);
    
    // Clear the 'Analyzing...' message
    predictionList.innerHTML = '';

    // Display the top 3 predictions
    predictions.slice(0, 3).forEach(prediction => {
        // Create a new list item for each prediction
        const li = document.createElement('li');
        const confidence = (prediction.probability * 100).toFixed(2);
        li.innerText = `${prediction.className} (${confidence}%)`;
        predictionList.appendChild(li);
    });
}

// Add an event listener to the file input. When the user selects a file, run predictImage().
imageUpload.addEventListener('change', predictImage);

// Run the setup function when the script loads
setup();
