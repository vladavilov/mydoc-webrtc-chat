package com.web.mydoc.video.chat.room;

import com.web.mydoc.video.chat.room.exception.RoomAlreadyExistsException;
import com.web.mydoc.video.chat.room.exception.RoomIsBusyException;
import com.web.mydoc.video.chat.room.exception.RoomNotInitializedException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.function.Supplier;

@Component
public class RoomsContainer {

    private Map<String, WebSocketSession> sessions = new HashMap<>();
    private Map<String, Room> patientRoomIds = new HashMap<>();
    private Map<String, Room> docRoomIds = new HashMap<>();

    String initRoomForPatient(Room room) throws RoomAlreadyExistsException {
        return initRoom(patientRoomIds, room);
    }

    String initRoomForDoc(Room room) throws RoomAlreadyExistsException {
        return initRoom(docRoomIds, room);
    }

    private String initRoom(Map<String, Room> container, Room room) throws RoomAlreadyExistsException {
        if (container.get(room.getId()) != null) {
            throw new RoomAlreadyExistsException(room.getPatientLink());
        }

        container.put(room.getId(), room);

        return room.getId();
    }

    public String attachPatientSession(String roomId, WebSocketSession session) throws RoomNotInitializedException, RoomIsBusyException {
        return attachSession(
                roomId,
                session,
                Room::getPatientLink,
                Room::getDocLink,
                patientRoomIds
        );
    }

    public String attachDocSession(String roomId, WebSocketSession session) throws RoomNotInitializedException, RoomIsBusyException {
        return attachSession(
                roomId,
                session,
                Room::getDocLink,
                Room::getPatientLink,
                docRoomIds
        );
    }

    public WebSocketSession getDestination(String link) {
        return sessions.get(link);
    }

    private String attachSession(String roomId, WebSocketSession session, Function<Room, String> linkGetter, Function<Room, String> destinationGetter, Map<String, Room> rooms) throws RoomNotInitializedException, RoomIsBusyException {
        Room room = rooms.get(roomId);

        if (room == null) {
            throw new RoomNotInitializedException(roomId);
        }

        String link = linkGetter.apply(room);
        if (sessions.get(link) != null) {
            throw new RoomIsBusyException(roomId);
        }

        sessions.put(link, session);

        return destinationGetter.apply(room);
    }
}
