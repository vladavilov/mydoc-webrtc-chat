function WebRTCConnector(socketConnection, peerName, handlers) {
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
                handlers.handleError(error);
            });
        }, inChannel;

    connection.onicecandidate = function (event) {
        if (event.candidate) {
            isConnected = true;
            socketConnection.sendCandidate(event.candidate, peerName);
        }
    };

    connection.ondatachannel = function (event) {
        inChannel = event.channel;
        inChannel.onmessage = function (event) {
            handlers.addTextMessage(event.data);
        };
    };

    connection.ontrack = function (event) {
        handlers.acceptIncomingVideo(event.streams[0]);
    };

    return {
        initCommunicationWith: function () {
            sendOfferToPeer()
        },
        acceptCommunicationWith: function (offer) {
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
            }
        },
        pushMessage: function (message) {
            outChannel.send(message);
        }
    }
}