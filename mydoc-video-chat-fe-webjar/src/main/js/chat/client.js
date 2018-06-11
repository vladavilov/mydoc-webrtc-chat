var msgInput = document.querySelector('#msgInput'),
    sendMsgBtn = document.querySelector('#sendMsgBtn'),
    startVideoButton = document.querySelector('#startVideo'),
    videoContainer = document.querySelector('#video'),
    selfVideoContainer = document.querySelector('#selfVideo'),
    chatArea = document.querySelector('#chatarea'),

    handlers = {
        initSocketConnection: function () {
            socketConnection.sendLogin(currentUser, peerLink);
        },
        handleLogin: function (payload) {
            // TODO: implement red and green indicator
            if (payload.peerConnected) {
                webRtcConnector.initCommunicationWith(payload.peerLink);
            }
        },
        handleOffer: function (offer) {
            webRtcConnector.acceptCommunicationWith(offer);
        },
        handleAnswer: function (answer) {
            webRtcConnector.acceptAnswer(answer);
        },
        handleCandidate: function (candidate) {
            webRtcConnector.acceptIceCandidate(candidate);
        },
        handleLeave: function () {
            webRtcConnector.closeConnection();
        },
        handleError: function (err) {
            alert("Unexpected error occurred: " + err);
        },
        acceptIncomingVideo: function (stream) {
            if (!selfStream) {
                startVideoStream();
            }
            videoContainer.src = window.URL.createObjectURL(stream);
            videoContainer.play();
            selfVideoContainer.src = window.URL.createObjectURL(selfStream);
            selfVideoContainer.play();
        },
        addTextMessage: function (message, self) {
            var name;
            if (self) {
                name = isPatient == "true" ? patientName : docName;
            } else {
                // TODO: think about string to boolean
                name = isPatient == "true" ? docName : patientName;
            }

            chatArea.innerHTML += name + ": " + message + "<br />";
        }
    },
    socketConnection = new WebSocketConnection('ws://localhost:8080/signal', handlers),
    webRtcConnector = new WebRTCConnector(socketConnection, peerLink, handlers),
    currentUser = currentLink;

// TODO: implement leaving logic
// hangUpBtn.addEventListener("click", function () {
//     socketConnection.sendLeave(currentUser);
//     handlers.handleLeave();
// });

sendMsgBtn.addEventListener("click", function () {
    var val = msgInput.value;
    handlers.addTextMessage(val, true);

    webRtcConnector.pushMessage(val);
    msgInput.value = "";
});

startVideoButton.addEventListener("click", function () {
    startVideoStream();
});

var selfStream = null;
function startVideoStream() {
    var constraints = {
        audio: false,
        video: true
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            webRtcConnector.addStream(stream);
            selfStream = stream;
        })
        .catch(function (error) {
                if (error.name === 'ConstraintNotSatisfiedError') {
                    handlers.handleError('The resolution ' + constraints.video.width.exact + 'x' + constraints.video.width.exact + ' px is not supported by your device.');
                } else if (error.name === 'PermissionDeniedError') {
                    handlers.handleError('Permissions have not been granted to use your camera and microphone, you need to allow the page access to your devices in order for the demo to work.');
                }
                handlers.handleError('Technical error: ' + error.name);
            }
        );
}