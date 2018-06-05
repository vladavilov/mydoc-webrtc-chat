package com.web.mydoc.video.chat.room.exception;

public class RoomIsBusyException extends Exception {

    public RoomIsBusyException(String roomId) {
        super("Room is already busy for given ID: [" + roomId + "]");
    }
}
