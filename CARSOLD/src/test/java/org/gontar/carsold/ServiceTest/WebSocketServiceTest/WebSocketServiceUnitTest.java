package org.gontar.carsold.ServiceTest.WebSocketServiceTest;

import org.gontar.carsold.Domain.Model.Message.NotificationDto;
import org.gontar.carsold.Domain.Model.Message.SeenStatusDto;
import org.gontar.carsold.Service.WebSocketService.WebSocketService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WebSocketServiceUnitTest {

    private SimpMessagingTemplate messagingTemplate;
    private WebSocketService webSocketService;

    @BeforeEach
    public void setUp() {
        messagingTemplate = mock(SimpMessagingTemplate.class);
        webSocketService = new WebSocketService(messagingTemplate);
    }

    @Test
    public void sendMessageToUser_shouldSendToCorrectTopic() {
        String username = "jane";
        NotificationDto notification = new NotificationDto(
                username, "profilePic", "testContent", LocalDateTime.now(), 1);
        webSocketService.sendMessageToUser(username, notification);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/messages/jane", notification);
    }

    @Test
    public void sendSeenStatus_shouldSendToSortedTopic() {
        String user1 = "alice";
        String user2 = "bob";

        webSocketService.sendSeenStatus(user1, user2, true);

        ArgumentCaptor<SeenStatusDto> captor = ArgumentCaptor.forClass(SeenStatusDto.class);

        verify(messagingTemplate, times(1))
                .convertAndSend(eq("/topic/seen/alice-bob"), captor.capture());

        assertTrue(captor.getValue().isSeen());
    }
}
