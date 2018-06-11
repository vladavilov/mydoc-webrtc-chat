package com.web.mydoc.video.chat.room.admin.link;

import com.web.mydoc.video.chat.room.Room;
import org.springframework.stereotype.Component;
import org.springframework.util.DigestUtils;

import java.util.Arrays;
import java.util.UUID;

@Component
public class RoomLinkGenerator {

    private static final String PATIENT_PREFIX = "patient_";
    private static final String PATIENT_POSTFIX = "/patient";
    private static final String DOC_PREFIX = "doc_";
    private static final String DOC_POSTFIX = "/doc";

    public RoomLinkContainer generateBy(Room room) {
        RoomLinkContainer container = new RoomLinkContainer();
        String uuid = UUID.randomUUID().toString();

        container.setPatientLink(generatePatientLink(uuid, room.getPatient()));
        container.setDocLink(generateDocLink(uuid, room.getDoc()));

        return container;
    }

    private String generatePatientLink(String uuid, String name) {
        return "/" + generateLink(uuid, PATIENT_PREFIX + name) + "/" + PATIENT_POSTFIX;
    }

    private String generateDocLink(String uuid, String name) {
        return "/" + generateLink(uuid, DOC_PREFIX + name) + "/" + DOC_POSTFIX;
    }

    private String generateLink(String uuid, String name) {
        return Arrays.toString(DigestUtils.md5Digest((uuid + name).getBytes())).toUpperCase();
    }
}
