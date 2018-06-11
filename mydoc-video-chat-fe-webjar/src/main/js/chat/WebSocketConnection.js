function WebSocketConnection(url, handlers) {
    var connection = new WebSocket(url),
        send = function (message) {
            connection.send(JSON.stringify(message));
        };

    connection.onopen = handlers.initSocketConnection;
    connection.onmessage = function (message) {
        var data = JSON.parse(message.data);

        switch (data.type) {
            case "login":
                handlers.handleLogin(data.payload);
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
        sendLogin: function (currentLink, peerLink) {
            send({
                type: "login",
                destination: currentLink,
                payload: {
                    peerLink: peerLink
                }
            });
        },
        sendLeave: function (currentUser) {
            send({
                type: "leave",
                destination: currentUser
            });
        },
        sendOffer: function (offer, peerLink) {
            send({
                destination: peerLink,
                type: "offer",
                payload: offer
            });
        },
        sendCandidate: function (candidate, peerLink) {
            send({
                destination: peerLink,
                type: "candidate",
                payload: candidate
            });
        },
        sendAnswer: function (answer, peerLink) {
            send({
                destination: peerLink,
                type: "answer",
                payload: answer
            });
        }
    }
}