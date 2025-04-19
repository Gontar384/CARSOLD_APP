package org.gontar.carsold.Service.WebSocketService;

import org.gontar.carsold.Domain.Model.Message.NotificationDto;
import org.gontar.carsold.Domain.Model.Message.SeenStatusDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendMessageToUser(String username, NotificationDto notificationDto) {
        messagingTemplate.convertAndSend("/topic/messages/" + username, notificationDto);
    }

    public void sendSeenStatus(String user1, String user2, boolean seen) {
        String topic = buildTopic(user1, user2);
        SeenStatusDto dto = new SeenStatusDto(seen);
        messagingTemplate.convertAndSend("/topic/seen/" + topic, dto);
    }

    private String buildTopic(String user1, String user2) {
        return Stream.of(user1, user2)
                .sorted()
                .collect(Collectors.joining("-"));
    }
}