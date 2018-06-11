package com.web.mydoc.video.chat.room;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class Room {

    private String id;
    private String patient;
    private String doc;
    private String patientLink;
    private String docLink;
    private LocalDateTime from;
    private LocalDateTime to;
}
