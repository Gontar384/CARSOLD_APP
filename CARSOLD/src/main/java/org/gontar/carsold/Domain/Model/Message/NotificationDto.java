package org.gontar.carsold.Domain.Model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private String senderUsername;
    private String senderProfilePic;
    private String content;
    private LocalDateTime timestamp;
    private Integer unseenCount;
}
