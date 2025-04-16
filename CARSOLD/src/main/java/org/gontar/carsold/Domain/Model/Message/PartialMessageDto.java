package org.gontar.carsold.Domain.Model.Message;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartialMessageDto {
    private String content;
    private LocalDateTime timestamp;
    private boolean seen;
}
