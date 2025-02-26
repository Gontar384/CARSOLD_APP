package org.gontar.carsold.Service.OfferService.OfferManagementService;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface OfferManagementService {
    Offer createOffer(Offer offer, List<MultipartFile> photos);
    Offer fetchOffer(Long id);
    boolean fetchPermission(Offer offer);
    Offer updateOffer(Long id, Offer offer, List<MultipartFile> photos);
}
