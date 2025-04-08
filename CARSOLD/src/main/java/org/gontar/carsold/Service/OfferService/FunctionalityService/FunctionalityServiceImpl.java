package org.gontar.carsold.Service.OfferService.FunctionalityService;

import lombok.extern.slf4j.Slf4j;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.OfferStatsDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.gontar.carsold.Exception.CustomException.InappropriateActionException;
import org.gontar.carsold.Exception.CustomException.NoPermissionException;
import org.gontar.carsold.Exception.CustomException.OfferNotFound;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementService;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
public class FunctionalityServiceImpl implements FunctionalityService {

    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final MyUserDetailsService userDetailsService;
    private final OfferManagementService offerManagementService;

    public FunctionalityServiceImpl(UserRepository userRepository, OfferRepository offerRepository, MyUserDetailsService userDetailsService, OfferManagementService offerManagementService) {
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
        this.userDetailsService = userDetailsService;
        this.offerManagementService = offerManagementService;
    }

    @Override
    public OfferStatsDto fetchStats(Long id) {
        Objects.requireNonNull(id, "Id cannot be null");
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));
        if (!offerManagementService.fetchPermission(offer)) {
            throw new NoPermissionException("User has no permission to update offer");
        }
        OfferStatsDto offerStatsDto = new OfferStatsDto();
        offerStatsDto.setViews(offer.getViews());
        offerStatsDto.setFollows(offer.getFollows());
        return offerStatsDto;
    }

    @Override
    public List<PartialOfferDto> fetchAllFollowed() {
        User user = userDetailsService.loadUser();
        List<String> followedOffersIds = user.getFollowedOffers();
        List<PartialOfferDto> partialOfferDtos = new ArrayList<>();
        for (String followedOfferId : followedOffersIds) {
            PartialOfferDto partialOfferDto = new PartialOfferDto();
            Offer offer = offerRepository.findById(Long.parseLong(followedOfferId))
                    .orElseGet(() -> {
                        log.info("Offer with ID {} not found", followedOfferId);
                        return null;
                    });
            if (offer != null) {
                partialOfferDto.setId(offer.getId());
                partialOfferDto.setTitle(offer.getTitle());
                if (offer.getPhotos() != null && !offer.getPhotos().isEmpty()) {
                    partialOfferDto.setPhotoUrl(offer.getPhotos().getFirst());
                }
                partialOfferDto.setPrice(offer.getPrice());
                partialOfferDto.setCurrency(offer.getCurrency());
                partialOfferDto.setPower(offer.getPower());
                partialOfferDto.setCapacity(offer.getCapacity());
                partialOfferDto.setTransmission(offer.getTransmission());
                partialOfferDto.setFuel(offer.getFuel());
                partialOfferDto.setMileage(offer.getMileage());
                partialOfferDto.setYear(offer.getYear());
                partialOfferDtos.add(partialOfferDto);
            }
        }
        return partialOfferDtos;
    }

    @Override
    public boolean followAndCheck(Long id, Boolean follow) {
        Objects.requireNonNull(id, "Id cannot be null");
        User user = userDetailsService.loadUser();
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));
        if (user.getOffers().contains(offer)) {
            throw new InappropriateActionException("User cannot follow his own offer");
        }
        if (follow) {
            List<String> followedOffers = user.getFollowedOffers();
            if (!followedOffers.contains(id.toString())) {
                followedOffers.add(id.toString());
                offer.setFollows(offer.getFollows() + 1);
            } else {
                followedOffers.remove(id.toString());
                offer.setFollows(offer.getFollows() - 1);
            }
            offerRepository.save(offer);
            user.setFollowedOffers(followedOffers);
            userRepository.save(user);
        }
        return user.getFollowedOffers().contains(id.toString());
    }
}
