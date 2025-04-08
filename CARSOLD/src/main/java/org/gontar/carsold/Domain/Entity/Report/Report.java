package org.gontar.carsold.Domain.Entity.Report;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_report_seq")
    @SequenceGenerator(name = "my_report_seq", sequenceName = "my_report_sequence", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    @NotNull(message = "OfferId cannot be null")
    private Long offerId;

    @Column(nullable = false)
    @NotBlank(message = "Reason cannot be empty")
    private String reason;
}
