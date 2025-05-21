package org.gontar.carsold.Domain.Model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RecoveryPasswordEmailDto {
    private String email;
    private Boolean translate = false;
}
