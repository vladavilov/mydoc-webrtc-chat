package com.web.video.chat.signaling.socket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class SignalingSocketHandler extends TextWebSocketHandler {

    private static final Logger LOG = LoggerFactory.getLogger(SignalingSocketHandler.class);

    private static final String LOGIN_TYPE = "login";
    private static final List<String> RTC_TYPES = Arrays.asList("answer", "offer", "candidate", "leave");

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ClientsContainer clients;

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        LOG.debug("handleTextMessage : {}", message.getPayload());

        SignalMessage signalMessage = parseJson(message);

        if (LOGIN_TYPE.equalsIgnoreCase(signalMessage.getType())) {
            handleLogin(session, signalMessage);
        } else if (RTC_TYPES.contains(signalMessage.getType())) {
            handleRtcMessage(session, signalMessage);
        }
    }

    private SignalMessage parseJson(TextMessage message) throws IOException {
        return objectMapper.readValue(message.getPayload(), SignalMessage.class);
    }

    private TextMessage formatToText(SignalMessage message) throws JsonProcessingException {
        String json = objectMapper.writeValueAsString(message);
        return new TextMessage(json);
    }

    private void handleLogin(WebSocketSession session, SignalMessage message) throws IOException {
        String userName = message.getDestination();

        WebSocketSession clientsSession = clients.getSession(userName);

        if (clientsSession == null || !clientsSession.isOpen()) {
            clients.putClient(userName, session);
        }
        session.sendMessage(formatToText(message));
    }

    private void handleRtcMessage(WebSocketSession session, SignalMessage message) throws IOException {
        String destination = message.getDestination();
        WebSocketSession destinationSocket = clients.getSession(destination);

        if (destinationSocket != null && destinationSocket.isOpen()) {
            message.setDestination(clients.getClientId(session));
            destinationSocket.sendMessage(formatToText(message));
        }
    }
}