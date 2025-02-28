package org.gontar.carsold.Domain.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartialOfferDto {
    private Long id;
    private String title;
    private String photoUrl;
    private Integer price;
    private String currency;
    private Integer power;
    private Integer capacity;
    private String transmission;
    private String fuel;
    private Integer mileage;
    private Integer year;
}
