package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Model.ReceivedMessageDto;

import java.util.List;

public interface MessageService {
    void sendMessage(String senderUsername, String receiverUsername, String content);
    List<ReceivedMessageDto> getUnseenMessages();
}
