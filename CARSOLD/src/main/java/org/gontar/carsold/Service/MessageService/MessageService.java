package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Entity.Message.Message;

public interface MessageService {
    Message sendMessage(String senderUsername, String receiverUsername, String content);
}
