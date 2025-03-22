package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.SingleBooleanDto;
import org.gontar.carsold.Service.OfferService.OfferFunctionalityService.OfferFunctionalityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/offer")
public class OfferFunctionalityController {

    private final OfferFunctionalityService service;

    public OfferFunctionalityController(OfferFunctionalityService service) {
        this.service = service;
    }

    @PatchMapping("/followAndCheck/{id}")
    public ResponseEntity<?> followAndCheck(@PathVariable Long id, @RequestBody SingleBooleanDto singleBooleanDto) {
        Boolean follow = singleBooleanDto.getValue();
        boolean result = service.followAndCheck(id, follow);
        if (result) return ResponseEntity.ok().build();
        else return ResponseEntity.noContent().build();
    }
}
