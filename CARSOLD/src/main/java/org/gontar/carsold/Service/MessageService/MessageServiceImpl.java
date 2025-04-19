package org.gontar.carsold.Service.MessageService;

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
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);
        if (otherUser == null) throw new UserNotFoundException("User not found");
        if (user.getUsername().equals(username)) throw new WrongActionException("You cannot start a conversation with yourself");

        Conversation conversation = conversationRepository
                .findByUsers(user.getId(), otherUser.getId())
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setUser1(user);
                    newConv.setUser2(otherUser);
                    return conversationRepository.save(newConv);
                });

        if (conversation.getUser1().getId().equals(user.getId())) {
            conversation.setActivatedByUser1(true);
            if (conversation.isDeletedByUser1()) {
                conversation.setDeletedByUser1(false);
            }
        } else if (conversation.getUser2().getId().equals(user.getId())) {
            conversation.setActivatedByUser2(true);
            if (conversation.isDeletedByUser2()) {
                conversation.setDeletedByUser2(false);
            }
        }
        conversationRepository.save(conversation);
    }

    @Override
    public void sendMessage(String senderUsername, String receiverUsername, String content) {
        Objects.requireNonNull(senderUsername, "Sender username cannot be null");
        Objects.requireNonNull(receiverUsername, "Receiver username cannot be null");
        Objects.requireNonNull(content, "Content cannot be null");
        if (content.length() > 1000) throw new MessageTooLargeException("Message is too long");

        User sender = userRepository.findByUsername(senderUsername);
        if (sender == null) throw new UserNotFoundException("Sender not found");
        if (senderUsername.equals(receiverUsername)) throw new WrongActionException("You cannot have a conversation with yourself");
        User receiver = userRepository.findByUsername(receiverUsername);
        if (receiver == null) throw new UserNotFoundException("Receiver not found");

        Conversation conversation = conversationRepository
                .findByUsers(sender.getId(), receiver.getId())
                .orElseGet(() -> {
                    Conversation newConv = new Conversation();
                    newConv.setUser1(sender);
                    newConv.setUser2(receiver);
                    return conversationRepository.save(newConv);
                });

        boolean isSenderUser1 = conversation.getUser1().getId().equals(sender.getId());

        if ((isSenderUser1 && conversation.isBlockedByUser1()) ||
                (!isSenderUser1 && conversation.isBlockedByUser2())) {
            throw new WrongActionException("You have blocked this user. Unblock to send messages.");
        }

        if ((isSenderUser1 && conversation.isBlockedByUser2()) ||
                (!isSenderUser1 && conversation.isBlockedByUser1())) {
            throw new WrongActionException("You cannot send messages to a user who has blocked you.");
        }

        conversation.setActivatedByUser1(true);
        conversation.setActivatedByUser2(true);

        if (isSenderUser1) {
            conversation.setDeletedByUser2(false);
        } else {
            conversation.setDeletedByUser1(false);
        }

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setConversation(conversation);

        if (isSenderUser1) {
            conversation.setSeenByUser2(false);
            conversation.setSeenByUser1(true);
        } else {
            conversation.setSeenByUser1(false);
            conversation.setSeenByUser2(true);
        }

        messageRepository.save(message);
        conversationRepository.save(conversation);

        int unseenCount;
        if (receiver.getId().equals(conversation.getUser1().getId())) {
            unseenCount = conversationRepository.countUnseenAndActivatedByUser1(receiver.getId());
        } else {
            unseenCount = conversationRepository.countUnseenAndActivatedByUser2(receiver.getId());
        }

        NotificationDto dto = new NotificationDto();
        dto.setSenderUsername(sender.getUsername());
        dto.setSenderProfilePic(sender.getProfilePic());
        dto.setContent(content);
        dto.setTimestamp(message.getTimestamp());
        dto.setUnseenCount(unseenCount);

        webSocketService.sendMessageToUser(receiver.getUsername(), dto);
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
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);

        if (otherUser == null) throw new UserNotFoundException("User not found");
        if (user.getUsername().equals(username)) throw new WrongActionException("You cannot have a conversation with yourself");

        Conversation conversation = conversationRepository
                .findByUsers(user.getId(), otherUser.getId())
                .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));

        boolean isUser1 = conversation.getUser1().getId().equals(user.getId());
        boolean isActivatedForUser = isUser1 ? conversation.isActivatedByUser1() : conversation.isActivatedByUser2();
        boolean isDeletedForUser = isUser1 ? conversation.isDeletedByUser1() : conversation.isDeletedByUser2();

        if (!isActivatedForUser || isDeletedForUser) {
            throw new ConversationNotFoundException("Conversation is not available for this user");
        }

        boolean blockedByUser = isUser1 ? conversation.isBlockedByUser1() : conversation.isBlockedByUser2();
        boolean blockedUser = isUser1 ? conversation.isBlockedByUser2() : conversation.isBlockedByUser1();
        boolean isSeenByUser = isUser1 ? conversation.isSeenByUser2() : conversation.isSeenByUser1();

        List<Message> latestMessages = messageRepository.findTop15ByConversationIdOrderByTimestampDesc(conversation.getId());
        List<MessageDto> messageDtos = latestMessages.stream()
                .map(m -> new MessageDto(
                        m.getContent(),
                        m.getTimestamp(),
                        m.getSender().getUsername()))
                .collect(Collectors.toList());

        return new ConversationWithUserDto(
                otherUser.getUsername(),
                otherUser.getProfilePic(),
                messageDtos,
                blockedByUser,
                blockedUser,
                isSeenByUser
        );
    }

    @Override
    public void deleteConversation(String username) {
        ConversationContext context = getConversationContext(username);
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
        ConversationContext context = getConversationContext(username);
        if (context.isUser1) {
            context.conversation.setBlockedByUser1(!context.conversation.isBlockedByUser1());
        } else {
            context.conversation.setBlockedByUser2(!context.conversation.isBlockedByUser2());
        }
        conversationRepository.save( context.conversation);
    }

    @Override
    public void setSeen(String username) {
        ConversationContext context = getConversationContext(username);
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

    private ConversationContext getConversationContext(String username) {
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);
        if (otherUser == null) throw new UserNotFoundException("User not found");

        Conversation conversation = conversationRepository.findByUsers(user.getId(), otherUser.getId())
                .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));

        boolean isUser1 = conversation.getUser1().getId().equals(user.getId());
        return new ConversationContext(conversation, isUser1);
    }

    private static class ConversationContext {
        Conversation conversation;
        boolean isUser1;
        ConversationContext(Conversation conversation, boolean isUser1) {
            this.conversation = conversation;
            this.isUser1 = isUser1;
        }
    }

    @Override
    public List<MessageDto> getOlderMessages(String username, int page) {
        Objects.requireNonNull(username, "Username cannot be null");
        User user = userDetailsService.loadUser();
        User otherUser = userRepository.findByUsername(username);
        if (otherUser == null) throw new UserNotFoundException("User not found");
        if (user.getUsername().equals(username)) {
            throw new WrongActionException("You cannot have a conversation with yourself");
        }

        Conversation conversation = conversationRepository
                .findByUsers(user.getId(), otherUser.getId())
                .orElseThrow(() -> new ConversationNotFoundException("Conversation not found"));

        boolean isUser1 = conversation.getUser1().getId().equals(user.getId());
        boolean isActivatedForUser = isUser1 ? conversation.isActivatedByUser1() : conversation.isActivatedByUser2();
        boolean isDeletedForUser = isUser1 ? conversation.isDeletedByUser1() : conversation.isDeletedByUser2();

        if (!isActivatedForUser || isDeletedForUser) {
            throw new ConversationNotFoundException("Conversation is not available for this user");
        }

        int pageSize = 15;
        Pageable pageable = PageRequest.of(page, pageSize, Sort.by("timestamp").descending());

        Page<Message> messagePage = messageRepository.findByConversationId(conversation.getId(), pageable);

        return messagePage.getContent().stream()
                .map(m -> new MessageDto(
                        m.getContent(),
                        m.getTimestamp(),
                        m.getSender().getUsername()))
                .collect(Collectors.toList());
    }
}
