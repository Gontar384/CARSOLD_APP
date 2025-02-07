package org.gontar.carsold.Model.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecoveryPasswordChangeDto {
    private String token;
    private String password;
}
