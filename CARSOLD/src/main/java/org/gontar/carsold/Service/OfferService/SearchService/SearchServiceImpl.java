package org.gontar.carsold.Service.OfferService.SearchService;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.OfferFilterDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.gontar.carsold.Repository.OfferRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    private final OfferRepository offerRepository;
    private final OfferSpecifications offerSpecifications;

    public SearchServiceImpl(OfferRepository offerRepository, OfferSpecifications offerSpecifications) {
        this.offerRepository = offerRepository;
        this.offerSpecifications = offerSpecifications;
    }

    @Override
    public List<PartialOfferDto> fetchFilteredOffers(OfferFilterDto filter) {
        Specification<Offer> spec = offerSpecifications.withFilters(filter);
        List<Offer> offers = offerRepository.findAll(spec);

        return offers.stream()
                .map(this::convertToPartialDto)
                .collect(Collectors.toList());
    }

    private PartialOfferDto convertToPartialDto(Offer offer) {
        PartialOfferDto dto = new PartialOfferDto();
        dto.setId(offer.getId());
        dto.setTitle(offer.getTitle());
        if (offer.getPhotos() != null && !offer.getPhotos().isEmpty()) {
            dto.setPhotoUrl(offer.getPhotos().getFirst());
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
