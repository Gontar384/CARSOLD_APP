package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Model.Message.UnseenMessagesDto;

public interface MessageService {
    void sendMessage(String senderUsername, String receiverUsername, String content);
    UnseenMessagesDto getUnseenMessages();
}
