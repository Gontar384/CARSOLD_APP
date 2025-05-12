package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long>, JpaSpecificationExecutor<Offer> {
    Page<Offer> findAllByUserId(Long id, Pageable pageable);
    @Query(value = "SELECT * FROM offer ORDER BY RANDOM() LIMIT 3", nativeQuery = true)
    List<Offer> findRandomOffers();
    @Query("SELECT COUNT(o) FROM Offer o WHERE o.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);
}
