package org.gontar.carsold.Domain.Model.Report;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportDto {
    private Long id;
    private Long offerId;
    private String reason;
    private String reportUsername;
}
