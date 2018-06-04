function WebRTCConnector(socketConnection, videoContainer, messageContainer) {
    var configuration = {
            "iceServers": [{"url": "stun:stun2.1.google.com:19302"}]
        },
        connection = new webkitRTCPeerConnection(configuration, {}),
        outChannel = connection.createDataChannel("channel1", null),
        isConnected = false,
        sendOfferToPeer = function () {
            connection.createOffer(function (offer) {
                socketConnection.sendOffer(offer, peerName);
                connection.setLocalDescription(offer);
            }, function (error) {
                alert(error)
            });
        }, inChannel, peerName;

    connection.onicecandidate = function (event) {
        if (event.candidate) {
            isConnected = true;
            socketConnection.sendCandidate(event.candidate, peerName);
        }
    };

    connection.ondatachannel = function (event) {
        inChannel = event.channel;
        inChannel.onmessage = function (event) {
            messageContainer.innerHTML += peerName + ": " + event.data + "<br />";
        };
    };

    connection.onaddstream = function (event) {
        videoContainer.src = window.URL.createObjectURL(event.stream);
        videoContainer.play();

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
    };

    return {
        initCommunicationWith: function (destination) {
            peerName = destination;
            sendOfferToPeer()
        },
        acceptCommunicationWith: function (initiator, offer) {
            peerName = initiator;
            connection.setRemoteDescription(new RTCSessionDescription(offer));

            connection.createAnswer(function (answer) {
                connection.setLocalDescription(answer);
                socketConnection.sendAnswer(answer, peerName);
            }, function (error) {
                alert(error)
            });
        },
        acceptAnswer: function (answer) {
            connection.setRemoteDescription(new RTCSessionDescription(answer));
        },
        acceptIceCandidate: function (candidate) {
            connection.addIceCandidate(new RTCIceCandidate(candidate));
        },
        closeConnection: function () {
            connection.close();
            connection.onicecandidate = null;
            inChannel.onmessage = null;
            isConnected = false;
        },
        addStream: function (stream) {
            connection.addStream(stream);
            if (isConnected) {
                sendOfferToPeer();
                messageContainer.innerHTML += "Reconnecting to " + peerName + " with video<br />";
            }
        },
        pushMessage: function (message) {
            outChannel.send(message);
        }
    }
}