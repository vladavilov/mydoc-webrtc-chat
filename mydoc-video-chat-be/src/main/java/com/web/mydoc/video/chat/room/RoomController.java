package com.web.mydoc.video.chat.room;

import com.web.mydoc.video.chat.core.ThrowingBiFunction;
import com.web.mydoc.video.chat.room.exception.RoomAlreadyExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.function.BiFunction;
import java.util.function.Function;

@Controller
@RequestMapping("/room/")
public class RoomController {

    @Autowired
    private RoomsRepository rooms;
    @Autowired
    private RoomsContainer roomsContainer;

    @GetMapping("{roomLink}/patient")
    public ModelAndView openForPatient(@PathVariable String roomLink) throws RoomAlreadyExistsException {
        return openRoom(
                "/" + roomLink + "/patient",
                RoomsRepository::getByPatientLink,
                RoomsContainer::initRoomForPatient,
                Room::getDocLink,
                true
        );
    }

    @GetMapping("{roomLink}/doc")
    public ModelAndView openForDoc(@PathVariable String roomLink) throws RoomAlreadyExistsException {
        return openRoom(
                "/" + roomLink + "/doc",
                RoomsRepository::getByDocLink,
                RoomsContainer::initRoomForDoc,
                Room::getPatientLink,
                false
        );
    }

    private ModelAndView openRoom(
            String roomLink,
            BiFunction<RoomsRepository, String, Room> roomRetriever,
            ThrowingBiFunction<RoomsContainer, Room, String, RoomAlreadyExistsException> roomInitializer,
            Function<Room, String> peerRetriever,
            Boolean isPatient
    ) throws RoomAlreadyExistsException {

        Room room = roomRetriever.apply(rooms, roomLink);
        roomInitializer.apply(roomsContainer, room);

        ModelAndView modelAndView = new ModelAndView("room");
        modelAndView.addObject("currentLink", roomLink);
        modelAndView.addObject("peerLink", peerRetriever.apply(room));
        modelAndView.addObject("docName", room.getDoc());
        modelAndView.addObject("patientName", room.getPatient());
        modelAndView.addObject("isPatient", isPatient);

        return modelAndView;
    }
}
