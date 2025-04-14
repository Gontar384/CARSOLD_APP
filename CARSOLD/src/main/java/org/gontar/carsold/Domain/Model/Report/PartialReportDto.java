package org.gontar.carsold.Domain.Model.Report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PartialReportDto {
    private Long offerId;
    private String reason;
}
