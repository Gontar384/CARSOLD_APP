package org.gontar.carsold.Service.WebSocketService;

import org.gontar.carsold.Domain.Model.Message.NotificationMessageDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendMessageToUser(String username, NotificationMessageDto notificationMessageDto) {
        messagingTemplate.convertAndSend("/topic/messages/" + username, notificationMessageDto);
    }
}