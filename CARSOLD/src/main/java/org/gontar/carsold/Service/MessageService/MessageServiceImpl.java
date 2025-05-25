package org.gontar.carsold.Service.MessageService;

import org.springframework.transaction.annotation.Transactional;
import org.gontar.carsold.Domain.Entity.Message.Conversation;
import org.gontar.carsold.Domain.Entity.Message.Message;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.Message.*;
import org.gontar.carsold.Exception.CustomException.ConversationNotFoundException;
import org.gontar.carsold.Exception.CustomException.MessageTooLargeException;
import org.gontar.carsold.Exception.CustomException.UserNotFoundException;
import org.gontar.carsold.Exception.CustomException.WrongActionException;
import org.gontar.carsold.Repository.ConversationRepository;
import org.gontar.carsold.Repository.MessageRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final WebSocketService webSocketService;
    private final MyUserDetailsService userDetailsService;

    public MessageServiceImpl(ConversationRepository conversationRepository, MessageRepository messageRepository, UserRepository userRepository, WebSocketService webSocketService, MyUserDetailsService userDetailsService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.webSocketService = webSocketService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void activateConversation(String username) {
        ConversationContext context = getConversationContext(username, true);
        if (context.isUser1) {
            context.conversation.setActivatedByUser1(true);
            if (context.conversation.isDeletedByUser1()) {
                context.conversation.setDeletedByUser1(false);
            }
        } else {
            context.conversation.setActivatedByUser2(true);
            if (context.conversation.isDeletedByUser2()) {
                context.conversation.setDeletedByUser2(false);
            }
        }
        conversationRepository.save(context.conversation);
    }

    @Transactional
    @Override
    public void sendMessage(String username, String content) {
        Objects.requireNonNull(content, "Content cannot be null");
        if (content.length() > 1000) throw new MessageTooLargeException("Message is too long");

        ConversationContext context = getConversationContext(username, true);

        if ((context.isUser1 && context.conversation.isBlockedByUser1()) || (!context.isUser1 && context.conversation.isBlockedByUser2())) {
            throw new WrongActionException("You have blocked this user. Unblock to send messages.");
        }
        if ((context.isUser1 && context.conversation.isBlockedByUser2()) || (!context.isUser1 && context.conversation.isBlockedByUser1())) {
            throw new WrongActionException("You cannot send messages to a user who has blocked you.");
        }
        if (context.isUser1) {
            context.conversation.setSeenByUser2(false);
            context.conversation.setSeenByUser1(true);
            context.conversation.setDeletedByUser2(false);
        } else {
            context.conversation.setSeenByUser1(false);
            context.conversation.setSeenByUser2(true);
            context.conversation.setDeletedByUser1(false);
        }
        context.conversation.setActivatedByUser1(true);
        context.conversation.setActivatedByUser2(true);

        Message message = new Message();
        message.setSender(context.user);
        message.setReceiver(context.otherUser);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setConversation(context.conversation);

        messageRepository.save(message);
        conversationRepository.save(context.conversation);

        int unseenCount;
        if (context.isUser1) {
            unseenCount = conversationRepository.countUnseenAndActivatedByUser2(context.otherUser.getId());
        } else {
            unseenCount = conversationRepository.countUnseenAndActivatedByUser1(context.otherUser.getId());
        }

        NotificationDto dto = new NotificationDto();
        dto.setSenderUsername(context.user.getUsername());
        dto.setSenderProfilePic(context.user.getProfilePic());
        dto.setContent(content);
        dto.setTimestamp(message.getTimestamp());
        dto.setUnseenCount(unseenCount);

        webSocketService.sendMessageToUser(context.otherUser.getUsername(), dto);
    }

    @Override
    public UnseenMessagesCountDto getUnseenCount() {
        User user = userDetailsService.loadUser();
        int countAsUser1 = conversationRepository.countUnseenAndActivatedByUser1(user.getId());
        int countAsUser2 = conversationRepository.countUnseenAndActivatedByUser2(user.getId());
        int totalUnseenConversations = countAsUser1 + countAsUser2;
        return new UnseenMessagesCountDto(totalUnseenConversations);
    }

    @Override
    public List<ConversationDto> getAllConversations() {
        User user = userDetailsService.loadUser();
        Long userId = user.getId();
        List<Conversation> conversations = conversationRepository.findVisibleConversationsForUser(user);

        return conversations.stream()
                .map(conversation -> {
                    boolean isUser1 = conversation.getUser1().getId().equals(userId);
                    User otherUser = isUser1 ? conversation.getUser2() : conversation.getUser1();
                    Message latestMessage = conversation.getMessages().stream()
                            .max(Comparator.comparing(Message::getTimestamp))
                            .orElse(null);

                    boolean isSeen = isUser1 ? conversation.isSeenByUser1() : conversation.isSeenByUser2();

                    return new ConversationDto(
                            otherUser.getUsername(),
                            otherUser.getProfilePic(),
                            latestMessage != null ? latestMessage.getContent() : "",
                            latestMessage != null ? latestMessage.getTimestamp() : null,
                            latestMessage != null ? latestMessage.getSender().getUsername() : null,
                            isSeen
                    );
                })
                .sorted(Comparator.comparing(ConversationDto::getTimestamp, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    public ConversationWithUserDto getConversationOnInitial(String username) {
        ConversationContext context = getConversationContext(username, false);

        boolean isActivatedForUser = context.isUser1 ? context.conversation.isActivatedByUser1() : context.conversation.isActivatedByUser2();
        boolean isDeletedForUser = context.isUser1 ? context.conversation.isDeletedByUser1() : context.conversation.isDeletedByUser2();

        if (!isActivatedForUser || isDeletedForUser) throw new ConversationNotFoundException("Conversation is not available for this user");

        boolean blockedByUser = context.isUser1 ? context.conversation.isBlockedByUser1() : context.conversation.isBlockedByUser2();
        boolean blockedUser = context.isUser1 ? context.conversation.isBlockedByUser2() : context.conversation.isBlockedByUser1();
        boolean isSeenByUser = context.isUser1 ? context.conversation.isSeenByUser2() : context.conversation.isSeenByUser1();

        List<Message> latestMessages = messageRepository.findTop15ByConversationIdOrderByTimestampDesc(context.conversation.getId());
        List<MessageDto> messageDtos = latestMessages.stream()
                .map(m -> new MessageDto(
                        m.getContent(),
                        m.getTimestamp(),
                        m.getSender().getUsername()))
                .collect(Collectors.toList());

        Collections.reverse(messageDtos);

        PagedMessagesDto pagedMessages = new PagedMessagesDto(
                messageDtos,
                messageDtos.size() == 15
        );

        return new ConversationWithUserDto(
                context.otherUser.getUsername(),
                context.otherUser.getProfilePic(),
                pagedMessages,
                blockedByUser,
                blockedUser,
                isSeenByUser
        );
    }

    @Override
    public void deleteConversation(String username) {
        ConversationContext context = getConversationContext(username, false);
        if (context.isUser1) {
            context.conversation.setDeletedByUser1(true);
        } else {
            context.conversation.setDeletedByUser2(true);
        }
        if (context.conversation.isDeletedByUser1() && context.conversation.isDeletedByUser2()) {
            conversationRepository.delete(context.conversation);
        } else {
            conversationRepository.save(context.conversation);
        }
    }

    @Override
    public void blockUnblockUser(String username) {
        ConversationContext context = getConversationContext(username,false);
        if (context.isUser1) {
            context.conversation.setBlockedByUser1(!context.conversation.isBlockedByUser1());
        } else {
            context.conversation.setBlockedByUser2(!context.conversation.isBlockedByUser2());
        }
        conversationRepository.save( context.conversation);
    }

    @Override
    public void makeSeen(String username) {
        ConversationContext context = getConversationContext(username, false);
        if (context.isUser1) {
            context.conversation.setSeenByUser1(true);
        } else {
            context.conversation.setSeenByUser2(true);
        }
        conversationRepository.save(context.conversation);

        boolean seen = context.isUser1 ? context.conversation.isSeenByUser1() : context.conversation.isSeenByUser2();

        webSocketService.sendSeenStatus(
                context.conversation.getUser1().getUsername(),
                context.conversation.getUser2().getUsername(),
                seen
        );
    }

    @Override
    public PagedMessagesDto getPreviousMessages(String username, int page) {
        ConversationContext context = getConversationContext(username, false);

        boolean isActivatedForUser = context.isUser1 ? context.conversation.isActivatedByUser1() : context.conversation.isActivatedByUser2();
        boolean isDeletedForUser = context.isUser1 ? context.conversation.isDeletedByUser1() : context.conversation.isDeletedByUser2();

        if (!isActivatedForUser || isDeletedForUser) throw new ConversationNotFoundException("Conversation is not available for this user");

        int pageSize = 15;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("timestamp").descending());

        Page<Message> messagePage = messageRepository.findByConversationId(context.conversation.getId(), pageable);

        List<MessageDto> messageDtos = messagePage.getContent().stream()
                .map(m -> new MessageDto(
                        m.getContent(),
                        m.getTimestamp(),
                        m.getSender().getUsername()))
                .collect(Collectors.toList());

        Collections.reverse(messageDtos);

        boolean hasMore = messagePage.hasNext();

        return new PagedMessagesDto(messageDtos, hasMore);
    }

    private ConversationContext getConversationContext(String username, boolean createNew) {
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);
        if (otherUser == null) throw new UserNotFoundException("User not found");
        if (user.getUsername().equals(username)) throw new WrongActionException("You cannot have a conversation with yourself");

        Conversation conversation;
        if (!createNew) {
            conversation = conversationRepository
                    .findByUsers(user.getId(), otherUser.getId())
                    .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));
        } else {
            conversation = conversationRepository
                    .findByUsers(user.getId(), otherUser.getId())
                    .orElseGet(() -> {
                        Conversation newConv = new Conversation();
                        newConv.setUser1(user);
                        newConv.setUser2(otherUser);
                        return conversationRepository.save(newConv);
                    });
        }

        boolean isUser1 = conversation.getUser1().getId().equals(user.getId());
        return new ConversationContext(conversation, isUser1, user, otherUser);
    }

    private static class ConversationContext {
        Conversation conversation;
        boolean isUser1;
        User user;
        User otherUser;
        ConversationContext(Conversation conversation, boolean isUser1, User user, User otherUser) {
            this.conversation = conversation;
            this.isUser1 = isUser1;
            this.user = user;
            this.otherUser = otherUser;
        }
    }
}
