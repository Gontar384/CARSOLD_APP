package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Config.MapperConfig.Mapper;
import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Model.OfferDto;
import org.gontar.carsold.Domain.Model.OfferWithUserDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.gontar.carsold.Service.OfferService.OfferManagementService.OfferManagementService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/offer")
@Validated
public class OfferManagementController {

    private final OfferManagementService service;
    private final Mapper<Offer, OfferDto> mapper;

    public OfferManagementController(OfferManagementService service, Mapper<Offer, OfferDto> mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping("/fetch/{id}")
    public ResponseEntity<OfferDto> fetchOffer(@PathVariable Long id) {
        Offer offer = service.fetchOffer(id);
        boolean permission = service.fetchPermission(offer);
        OfferDto offerDto = mapper.mapToDto(offer);

        return ResponseEntity.ok()
                .header("user-permission", permission ? "true" : "false")
                .body(offerDto);
    }

    @GetMapping("/fetchAllUser")
    public ResponseEntity<List<PartialOfferDto>> fetchAllUserOffers() {
        List<PartialOfferDto> partialOfferDtos = service.fetchAllUserOffers();
        return ResponseEntity.ok(partialOfferDtos);
    }

    @GetMapping("/fetchWithUser/{id}")
    public ResponseEntity<OfferWithUserDto> fetchOfferWithUser(@PathVariable Long id) {
        OfferWithUserDto offerWithUserDto = service.fetchOfferWithUser(id);
        return ResponseEntity.ok(offerWithUserDto);
    }

    @PostMapping(path = "/add", consumes = "multipart/form-data")
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

    @PutMapping("/update/{id}")
    public ResponseEntity<OfferDto> updateOffer(@PathVariable Long id, @RequestPart("offer") OfferDto offerDto,
                                                @RequestPart(value = "photos", required = false) List<MultipartFile> photos) {
        Offer offer = mapper.mapToEntity(offerDto);
        Offer updatedOffer = service.updateOffer(id, offer, photos);
        OfferDto updatedOfferDto = mapper.mapToDto(updatedOffer);

        return ResponseEntity.ok(updatedOfferDto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOffer(@PathVariable Long id) {
        service.deleteOffer(id);
        return ResponseEntity.ok().build();
    }
}
