package com.web.mydoc.video.chat.room;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoomsRepository {

    public List<Room> getAll() {
        return null;
    }

    public Room getById(String id) {
        return null;
    }

    public Room getByPatientLink(String patientLink) {
        Room room = new Room();
        room.setId("1");
        room.setPatientLink("/test/patient");
        room.setDocLink("/test/doc");
        room.setPatient("Test patient");
        room.setDoc("Test doc");
        return room;
    }

    public Room getByDocLink(String docLink) {
        Room room = new Room();
        room.setId("1");
        room.setPatientLink("/test/patient");
        room.setDocLink("/test/doc");
        room.setPatient("Test patient");
        room.setDoc("Test doc");
        return room;
    }

    public Room delete(String id) {
        return new Room();
    }

    public Room save(Room room) {
        return new Room();
    }
}
