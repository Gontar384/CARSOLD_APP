package org.gontar.carsold.ControllerTest.MessageControllerTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.gontar.carsold.Controller.MessageController.MessageController;
import org.gontar.carsold.Domain.Model.Message.*;
import org.gontar.carsold.Domain.Model.Universal.SingleStringDto;
import org.gontar.carsold.Service.MessageService.MessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class MessageControllerTest {

    @InjectMocks
    private MessageController messageController;

    @Mock
    private MessageService messageService;

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(messageController).build();
    }

    @Test
    public void activateConversation_shouldReturnOk() throws Exception {
        SingleStringDto dto = new SingleStringDto("john");
        doNothing().when(messageService).activateConversation(dto.getValue());

        mockMvc.perform(post("/api/private/message/activateConversation")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    public void sendMessage_shouldReturnOk() throws Exception {
        SentMessageDto dto = new SentMessageDto("john", "Hello!");
        doNothing().when(messageService).sendMessage(dto.getReceiverUsername(), dto.getContent());

        mockMvc.perform(post("/api/private/message/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    public void getUnseenCount_shouldReturnOk() throws Exception {
        UnseenMessagesCountDto unseenCountDto = new UnseenMessagesCountDto(3);
        when(messageService.getUnseenCount()).thenReturn(unseenCountDto);

        mockMvc.perform(get("/api/private/message/getUnseenCount"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unseenCount").value(3));
    }

    @Test
    public void getAllConversations_shouldReturnOk() throws Exception {
        List<ConversationDto> conversations = List.of(
                new ConversationDto("john", "pic.png", "Latest message", null, "john", true)
        );
        when(messageService.getAllConversations()).thenReturn(conversations);

        mockMvc.perform(get("/api/private/message/getAllConversations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("john"))
                .andExpect(jsonPath("$[0].lastMessage").value("Latest message"))
                .andExpect(jsonPath("$[0].seen").value(true));
    }

    @Test
    public void getConversationOnInitial_shouldReturnOk() throws Exception {
        String username = "john";
        PagedMessagesDto messages = new PagedMessagesDto();

        ConversationWithUserDto conversationDto = new ConversationWithUserDto(
                username, "pic_url.jpg", messages, false, false, true);
        when(messageService.getConversationOnInitial(username)).thenReturn(conversationDto);

        mockMvc.perform(get("/api/private/message/getConversationOnInitial/john"))
                .andExpect(status().isOk());
    }

    @Test
    public void deleteConversation_shouldReturnOk() throws Exception {
        String username = "john";
        doNothing().when(messageService).deleteConversation(username);

        mockMvc.perform(delete("/api/private/message/deleteConversation/john"))
                .andExpect(status().isOk());
    }

    @Test
    public void blockUnblockUser_shouldReturnOk() throws Exception {
        String username = "john";
        doNothing().when(messageService).blockUnblockUser(username);

        mockMvc.perform(patch("/api/private/message/blockUnblockUser/john"))
                .andExpect(status().isOk());
    }

    @Test
    public void makeSeen_shouldReturnOk() throws Exception {
        String username = "john";
        doNothing().when(messageService).makeSeen(username);

        mockMvc.perform(patch("/api/private/message/makeSeen/john"))
                .andExpect(status().isOk());
    }

    @Test
    public void getPreviousMessages_shouldReturnOk() throws Exception {
        String username = "john";
        PagedMessagesDto pagedMessagesDto = new PagedMessagesDto(List.of(), false);
        when(messageService.getPreviousMessages(username, 1)).thenReturn(pagedMessagesDto);

        mockMvc.perform(get("/api/private/message/getPreviousMessages/john/1"))
                .andExpect(status().isOk());
    }
}