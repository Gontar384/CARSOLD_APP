package org.gontar.carsold.ServiceTest.MessageServiceTest;

import org.gontar.carsold.Domain.Entity.Message.Conversation;
import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.Message.ConversationDto;
import org.gontar.carsold.Domain.Model.Message.ConversationWithUserDto;
import org.gontar.carsold.Domain.Model.Message.PagedMessagesDto;
import org.gontar.carsold.Domain.Model.Message.UnseenMessagesCountDto;
import org.gontar.carsold.Exception.CustomException.ConversationNotFoundException;
import org.gontar.carsold.Exception.CustomException.WrongActionException;
import org.gontar.carsold.Repository.ConversationRepository;
import org.gontar.carsold.Repository.MessageRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MessageService.MessageServiceImpl;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class MessageServiceUnitTest {

    @Mock
    private ConversationRepository conversationRepository;
    @Mock
    private MessageRepository messageRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private WebSocketService webSocketService;
    @Mock
    private MyUserDetailsService userDetailsService;

    @InjectMocks
    private MessageServiceImpl messageService;

    private User user;
    private User otherUser;
    private Conversation conversation;

    @BeforeEach
    void setup() {
        user = new User();
        user.setId(1L);
        user.setUsername("jane");

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setUsername("john");

        conversation = new Conversation();
        conversation.setUser1(user);
        conversation.setUser2(otherUser);
    }

    @Test
    public void activateConversation_user1_success() {
        conversation.setDeletedByUser1(true);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));

        messageService.activateConversation("john");

        assertTrue(conversation.isActivatedByUser1());
        assertFalse(conversation.isDeletedByUser1());
        verify(conversationRepository).save(conversation);
    }

    @Test
    public void sendMessage_success() {
        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));
        when(messageRepository.save(any(Message.class))).thenAnswer(i -> i.getArguments()[0]);

        messageService.sendMessage("john", "Hello!");

        verify(messageRepository).save(any(Message.class));
        verify(conversationRepository).save(conversation);
        verify(webSocketService).sendMessageToUser(eq("john"), any());
    }

    @Test
    public void sendMessage_blockedByOtherUser() {
        conversation.setBlockedByUser2(true);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));

        assertThrows(WrongActionException.class, () -> messageService.sendMessage("john", "Blocked message"));
    }

    @Test
    public void getUnseenCount_success() {
        when(userDetailsService.loadUser()).thenReturn(user);
        when(conversationRepository.countUnseenAndActivatedByUser1(1L)).thenReturn(3);
        when(conversationRepository.countUnseenAndActivatedByUser2(1L)).thenReturn(2);

        UnseenMessagesCountDto result = messageService.getUnseenCount();

        assertEquals(5, result.getUnseenCount());
    }

    @Test
    public void deleteConversation_singleSide_success() {
        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));

        messageService.deleteConversation("john");

        assertTrue(conversation.isDeletedByUser1());
        verify(conversationRepository).save(conversation);
    }

    @Test
    public void blockUnblockUser_toggleBlock_success() {
        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));

        messageService.blockUnblockUser("john");

        assertTrue(conversation.isBlockedByUser1());
        verify(conversationRepository).save(conversation);

        messageService.blockUnblockUser("john");

        assertFalse(conversation.isBlockedByUser1());
    }

    @Test
    public void makeSeen_user1_success() {
        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));

        messageService.makeSeen("john");

        assertTrue(conversation.isSeenByUser1());
        verify(webSocketService).sendSeenStatus("jane", "john", true);
    }

    @Test
    public void getAllConversations_success() {
        Message latestMessage = new Message();
        latestMessage.setContent("Latest message");
        latestMessage.setTimestamp(LocalDateTime.now());
        latestMessage.setSender(user);

        conversation.setMessages(List.of(latestMessage));
        conversation.setSeenByUser1(true);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(conversationRepository.findVisibleConversationsForUser(user)).thenReturn(List.of(conversation));

        List<ConversationDto> result = messageService.getAllConversations();

        assertEquals(1, result.size());
        ConversationDto dto = result.getFirst();
        assertEquals("john", dto.getUsername());
        assertEquals("Latest message", dto.getLastMessage());
        assertTrue(dto.isSeen());
    }

    @Test
    public void getConversationOnInitial_success() {
        Message msg = new Message();
        msg.setContent("Hi");
        msg.setTimestamp(LocalDateTime.now());
        msg.setSender(user);

        conversation.setId(1L);
        conversation.setActivatedByUser1(true);
        conversation.setDeletedByUser1(false);
        conversation.setSeenByUser2(true);
        conversation.setBlockedByUser1(true);
        conversation.setBlockedByUser2(false);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));
        when(messageRepository.findTop15ByConversationIdOrderByTimestampDesc(1L)).thenReturn(List.of(msg));

        ConversationWithUserDto dto = messageService.getConversationOnInitial("john");

        assertEquals("john", dto.getUsername());
        assertEquals(1, dto.getMessages().getMessages().size());
        assertTrue(dto.isBlockedByUser());
        assertFalse(dto.isBlockedUser());
        assertTrue(dto.isSeenByUser());
    }

    @Test
    public void getConversationOnInitial_notActivated_shouldThrowException() {
        conversation.setActivatedByUser1(false);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));

        assertThrows(ConversationNotFoundException.class, () ->
                messageService.getConversationOnInitial("john"));
    }

    @Test
    public void getPreviousMessages_success() {
        Message msg = new Message();
        msg.setContent("Old message");
        msg.setTimestamp(LocalDateTime.now());
        msg.setSender(user);

        conversation.setId(1L);
        conversation.setActivatedByUser1(true);
        conversation.setDeletedByUser1(false);

        Page<Message> messagePage = new PageImpl<>(List.of(msg));

        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findByUsername("john")).thenReturn(otherUser);
        when(conversationRepository.findByUsers(1L, 2L)).thenReturn(Optional.of(conversation));
        when(messageRepository.findByConversationId(eq(1L), any(Pageable.class))).thenReturn(messagePage);

        PagedMessagesDto dto = messageService.getPreviousMessages("john", 0);

        assertEquals(1, dto.getMessages().size());
        assertFalse(dto.isHasMore());
    }
}