package com.web.mydoc.video.chat.room;

import com.web.mydoc.video.chat.room.exception.RoomAlreadyExistsException;
import com.web.mydoc.video.chat.room.exception.RoomIsBusyException;
import com.web.mydoc.video.chat.room.exception.RoomNotInitializedException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Supplier;

@Component
public class RoomsContainer {

    private Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private Map<String, Room> patientRoomIds = new ConcurrentHashMap<>();
    private Map<String, Room> docRoomIds = new ConcurrentHashMap<>();

    String initRoomForPatient(Room room) throws RoomAlreadyExistsException {
        return initRoom(patientRoomIds, room);
    }

    String initRoomForDoc(Room room) throws RoomAlreadyExistsException {
        return initRoom(docRoomIds, room);
    }

    private String initRoom(Map<String, Room> container, Room room) throws RoomAlreadyExistsException {
//        if (container.get(room.getId()) != null) {
//            throw new RoomAlreadyExistsException(room.getPatientLink());
//        }

        container.put(room.getId(), room);

        return room.getId();
    }

    public WebSocketSession getDestination(String link) {
        return sessions.get(link);
    }

    public void attachSession(String link, WebSocketSession session) {
        sessions.put(link, session);
    }
}
