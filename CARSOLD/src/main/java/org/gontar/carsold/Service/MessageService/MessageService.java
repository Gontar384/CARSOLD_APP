package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Model.Message.ConversationDto;
import org.gontar.carsold.Domain.Model.Message.UnseenMessagesCountDto;
import org.gontar.carsold.Domain.Model.Message.ConversationWithUserDto;

import java.util.List;

public interface MessageService {
    void activateConversation(String username);
    void sendMessage(String senderUsername, String receiverUsername, String content);
    UnseenMessagesCountDto getUnseenCount();
    List<ConversationDto> getAllConversations();
    ConversationWithUserDto getConversationOnInitial(String username);
    void deleteConversation(String username);
}
