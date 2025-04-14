package org.gontar.carsold.Service.OfferService.OfferManagementService;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.Offer.OfferWithUserDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface OfferManagementService {
    Offer fetchOffer(Long id);
    List<PartialOfferDto> fetchAllUserOffers();
    OfferWithUserDto fetchOfferWithUser(Long id);
    Offer createOffer(Offer offer, List<MultipartFile> photos);
    Offer updateOffer(Long id, Offer offer, List<MultipartFile> photos);
    void deleteOffer(Long id);
    boolean fetchPermission(Offer offer);
    List<PartialOfferDto> fetchRandomOffers();
}
