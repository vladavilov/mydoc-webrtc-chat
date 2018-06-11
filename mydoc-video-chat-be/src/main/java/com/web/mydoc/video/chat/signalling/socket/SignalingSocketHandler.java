package com.web.mydoc.video.chat.signalling.socket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.mydoc.video.chat.room.RoomsContainer;
import com.web.mydoc.video.chat.room.exception.RoomIsBusyException;
import com.web.mydoc.video.chat.room.exception.RoomNotInitializedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class SignalingSocketHandler extends TextWebSocketHandler {

    private static final Logger LOG = LoggerFactory.getLogger(SignalingSocketHandler.class);

    private static final String LOGIN_TYPE = "login";
    private static final List<String> RTC_TYPES = Arrays.asList("answer", "offer", "candidate", "leave", "peerConnected");

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RoomsContainer roomsContainer;

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

    private void handleLogin(WebSocketSession session, SignalMessage message) throws IOException, RoomNotInitializedException, RoomIsBusyException {
        String destinationLink = message.getDestination();
        String peerLink = message.getPayload().get("peerLink");

        roomsContainer.attachSession(destinationLink, session);
        WebSocketSession peerSession = roomsContainer.getDestination(peerLink);

        if (peerSession != null && peerSession.isOpen()) {
            message.getPayload().put("peerConnected", String.valueOf(true));
        }
        LOG.info("[MESSAGE SENT]: " + message);
        session.sendMessage(formatToText(message));
    }

    private void handleRtcMessage(WebSocketSession session, SignalMessage message) throws IOException {
        String destination = message.getDestination();
        WebSocketSession destinationSocket = roomsContainer.getDestination(destination);

        if (destinationSocket != null && destinationSocket.isOpen()) {
            LOG.info("[MESSAGE SENT]: " + message);
            destinationSocket.sendMessage(formatToText(message));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);

        // TODO: implement session close
    }
}