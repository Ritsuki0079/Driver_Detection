const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const DemoView = document.getElementById('demo');
const enableWebcamButton = document.getElementById('Camerabutton');

// Check if webcam access is supported by the user's browser.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  // Add an event listener to button for when the user
  // wants to activate the camera to call enableCam function.
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }
  
  // Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the model loaded successfully.
    if (!model) {
      return;
    }
    
    // Hide the button once clicked.
    event.target.classList.add('removed');  
    
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true
    };
  
    // Enable camera streaming.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
  }
// Load the model.
var model = undefined;

 async function loadmodel() {
   console.log( "Loading model..." );
 	 const model = await tf.loadGraphModel('model.json');
 	 console.log( "Model loaded." );
   console.log(model)
   DemoView.classList.remove('hide');
 };

 model = loadmodel();
 

var Arr = [];

function predictWebcam() {
  // Classify a frame in the camera stream.
  model.predict(video).then(function (predictions) {
    // Remove the bounding box in the previous frame.
    for (let i = 0; i < Arr.length; i++) {
      liveView.removeChild(Arr[i]);
    }
    Arr.splice(0);
    
    // Loop the predictions and draw them to camera in the website.
    for (let n = 0; n < predictions.length; n++) {
      // If the prediction accuacy is over 50% then draw the bounding box.
      if (predictions[n].score > 0.5) {
        const p = document.createElement('p');
        p.innerText = predictions[n].class  + ' - with ' 
            + Math.round(parseFloat(predictions[n].score) * 100) 
            + '% confidence.';
        p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
            + (predictions[n].bbox[1] - 10) + 'px; width: ' 
            + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

        const highlighter = document.createElement('div');
        highlighter.setAttribute('class', 'highlighter');
        highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
            + predictions[n].bbox[1] + 'px; width: ' 
            + predictions[n].bbox[2] + 'px; height: '
            + predictions[n].bbox[3] + 'px;';

        liveView.appendChild(highlighter);
        liveView.appendChild(p);
        Arr.push(highlighter);
        Arr.push(p);
      }
    }
    
    // Predict again when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}