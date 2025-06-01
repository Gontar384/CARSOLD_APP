package org.gontar.carsold.Service.OfferService.SearchService;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.Offer.OfferPhoto;
import org.gontar.carsold.Domain.Model.Offer.OfferFilterDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Repository.OfferRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements SearchService {

    private final OfferRepository offerRepository;
    private final OfferSpecifications offerSpecifications;

    public SearchServiceImpl(OfferRepository offerRepository, OfferSpecifications offerSpecifications) {
        this.offerRepository = offerRepository;
        this.offerSpecifications = offerSpecifications;
    }

    @Override
    public Page<PartialOfferDto> fetchFilteredOffers(OfferFilterDto filter, int page, int size) {
        Specification<Offer> spec = offerSpecifications.withFilters(filter);
        Pageable pageable = PageRequest.of(Math.max(page, 0), size > 0 ? size : 8);
        Page<Offer> offerPage = offerRepository.findAll(spec, pageable);

        return offerPage.map(this::convertToPartialDto);
    }

    private PartialOfferDto convertToPartialDto(Offer offer) {
        PartialOfferDto dto = new PartialOfferDto();
        dto.setId(offer.getId());
        dto.setTitle(offer.getTitle());
        if (offer.getPhotos() != null && !offer.getPhotos().isEmpty()) {
            dto.setPhotoUrl(offer.getPhotos().stream().findFirst().map(OfferPhoto::getPhotoUrl).orElse(null));
        }
        dto.setPrice(offer.getPrice());
        dto.setCurrency(offer.getCurrency());
        dto.setPower(offer.getPower());
        dto.setCapacity(offer.getCapacity());
        dto.setTransmission(offer.getTransmission());
        dto.setFuel(offer.getFuel());
        dto.setMileage(offer.getMileage());
        dto.setYear(offer.getYear());
        return dto;
    }
}
