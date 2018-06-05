package com.web.mydoc.video.chat.room.admin.link;

import com.web.mydoc.video.chat.room.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Secured("ROLE_ADMIN")
@RestController("/admin/room/link")
public class RoomLinkController {

    @Autowired
    private RoomLinkGenerator linkGenerator;

    @GetMapping
    public RoomLinkContainer generateLinks(Room room) {
        return linkGenerator.generateBy(room);
    }
}
