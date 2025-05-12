package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.Offer.OfferStatsDto;
import org.gontar.carsold.Domain.Model.Offer.PartialOfferDto;
import org.gontar.carsold.Domain.Model.Report.PartialReportDto;
import org.gontar.carsold.Domain.Model.Universal.SingleBooleanDto;
import org.gontar.carsold.Service.OfferService.FunctionalityService.FunctionalityService;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class FunctionalityController {

    private final FunctionalityService service;

    public FunctionalityController(FunctionalityService service) {
        this.service = service;
    }

    @GetMapping("/private/offer/fetchStats/{id}")
    public ResponseEntity<OfferStatsDto> fetchStats(@PathVariable Long id) {
        OfferStatsDto offerStatsDto = service.fetchStats(id);
        return ResponseEntity.ok(offerStatsDto);
    }

    @GetMapping("/private/offer/fetchAllFollowed")
    public ResponseEntity<PagedModel<EntityModel<PartialOfferDto>>> fetchAllFollowed(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size,
            PagedResourcesAssembler<PartialOfferDto> assembler) {
        Page<PartialOfferDto> offers = service.fetchAllFollowed(page, size);
        PagedModel<EntityModel<PartialOfferDto>> pagedModel = assembler.toModel(offers);
        return ResponseEntity.ok(pagedModel);
    }

    @PatchMapping("/private/offer/followAndCheck/{id}")
    public ResponseEntity<?> followAndCheck(@PathVariable Long id, @RequestBody SingleBooleanDto singleBooleanDto) {
        Boolean follow = singleBooleanDto.getValue();
        boolean result = service.followAndCheck(id, follow);
        if (result) return ResponseEntity.ok().build();
        else return ResponseEntity.noContent().build();
    }

    @PostMapping("/private/offer/report")
    public ResponseEntity<?> reportOffer(@RequestBody PartialReportDto partialReportDto) {
        service.reportOffer(partialReportDto.getOfferId(), partialReportDto.getReason());
        return ResponseEntity.ok().build();
    }
}
