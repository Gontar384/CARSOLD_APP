package org.gontar.carsold.Service.OfferService.OfferFunctionalityService;

import org.gontar.carsold.Domain.Entity.User.User;
import org.gontar.carsold.Exception.CustomException.InappropriateActionException;
import org.gontar.carsold.Repository.OfferRepository;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.MyUserDetailsService.MyUserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferFunctionalityServiceImpl implements OfferFunctionalityService {

    private final UserRepository userRepository;
    private final OfferRepository offerRepository;
    private final MyUserDetailsService userDetailsService;

    public OfferFunctionalityServiceImpl(UserRepository userRepository, OfferRepository offerRepository, MyUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.offerRepository = offerRepository;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public boolean followAndCheck(Long id, Boolean follow) {
        User user = userDetailsService.loadUser();
        if (offerRepository.findById(id).isPresent() && user.getOffers().contains(offerRepository.findById(id).get())) {
            throw new InappropriateActionException("User cannot follow his own offer");
        }
        if (follow) {
            List<String> followedOffers = user.getFollowedOffers();
            if (!followedOffers.contains(id.toString())) {
                followedOffers.add(id.toString());
            } else {
                followedOffers.remove(id.toString());
            }
            user.setFollowedOffers(followedOffers);
            userRepository.save(user);
        }
        return user.getFollowedOffers().contains(id.toString());
    }
}
