package com.web.mydoc.video.chat.room.admin;

import com.web.mydoc.video.chat.room.Room;
import com.web.mydoc.video.chat.room.RoomsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Secured("ROLE_ADMIN")
@RestController("/admin/room")
public class RoomAdministrationController {

    @Autowired
    private RoomsRepository rooms;

    @GetMapping
    public List<Room> getAll() {
        return rooms.getAll();
    }

    @PostMapping
    public Room add(@RequestBody Room room) {
        return rooms.save(room);
    }

    @DeleteMapping("/{roomId}")
    public Room deleteById(@PathVariable String roomId) {
        return rooms.delete(roomId);
    }
}
