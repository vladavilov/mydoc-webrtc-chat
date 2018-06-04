package com.web.video.chat.signaling.socket;

import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;

public class ClientsContainer {

    private Map<String, WebSocketSession> sessions = new HashMap<String, WebSocketSession>();
    private Map<String, String> clientIds = new HashMap<String, String>();

    public void putClient(String name, WebSocketSession session) {
        sessions.put(name, session);
        clientIds.put(session.getId(), name);
    }

    public WebSocketSession getSession(String name) {
        return sessions.get(name);
    }

    public String getClientId(WebSocketSession session) {
        return clientIds.get(session.getId());
    }
}
