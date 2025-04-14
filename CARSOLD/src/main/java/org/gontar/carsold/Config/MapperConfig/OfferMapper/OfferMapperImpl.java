package org.gontar.carsold.Config.MapperConfig.OfferMapper;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.Offer.OfferDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class OfferMapperImpl implements Mapper<Offer, OfferDto> {

    private final ModelMapper mapper;

    public OfferMapperImpl(ModelMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public Offer mapToEntity(OfferDto offerDto) {
        return mapper.map(offerDto, Offer.class);
    }

    @Override
    public OfferDto mapToDto(Offer offer) {
        return mapper.map(offer, OfferDto.class);
    }
}
