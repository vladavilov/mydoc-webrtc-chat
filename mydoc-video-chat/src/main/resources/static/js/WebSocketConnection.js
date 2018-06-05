function WebSocketConnection(url, handlers) {
    var connection = new WebSocket(url),
        send = function (message) {
            connection.send(JSON.stringify(message));
        };

    connection.onmessage = function (message) {
        var data = JSON.parse(message.data);

        switch (data.type) {
            case "login":
                handlers.handleLogin();
                break;
            case "offer":
                handlers.handleOffer(data.payload, data.destination);
                break;
            case "answer":
                handlers.handleAnswer(data.payload);
                break;
            case "candidate":
                handlers.handleCandidate(data.payload);
                break;
            case "leave":
                handlers.handleLeave();
                break;
            default:
                break;
        }
    };

    connection.onerror = handlers.handleError;

    return {
        sendLogin: function (currentUser, roomId) {
            send({
                type: "login",
                destination: currentUser
            });
        },
        sendLeave: function (currentUser) {
            send({
                type: "leave",
                destination: currentUser
            });
        },
        sendOffer: function (offer, peerName) {
            send({
                destination: peerName,
                type: "offer",
                payload: offer
            });
        },
        sendCandidate: function (candidate, peerName) {
            send({
                destination: peerName,
                type: "candidate",
                payload: candidate
            });
        },
        sendAnswer: function (answer, peerName) {
            send({
                destination: peerName,
                type: "answer",
                payload: answer
            });
        }
    }
}