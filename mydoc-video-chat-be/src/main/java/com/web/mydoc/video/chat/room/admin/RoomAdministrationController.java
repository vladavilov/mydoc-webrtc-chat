package com.web.mydoc.video.chat.room.admin;

import com.web.mydoc.video.chat.room.Room;
import com.web.mydoc.video.chat.room.RoomsRepository;
import com.web.mydoc.video.chat.room.admin.link.RoomLinkContainer;
import com.web.mydoc.video.chat.room.admin.link.RoomLinkGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Secured("ROLE_ADMIN")
@RestController
@RequestMapping("/admin/room")
public class RoomAdministrationController {

    @Autowired
    private RoomsRepository rooms;

    @Autowired
    private RoomLinkGenerator linkGenerator;

    @GetMapping
    public List<Room> getAll() {
        return rooms.getAll();
    }

    @GetMapping("/link")
    public RoomLinkContainer generateLinks(Room room) {
        return linkGenerator.generateBy(room);
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
