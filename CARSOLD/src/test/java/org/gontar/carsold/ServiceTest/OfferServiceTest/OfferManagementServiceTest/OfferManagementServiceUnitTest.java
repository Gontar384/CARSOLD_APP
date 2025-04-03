    package org.gontar.carsold.ServiceTest.OfferServiceTest.OfferManagementServiceTest;

    import org.gontar.carsold.Domain.Entity.Offer.Offer;
    import org.gontar.carsold.Domain.Entity.User.User;
    import org.gontar.carsold.Domain.Entity.User.UserPrincipal;
    import org.gontar.carsold.Domain.Model.PartialOfferDto;
    import org.gontar.carsold.Exception.CustomException.OfferNotFound;
    import org.gontar.carsold.Repository.OfferRepository;
    import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
    import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementServiceImpl;
    import org.junit.jupiter.api.Test;
    import org.junit.jupiter.api.extension.ExtendWith;
    import org.mockito.InjectMocks;
    import org.mockito.Mock;
    import org.mockito.junit.jupiter.MockitoExtension;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.context.SecurityContext;
    import org.springframework.security.core.context.SecurityContextHolder;

    import java.util.List;
    import java.util.Optional;
    import static org.junit.jupiter.api.Assertions.*;
    import static org.mockito.Mockito.*;

    @ExtendWith(MockitoExtension.class)
    public class OfferManagementServiceUnitTest {

        @InjectMocks
        private OfferManagementServiceImpl offerManagementService;

        @Mock
        private OfferRepository repository;

        @Mock
        private MyUserDetailsService userDetailsService;

        @Mock
        private SecurityContext securityContext;

        @Test
        public void fetchOffer_shouldReturnOffer_whenOfferExists() {
            Long offerId = 1L;
            Offer mockOffer = new Offer();
            mockOffer.setId(offerId);
            when(repository.findById(offerId)).thenReturn(Optional.of(mockOffer));

            Offer result = offerManagementService.fetchOffer(offerId);

            assertNotNull(result);
            assertEquals(offerId, result.getId());
            verify(repository).findById(offerId);
        }

        @Test
        public void fetchOffer_shouldThrowOfferNotFound_whenOfferDoesNotExist() {
            Long offerId = 1L;
            when(repository.findById(offerId)).thenReturn(Optional.empty());

            OfferNotFound exception = assertThrows(OfferNotFound.class,
                    () -> offerManagementService.fetchOffer(offerId));

            assertEquals("Offer not found", exception.getMessage());
        }

        private void authenticate(User user) {
            Authentication authentication = mock(UsernamePasswordAuthenticationToken.class);
            when(authentication.isAuthenticated()).thenReturn(true);
            when(authentication.getPrincipal()).thenReturn(new UserPrincipal(user));
            when(securityContext.getAuthentication()).thenReturn(authentication);
            SecurityContextHolder.setContext(securityContext);
        }

        @Test
        public void fetchPermission_shouldReturnTrue_whenUserHasPermission() {
            User mockUser = new User();
            mockUser.setId(1L);
            Offer mockOffer = new Offer();
            mockOffer.setUser(mockUser);
            authenticate(mockUser);
            when(userDetailsService.loadUser()).thenReturn(mockUser);

            boolean hasPermission = offerManagementService.fetchPermission(mockOffer);

            assertTrue(hasPermission);
            verify(userDetailsService).loadUser();
        }

        @Test
        public void fetchPermission_shouldReturnFalse_whenUserDoesNotHavePermission() {
            Long userId = 1L;
            Long otherUserId = 2L;
            User mockUser = new User();
            mockUser.setId(userId);
            User otherUser = new User();
            otherUser.setId(otherUserId);
            Offer mockOffer = new Offer();
            mockOffer.setUser(otherUser);
            authenticate(mockUser);
            when(userDetailsService.loadUser()).thenReturn(mockUser);

            boolean hasPermission = offerManagementService.fetchPermission(mockOffer);

            assertFalse(hasPermission);
            verify(userDetailsService).loadUser();
        }

        @Test
        public void fetchAllUserOffers_shouldReturnAllOffers_whenUserHasPermission() {
            User mockUser = new User();
            mockUser.setId(1L);
            when(userDetailsService.loadUser()).thenReturn(mockUser);

            Offer offer1 = new Offer();
            offer1.setId(101L);
            offer1.setTitle("Car A");
            offer1.setUser(mockUser);

            Offer offer2 = new Offer();
            offer2.setId(102L);
            offer2.setTitle("Car B");
            offer2.setUser(mockUser);

            when(repository.findAllByUserId(mockUser.getId())).thenReturn(List.of(offer1, offer2));

            List<PartialOfferDto> result = offerManagementService.fetchAllUserOffers();

            assertNotNull(result);
            assertEquals(2, result.size());

            verify(repository).findAllByUserId(mockUser.getId());
        }
    }