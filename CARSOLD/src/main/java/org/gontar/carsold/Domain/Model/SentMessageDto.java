package org.gontar.carsold.Domain.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SentMessageDto {
    private String senderUsername;
    private String receiverUsername;
    private String content;
}
