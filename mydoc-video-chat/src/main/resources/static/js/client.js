var loginPage = document.querySelector('#loginPage'),
    usernameInput = document.querySelector('#usernameInput'),
    loginBtn = document.querySelector('#loginBtn'),
    callPage = document.querySelector('#callPage'),
    callToUsernameInput = document.querySelector('#callToUsernameInput'),
    callBtn = document.querySelector('#callBtn'),
    hangUpBtn = document.querySelector('#hangUpBtn'),
    msgInput = document.querySelector('#msgInput'),
    sendMsgBtn = document.querySelector('#sendMsgBtn'),
    startVideoButton = document.querySelector('#startVideo'),
    videoContainer = document.querySelector('#video'),
    selfVideoContainer = document.querySelector('#selfVideo'),
    chatArea = document.querySelector('#chatarea'),

    handlers = {
        handleLogin: function () {
            loginPage.style.display = "none";
            callPage.style.display = "block";
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
            peerUser = null;
            currentUser = null;
            webRtcConnector.closeConnection();
        },
        handleError: function (err) {
            console.log("Got error", err);
        }
    },

    socketConnection = new WebSocketConnection('ws://localhost:8080/signal', handlers),
    webRtcConnector = new WebRTCConnector(socketConnection, videoContainer, chatArea),
    currentUser, peerUser;

callPage.style.display = "none";

loginBtn.addEventListener("click", function () {
    currentUser = usernameInput.value;

    if (currentUser.length > 0) {
        socketConnection.sendLogin(currentUser);
    }
});

callBtn.addEventListener("click", function () {
    peerUser = callToUsernameInput.value;

    if (peerUser.length > 0) {
        webRtcConnector.initCommunicationWith(peerUser)
    }
});

hangUpBtn.addEventListener("click", function () {
    socketConnection.sendLeave(currentUser);
    handlers.handleLeave();
});

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