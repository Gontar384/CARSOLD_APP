package org.gontar.carsold.ServiceTest.OfferServiceTest.FunctionalityServiceTest;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Domain.Model.Offer.OfferStatsDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Exception.CustomException.NoPermissionException;
import org.gontar.carsold.Exception.CustomException.OfferNotFound;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.ReportRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.gontar.carsold.Service.OfferService.FunctionalityService.FunctionalityServiceImpl;
import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FunctionalityServiceUnitTest {

    @InjectMocks
    private FunctionalityServiceImpl functionalityService;

    @Mock
    private OfferRepository offerRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private OfferManagementService offerManagementService;

    @Mock
    private MyUserDetailsService userDetailsService;

    @Test
    public void fetchStats_shouldReturnOfferStats() {
        Offer offer = new Offer();
        offer.setId(1L);
        offer.setViews(100L);

        when(offerRepository.findById(1L)).thenReturn(Optional.of(offer));
        when(offerManagementService.fetchPermission(offer)).thenReturn(true);
        when(offerRepository.countFollowers(1L)).thenReturn(5L);

        OfferStatsDto stats = functionalityService.fetchStats(1L);

        assertNotNull(stats);
        assertEquals(100L, stats.getViews());
        assertEquals(5L, stats.getFollows());
    }

    @Test
    public void fetchStats_shouldThrowExceptionWhenOfferNotFound() {
        when(offerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(OfferNotFound.class, () -> functionalityService.fetchStats(1L));
    }

    @Test
    public void fetchStats_shouldThrowExceptionWhenNoPermission() {
        Offer offer = new Offer();
        offer.setId(1L);

        when(offerRepository.findById(1L)).thenReturn(Optional.of(offer));
        when(offerManagementService.fetchPermission(offer)).thenReturn(false);

        assertThrows(NoPermissionException.class, () -> functionalityService.fetchStats(1L));
    }

    @Test
    public void fetchAllFollowed_shouldReturnFollowedOffers() {
        User user = new User();
        user.setId(1L);

        Offer offer1 = new Offer();
        offer1.setId(1L);
        offer1.setTitle("Car 1");

        Offer offer2 = new Offer();
        offer2.setId(2L);
        offer2.setTitle("Car 2");

        int page = 1;
        int size = 3;
        Pageable pageable = PageRequest.of(page, size);
        Page<Offer> pageResult = new PageImpl<>(List.of(offer1, offer2), pageable, 2);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(userRepository.findFollowedOffersByUserIdPageable(user.getId(), pageable)).thenReturn(pageResult);

        Page<PartialOfferDto> followedOffers = functionalityService.fetchAllFollowed(page, size);

        assertNotNull(followedOffers);
        assertEquals(2, followedOffers.getContent().size());

        Map<Long, String> offerTitles = followedOffers.getContent().stream()
                .collect(Collectors.toMap(PartialOfferDto::getId, PartialOfferDto::getTitle));

        assertTrue(offerTitles.containsKey(1L));
        assertEquals("Car 1", offerTitles.get(1L));
        assertTrue(offerTitles.containsKey(2L));
        assertEquals("Car 2", offerTitles.get(2L));

        verify(userRepository).findFollowedOffersByUserIdPageable(user.getId(), pageable);
    }

    @Test
    public void followAndCheck_shouldFollowOffer() {
        User user = new User();
        user.setOffers(new ArrayList<>());
        user.setFollowedOffers(new HashSet<>());

        Offer offer = new Offer();
        offer.setId(1L);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(offerRepository.findById(1L)).thenReturn(Optional.of(offer));
        when(userRepository.findFollowedOffersByUserId(user.getId())).thenReturn(new HashSet<>());

        boolean isFollowing = functionalityService.followAndCheck(1L, true);

        assertTrue(isFollowing);
        verify(userRepository).save(user);
        verify(offerRepository).save(offer);
    }

    @Test
    public void followAndCheck_shouldUnfollowOffer() {
        User user = new User();
        user.setId(1L);
        user.setOffers(new ArrayList<>());

        Offer offer = new Offer();
        offer.setId(1L);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(offerRepository.findById(1L)).thenReturn(Optional.of(offer));
        when(userRepository.findFollowedOffersByUserId(1L)).thenReturn(new HashSet<>(Set.of(offer)));
        when(userRepository.findFollowedOffersByUserId(1L)).thenReturn(new HashSet<>(Set.of(offer)));

        boolean isFollowing = functionalityService.followAndCheck(1L, true);

        assertFalse(isFollowing);
        verify(userRepository).save(user);
        verify(offerRepository).save(offer);
    }

    @Test
    public void reportOffer_shouldSaveReportWhenValidInput() {
        Long offerId = 1L;
        String reason = "Inappropriate content";

        User user = new User();
        user.setUsername("testUser");

        Offer offer = new Offer();
        offer.setId(offerId);

        when(userDetailsService.loadUser()).thenReturn(user);
        when(offerRepository.findById(offerId)).thenReturn(Optional.of(offer));

        functionalityService.reportOffer(offerId, reason);

        verify(reportRepository).save(argThat(report ->
                report.getOffer().equals(offer) &&
                        report.getReason().equals(reason) &&
                        report.getReportUsername().equals("testUser")
        ));
    }

    @Test
    public void reportOffer_shouldThrowExceptionWhenOfferNotFound() {
        Long offerId = 999L;
        String reason = "Scam listing";

        when(offerRepository.findById(offerId)).thenReturn(Optional.empty());

        assertThrows(OfferNotFound.class, () -> functionalityService.reportOffer(offerId, reason));
    }
}
