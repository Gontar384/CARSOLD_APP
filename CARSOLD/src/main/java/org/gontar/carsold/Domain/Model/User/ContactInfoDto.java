package org.gontar.carsold.Domain.Model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactInfoDto {
    private String name;
    private String phone;
    private String city;
}
