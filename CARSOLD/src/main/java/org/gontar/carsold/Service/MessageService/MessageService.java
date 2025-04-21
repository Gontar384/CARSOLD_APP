package org.gontar.carsold.Service.MessageService;

import org.gontar.carsold.Domain.Model.Message.*;

import java.util.List;

public interface MessageService {
    void activateConversation(String username);
    void sendMessage(String username, String content);
    UnseenMessagesCountDto getUnseenCount();
    List<ConversationDto> getAllConversations();
    ConversationWithUserDto getConversationOnInitial(String username);
    void deleteConversation(String username);
    void blockUnblockUser(String username);
    void setSeen(String username);
    PagedMessagesDto getOlderMessages(String username, int page);
}
