package org.gontar.carsold.Service.OfferService.FunctionalityService;

import lombok.extern.slf4j.Slf4j;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.Report.Report;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.Offer.OfferStatsDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Exception.CustomException.InappropriateActionException;
import org.gontar.carsold.Exception.CustomException.NoPermissionException;
import org.gontar.carsold.Exception.CustomException.OfferNotFound;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.ReportRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementService;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Slf4j
@Service
public class FunctionalityServiceImpl implements FunctionalityService {

    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final ReportRepository reportRepository;
    private final MyUserDetailsService userDetailsService;
    private final OfferManagementService offerManagementService;

    public FunctionalityServiceImpl(UserRepository userRepository, OfferRepository offerRepository, ReportRepository reportRepository, MyUserDetailsService userDetailsService, OfferManagementService offerManagementService) {
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
        this.reportRepository = reportRepository;
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
        Set<Offer> followedOffers = userRepository.findFollowedOffersByUserId(user.getId());
        List<PartialOfferDto> partialOfferDtos = new ArrayList<>();

        for (Offer offer : followedOffers) {
            PartialOfferDto partialOfferDto = new PartialOfferDto();
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
        return partialOfferDtos;
    }

    @Override
    public boolean followAndCheck(Long id, Boolean follow) {
        Objects.requireNonNull(id, "Id cannot be null");
        User user = userDetailsService.loadUser();
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));
        if (user.getOffers().stream().anyMatch(o -> o.getId().equals(id))) {
            throw new InappropriateActionException("User cannot follow his own offer");
        }

        Set<Offer> followedOffers = userRepository.findFollowedOffersByUserId(user.getId());
        boolean currentlyFollowing = followedOffers.stream()
                .anyMatch(o -> o.getId().equals(id));
        if (follow) {
            if (currentlyFollowing) {
                currentlyFollowing = false;
                followedOffers.removeIf(o -> o.getId().equals(id));
                offer.setFollows(offer.getFollows() - 1);
            } else {
                currentlyFollowing = true;
                followedOffers.add(offer);
                offer.setFollows(offer.getFollows() + 1);
            }
            user.setFollowedOffers(followedOffers);
            offerRepository.save(offer);
            userRepository.save(user);
        }
        return currentlyFollowing;
    }

    @Override
    public void reportOffer(Long id, String reason) {
        Objects.requireNonNull(id, "Id cannot be null");
        Objects.requireNonNull(reason, "Reason cannot be null");
        User user = userDetailsService.loadUser();
        Offer offer = offerRepository.findById(id)
                .orElseThrow(() -> new OfferNotFound("Offer not found"));
        Report report = new Report();
        report.setOffer(offer);
        report.setReason(reason);
        report.setReportUsername(user.getUsername());
        reportRepository.save(report);
    }
}
