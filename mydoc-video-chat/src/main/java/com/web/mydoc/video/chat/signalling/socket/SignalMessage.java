package com.web.mydoc.video.chat.signalling.socket;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class SignalMessage {

    private String type;
    private String destination;
    private Map<String, String> payload;
}
