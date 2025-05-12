package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.Offer.OfferDto;
import org.gontar.carsold.Domain.Model.Offer.OfferWithUserDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementService;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
@Validated
public class OfferManagementController {

    private final OfferManagementService service;
    private final Mapper<Offer, OfferDto> mapper;

    public OfferManagementController(OfferManagementService service, Mapper<Offer, OfferDto> mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping("/private/offer/fetch/{id}")
    public ResponseEntity<OfferDto> fetchOffer(@PathVariable Long id) {
        Offer offer = service.fetchOffer(id);
        boolean permission = service.fetchPermission(offer);
        OfferDto offerDto = mapper.mapToDto(offer);
        offerDto.setPermission(permission);

        return ResponseEntity.ok().body(offerDto);
    }

    @GetMapping("/private/offer/fetchAllForUser")
    public ResponseEntity<PagedModel<EntityModel<PartialOfferDto>>> fetchAllUserOffers(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size,
            PagedResourcesAssembler<PartialOfferDto> assembler) {
        Page<PartialOfferDto> offers = service.fetchAllUserOffers(page, size);
        PagedModel<EntityModel<PartialOfferDto>> pagedModel = assembler.toModel(offers);
        return ResponseEntity.ok(pagedModel);
    }

    @GetMapping("/public/offer/fetchWithUser/{id}")
    public ResponseEntity<OfferWithUserDto> fetchOfferWithUser(@PathVariable Long id) {
        OfferWithUserDto offerWithUserDto = service.fetchOfferWithUser(id);
        return ResponseEntity.ok(offerWithUserDto);
    }

    @PostMapping(path = "/private/offer/add", consumes = "multipart/form-data")
    public ResponseEntity<OfferDto> createOffer(@RequestPart("offer") OfferDto offerDto,
                                                @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        Offer offer = mapper.mapToEntity(offerDto);
        Offer createdOffer = service.createOffer(offer, photos);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdOffer.getId())
                .toUri();

        OfferDto createdOfferDto = mapper.mapToDto(createdOffer);
        return ResponseEntity.created(location).body(createdOfferDto);
    }

    @PutMapping("/private/offer/update/{id}")
    public ResponseEntity<OfferDto> updateOffer(@PathVariable Long id, @RequestPart("offer") OfferDto offerDto,
                                                @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        Offer offer = mapper.mapToEntity(offerDto);
        Offer updatedOffer = service.updateOffer(id, offer, photos);
        OfferDto updatedOfferDto = mapper.mapToDto(updatedOffer);

        return ResponseEntity.ok(updatedOfferDto);
    }

    @DeleteMapping("/private/offer/delete/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        service.deleteOffer(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/public/offer/fetchRandom")
    public ResponseEntity<List<PartialOfferDto>> fetchRandomOffers() {
        List<PartialOfferDto> partialOfferDtos = service.fetchRandomOffers();
        return ResponseEntity.ok(partialOfferDtos);
    }
}
