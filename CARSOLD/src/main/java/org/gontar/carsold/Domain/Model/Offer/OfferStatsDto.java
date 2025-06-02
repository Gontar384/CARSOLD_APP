package org.gontar.carsold.Domain.Model.Offer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OfferStatsDto {
    private Long views;
    private Long follows;
}
