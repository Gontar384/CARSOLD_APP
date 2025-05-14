//package org.gontar.carsold.ControllerTest.MessageControllerTest;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.gontar.carsold.Controller.MessageController.MessageController;
//import org.gontar.carsold.Domain.Model.Message.*;
//import org.gontar.carsold.Domain.Model.Universal.SingleStringDto;
//import org.gontar.carsold.Service.MessageService.MessageService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import java.util.List;
//
//import static org.mockito.Mockito.doNothing;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@ExtendWith(MockitoExtension.class)
//public class MessageControllerTest {
//
//    @InjectMocks
//    private MessageController messageController;
//
//    @Mock
//    private MessageService messageService;
//
//    private MockMvc mockMvc;
//
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    @BeforeEach
//    public void setup() {
//        mockMvc = MockMvcBuilders.standaloneSetup(messageController).build();
//    }
//
//    @Test
//    public void activateConversation_shouldReturnOk() throws Exception {
//        SingleStringDto dto = new SingleStringDto("jane");
//        doNothing().when(messageService).activateConversation(dto.getValue());
//
//        mockMvc.perform(post("/api/message/activateConversation")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void sendMessage_shouldReturnOk() throws Exception {
//        SentMessageDto dto = new SentMessageDto("jane", "Hello!");
//        doNothing().when(messageService).sendMessage(dto.getReceiverUsername(), dto.getContent());
//
//        mockMvc.perform(post("/api/message/send")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(dto)))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void getUnseenCount_shouldReturnOk() throws Exception {
//        UnseenMessagesCountDto unseenCountDto = new UnseenMessagesCountDto(3);
//        when(messageService.getUnseenCount()).thenReturn(unseenCountDto);
//
//        mockMvc.perform(get("/api/message/getUnseenCount"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.unseenCount").value(3));
//    }
//
//    @Test
//    public void getAllConversations_shouldReturnOk() throws Exception {
//        List<ConversationDto> conversations = List.of(
//                new ConversationDto("jane", "pic.png", "Latest message", null, "jane", true)
//        );
//        when(messageService.getAllConversations()).thenReturn(conversations);
//
//        mockMvc.perform(get("/api/message/getAllConversations"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$[0].username").value("jane"))
//                .andExpect(jsonPath("$[0].lastMessage").value("Latest message"))
//                .andExpect(jsonPath("$[0].seen").value(true));
//    }
//
//    @Test
//    public void getConversationOnInitial_shouldReturnOk() throws Exception {
//        String username = "jane";
//        PagedMessagesDto messages = new PagedMessagesDto();
//
//        ConversationWithUserDto conversationDto = new ConversationWithUserDto(
//                username, "pic_url.jpg", messages, false, false, true);
//        when(messageService.getConversationOnInitial(username)).thenReturn(conversationDto);
//
//        mockMvc.perform(get("/api/message/getConversationOnInitial/{username}", username))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void deleteConversation_shouldReturnOk() throws Exception {
//        String username = "jane";
//        doNothing().when(messageService).deleteConversation(username);
//
//        mockMvc.perform(delete("/api/message/deleteConversation/{username}", username))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void blockUnblockUser_shouldReturnOk() throws Exception {
//        String username = "jane";
//        doNothing().when(messageService).blockUnblockUser(username);
//
//        mockMvc.perform(patch("/api/message/blockUnblockUser/{username}", username))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void makeSeen_shouldReturnOk() throws Exception {
//        String username = "jane";
//        doNothing().when(messageService).makeSeen(username);
//
//        mockMvc.perform(patch("/api/message/makeSeen/{username}", username))
//                .andExpect(status().isOk());
//    }
//
//    @Test
//    public void getOlderMessages_shouldReturnOk() throws Exception {
//        String username = "jane";
//        int page = 0;
//        PagedMessagesDto pagedMessagesDto = new PagedMessagesDto(List.of(), false);
//        when(messageService.getOlderMessages(username, page)).thenReturn(pagedMessagesDto);
//
//        mockMvc.perform(get("/api/message/getOlderMessages/{username}/{page}", username, page))
//                .andExpect(status().isOk());
//    }
//}