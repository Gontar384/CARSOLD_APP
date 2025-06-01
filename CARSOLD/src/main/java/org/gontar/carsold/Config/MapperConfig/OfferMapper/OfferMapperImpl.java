package org.gontar.carsold.Config.MapperConfig.OfferMapper;

import jakarta.annotation.PostConstruct;
import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.Offer.OfferPhoto;
import org.gontar.carsold.Domain.Model.Offer.OfferDto;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OfferMapperImpl implements Mapper<Offer, OfferDto> {

    private final ModelMapper mapper;

    public OfferMapperImpl(ModelMapper mapper) {
        this.mapper = mapper;
    }

    @PostConstruct
    public void setupMappings() {
        Converter<List<OfferPhoto>, List<String>> photosConverter = context -> {
            List<OfferPhoto> photos = context.getSource();
            if (photos == null) return List.of();
            return photos.stream()
                    .map(OfferPhoto::getPhotoUrl)
                    .toList();
        };
        this.mapper.typeMap(Offer.class, OfferDto.class).addMappings(mapping -> {
            mapping.using(photosConverter).map(Offer::getPhotos, OfferDto::setPhotos);
        });
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
