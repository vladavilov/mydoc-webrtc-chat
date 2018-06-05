var msgInput = document.querySelector('#msgInput'),
    sendMsgBtn = document.querySelector('#sendMsgBtn'),
    startVideoButton = document.querySelector('#startVideo'),
    videoContainer = document.querySelector('#video'),
    selfVideoContainer = document.querySelector('#selfVideo'),
    chatArea = document.querySelector('#chatarea'),

    handlers = {
        handleLogin: function () {
            // TODO: implement red and green indicator
            webRtcConnector.initCommunicationWith(peerUser);
        },
        handleOffer: function (offer, name) {
            peerUser = name;
            webRtcConnector.acceptCommunicationWith(peerUser, offer);
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
            console.log("Got error", err);
        }
    },

    socketConnection = new WebSocketConnection('ws://localhost:8080/signal', handlers),
    webRtcConnector = new WebRTCConnector(socketConnection, videoContainer, chatArea),
    currentUser = currentLink,
    peerUser = peerLink;

socketConnection.sendLogin(currentUser);

// TODO: implement leaving logic
// hangUpBtn.addEventListener("click", function () {
//     socketConnection.sendLeave(currentUser);
//     handlers.handleLeave();
// });

sendMsgBtn.addEventListener("click", function () {
    var val = msgInput.value;
    chatArea.innerHTML += currentUser + ": " + val + "<br />";

    webRtcConnector.pushMessage(val);
    msgInput.value = "";
});

startVideoButton.addEventListener("click", function () {
    var constraints = {
            audio: false,
            video: true
        },
        errorMsg = function (msg, error) {
            alert(msg + ":" + error);
        };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            webRtcConnector.addStream(stream);
            selfVideoContainer.src = window.URL.createObjectURL(stream);
            selfVideoContainer.play();
        })
        .catch(function (error) {
                if (error.name === 'ConstraintNotSatisfiedError') {
                    errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
                        constraints.video.width.exact + ' px is not supported by your device.');
                } else if (error.name === 'PermissionDeniedError') {
                    errorMsg('Permissions have not been granted to use your camera and ' +
                        'microphone, you need to allow the page access to your devices in ' +
                        'order for the demo to work.');
                }
                errorMsg('getUserMedia error: ' + error.name, error);
            }
        );
});