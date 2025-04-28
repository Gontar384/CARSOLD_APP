package org.gontar.carsold.Domain.Entity.Report;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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

    @ManyToOne
    @JoinColumn(name = "offer_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @NotNull(message = "Offer cannot be null")
    private Offer offer;

    @Column(nullable = false)
    @NotBlank(message = "Reason cannot be empty")
    private String reason;

    @Column(nullable = false)
    @NotBlank(message = "ReportUsername cannot be empty")
    private String reportUsername;
}
