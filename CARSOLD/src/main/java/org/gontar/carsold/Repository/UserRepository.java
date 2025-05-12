package org.gontar.carsold.Repository;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.User.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);
    List<User> findByFollowedOffersContaining(Offer offer);
    @Query("SELECT o FROM User u JOIN u.followedOffers o WHERE u.id = :userId")
    Set<Offer> findFollowedOffersByUserId(@Param("userId") Long userId);
    @Query(value = "SELECT o FROM User u JOIN u.followedOffers o WHERE u.id = :userId",
            countQuery = "SELECT COUNT(o) FROM User u JOIN u.followedOffers o WHERE u.id = :userId")
    Page<Offer> findFollowedOffersByUserIdPageable(@Param("userId") Long userId, Pageable pageable);
}
