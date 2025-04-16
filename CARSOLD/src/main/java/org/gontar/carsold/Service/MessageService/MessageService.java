package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Model.Message.ConversationDto;
import org.gontar.carsold.Domain.Model.Message.UnseenMessagesDto;
import org.gontar.carsold.Domain.Model.Message.WholeConversationDto;

import java.util.List;

public interface MessageService {
    void sendMessage(String senderUsername, String receiverUsername, String content);
    UnseenMessagesDto getUnseenMessages();
    List<ConversationDto> getUserConversations();
    WholeConversationDto getConversation(String username, int page, int size);
}
