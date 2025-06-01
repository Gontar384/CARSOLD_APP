package org.gontar.carsold.Domain.Entity.Offer;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "offer_photo")
public class OfferPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "my_offer_photo_seq")
    @SequenceGenerator(name = "my_offer_photo_seq", sequenceName = "my_offer_photo_sequence", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", nullable = false)
    private Offer offer;

    @Column(name = "photo_url", nullable = false)
    private String photoUrl;
}