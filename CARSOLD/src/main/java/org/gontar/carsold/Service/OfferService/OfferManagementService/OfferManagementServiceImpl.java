package org.gontar.carsold.Service.OfferService.OfferManagementService;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Repository.OfferRepository;
import org.springframework.stereotype.Service;

@Service
public class OfferManagementServiceImpl implements OfferManagementService {

    private final OfferRepository repository;

    public OfferManagementServiceImpl(OfferRepository repository) {
        this.repository = repository;
    }

    @Override
    public Offer createOffer(Offer offer) {
        return null;
    }
}
