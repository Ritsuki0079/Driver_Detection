const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');
const enableWebcamButton = document.getElementById('webcamButton');

// Check if webcam access is supported.
function getUserMediaSupported() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }
  
  // If webcam supported, add event listener to button for when user
  // wants to activate it to call enableCam function which we will 
  // define in the next step.
  if (getUserMediaSupported()) {
    enableWebcamButton.addEventListener('click', enableCam);
  } else {
    console.warn('getUserMedia() is not supported by your browser');
  }
  
  // Enable the live webcam view and start classification.
function enableCam(event) {
    // Only continue if the COCO-SSD has finished loading.
    if (!model) {
      return;
    }
    
    // Hide the button once clicked.
    event.target.classList.add('removed');  
    
    // getUsermedia parameters to force video but not audio.
    const constraints = {
      video: true
    };
  
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      video.srcObject = stream;
      video.addEventListener('loadeddata', predictWebcam);
    });
  }

// Store the resulting model in the global scope of our app.
// ********
var model = undefined;

 async function loadmodel() {
   console.log( "Loading model..." );
 	const model = await tf.loadGraphModel('model.json');
 	console.log( "Model loaded." );
   console.log(model)
   demosSection.classList.remove('invisible');
 };

 model = loadmodel();


// ***********************

 //var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment 
// to get everything needed to run.
// Note: cocoSsd is an external object loaded from our index.html
// script tag import so ignore any warning in Glitch.

//  cocoSsd.load().then(function (loadedModel) {
  // model = loadedModel;
// Show demo section now model is ready to use.
  //  demosSection.classList.remove('invisible');
//  });

var children = [];

function predictWebcam() {
  // Now let's start classifying a frame in the stream.
  //model.detect(video) or predict ?
  model.detect(video).then(function (predictions) {
    // Remove any highlighting we did previous frame.
    for (let i = 0; i < children.length; i++) {
      liveView.removeChild(children[i]);
    }
    children.splice(0);
    
    // Now lets loop through predictions and draw them to the live view if
    // they have a high confidence score.
    for (let n = 0; n < predictions.length; n++) {
      // If we are over 66% sure we are sure we classified it right, draw it!
      if (predictions[n].score > 0.66) {
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
        children.push(highlighter);
        children.push(p);
      }
    }
    
    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(predictWebcam);
  });
}

// The following are GPS function test:

function showLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  alert("Latitude : " + latitude + " Longitude: " + longitude);
}

function errorHandler(err) {
  if(err.code == 1) {
     alert("Error: Access is denied!");
  } else if( err.code == 2) {
     alert("Error: Position is unavailable!");
  }
}

function getLocation() {

  if(navigator.geolocation) {
     
     // timeout at 60000 milliseconds (60 seconds)
     var options = {timeout:60000};
     navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
  } else {
     alert("Sorry, browser does not support geolocation!");
  }
}

// test another
var x = document.getElementById("demo");

function test_getlocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(test_showPosition) 
      console.log(location.coords.latitude);
      console.log(location.coords.longitude);
      console.log(location.coords.accuracy);
    } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function test_showPositionposition() {
  x.innerHTML = "Latitude: " + location.coords.latitude + 
  "<br>Longitude: " + location.coords.longitude;
}

// mozilla geolocationAPI code

var id, target, options;

function success(pos) {
  var crd = pos.coords;

  if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
    console.log('Congratulations, you reached the target');
    navigator.geolocation.clearWatch(id);
  }
  alert("Lat is :" + crd.latitude + "Long is :" + crd.longitude + "Acc is:" + crd.accuracy)
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

target = {
  latitude : 0,
  longitude: 0
};

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

id = navigator.geolocation.watchPosition(success, error, options);

alert(id);

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  alert("Lat is :" + crd.latitude + "Long is :" + crd.longitude + "Acc is:" + crd.accuracy)
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

test = navigator.geolocation.getCurrentPosition(success, error, options);

