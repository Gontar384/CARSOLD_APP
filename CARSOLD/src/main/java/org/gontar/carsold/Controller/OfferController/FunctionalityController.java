package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.OfferStatsDto;
import org.gontar.carsold.Domain.Model.PartialOfferDto;
import org.gontar.carsold.Domain.Model.SingleBooleanDto;
import org.gontar.carsold.Service.OfferService.FunctionalityService.FunctionalityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offer")
public class FunctionalityController {

    private final FunctionalityService service;

    public FunctionalityController(FunctionalityService service) {
        this.service = service;
    }

    @GetMapping("/fetchStats/{id}")
    public ResponseEntity<OfferStatsDto> fetchStats(@PathVariable Long id) {
        OfferStatsDto offerStatsDto = service.fetchStats(id);
        return ResponseEntity.ok(offerStatsDto);
    }

    @GetMapping("/fetchAllFollowed")
    public ResponseEntity<List<PartialOfferDto>> fetchAllFollowed() {
        List<PartialOfferDto> partialOfferDtos = service.fetchAllFollowed();
        return ResponseEntity.ok(partialOfferDtos);
    }

    @PatchMapping("/followAndCheck/{id}")
    public ResponseEntity<?> followAndCheck(@PathVariable Long id, @RequestBody SingleBooleanDto singleBooleanDto) {
        Boolean follow = singleBooleanDto.getValue();
        boolean result = service.followAndCheck(id, follow);
        if (result) return ResponseEntity.ok().build();
        else return ResponseEntity.noContent().build();
    }
}
