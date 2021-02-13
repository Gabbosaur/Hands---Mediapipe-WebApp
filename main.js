const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
// canvasCtx.translate(1280, 0);
// canvasCtx.scale(-1, 1);

var isPolliceOpen = false;
var isIndiceOpen = false;
var isMedioOpen = false;
var isAnulareOpen = false;
var isMignoloOpen = false;

function gestureRec(landmarks) {

    if (typeof landmarks.multiHandLandmarks != "undefined") {

        isPolliceOpen = false;
        isIndiceOpen = false;
        isMedioOpen = false;
        isAnulareOpen = false;
        isMignoloOpen = false;

        var fixedKeypointPollice = landmarks.multiHandLandmarks[0][2].x;
        var fixedKeypointIndice = landmarks.multiHandLandmarks[0][5].y;
        var fixedKeypointMedio = landmarks.multiHandLandmarks[0][9].y;
        var fixedKeypointAnulare = landmarks.multiHandLandmarks[0][13].y;
        var fixedKeypointMignolo = landmarks.multiHandLandmarks[0][17].y;
        // console.log(fixedKeypointMedio);

        // Note that handedness is determined assuming the input image is mirrored.
        // i.e. taken with a front-facing/selfie camera with images flipped horizontally.
        // If it is not the case, please swap the handedness output in the application.
        // https://google.github.io/mediapipe/solutions/hands#javascript-solution-api

        if (landmarks.multiHandedness[0].label.localeCompare("Left") == 0) {
            document.getElementById("whichHand").innerHTML = "Destra";
            if (landmarks.multiHandLandmarks[0][3].x > fixedKeypointPollice && landmarks.multiHandLandmarks[0][4].x > fixedKeypointPollice) {
                isPolliceOpen = true;
            }
        } else {
            document.getElementById("whichHand").innerHTML = "Sinistra";
            if (landmarks.multiHandLandmarks[0][3].x < fixedKeypointPollice && landmarks.multiHandLandmarks[0][4].x < fixedKeypointPollice) {
                isPolliceOpen = true;
            }
        }



        if (landmarks.multiHandLandmarks[0][7].y < fixedKeypointIndice && landmarks.multiHandLandmarks[0][8].y < fixedKeypointIndice) {
            isIndiceOpen = true;
        }
        if (landmarks.multiHandLandmarks[0][11].y < fixedKeypointMedio && landmarks.multiHandLandmarks[0][12].y < fixedKeypointMedio) {
            isMedioOpen = true;
        }
        if (landmarks.multiHandLandmarks[0][15].y < fixedKeypointAnulare && landmarks.multiHandLandmarks[0][16].y < fixedKeypointAnulare) {
            isAnulareOpen = true;
        }
        if (landmarks.multiHandLandmarks[0][19].y < fixedKeypointMignolo && landmarks.multiHandLandmarks[0][20].y < fixedKeypointMignolo) {
            isMignoloOpen = true;
        }


        if (isPolliceOpen && isIndiceOpen && isMedioOpen && isAnulareOpen && isMignoloOpen) {
            document.getElementById("stampaMano").innerHTML = "Mano aperta";
        } else if (!isPolliceOpen && !isIndiceOpen && !isMedioOpen && !isAnulareOpen && !isMignoloOpen) {
            document.getElementById("stampaMano").innerHTML = "Mano chiusa";
        } else {
            document.getElementById("stampaMano").innerHTML = "Altro";
        }

    } else {
        document.getElementById("stampaMano").innerHTML = "Nessuna mano rilevata";
        document.getElementById("whichHand").innerHTML = "Nessuna mano rilevata";
    }


}

function onResults(results) {
    // console.log(results);
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                { color: '#00FF00', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
        }
    }
    gestureRec(results);
    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});
hands.setOptions({
    maxNumHands: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720,

});
camera.start();


// const times = [];
// let fps;

// function refreshLoop() {
//     window.requestAnimationFrame(() => {
//         const now = performance.now();
//         while (times.length > 0 && times[0] <= now - 1000) {
//             times.shift();
//         }
//         times.push(now);
//         fps = times.length;
//         document.getElementById("fps").innerHTML = fps;
//         refreshLoop();
//     });
// }

// refreshLoop();