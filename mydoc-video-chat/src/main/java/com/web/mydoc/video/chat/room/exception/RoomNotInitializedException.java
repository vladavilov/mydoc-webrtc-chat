package com.web.mydoc.video.chat.room.exception;

public class RoomNotInitializedException extends Exception {

    public RoomNotInitializedException(String roomId) {
        super("Room is not initialized for given ID: [" + roomId + "]");
    }
}
