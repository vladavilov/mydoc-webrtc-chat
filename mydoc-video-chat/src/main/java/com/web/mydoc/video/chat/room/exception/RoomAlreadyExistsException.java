package com.web.mydoc.video.chat.room.exception;

public class RoomAlreadyExistsException extends Exception {

    public RoomAlreadyExistsException(String roomLink) {
        super("Room is already opened for specified link: [" + roomLink + "]");
    }
}
