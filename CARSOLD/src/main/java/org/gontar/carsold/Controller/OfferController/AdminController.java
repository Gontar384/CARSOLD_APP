package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.ReportDto;
import org.gontar.carsold.Domain.Model.SingleBooleanDto;
import org.gontar.carsold.Service.OfferService.AdminService.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offer")
@Validated
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/adminDelete/{id}")
    public ResponseEntity<?> adminDeleteOffer(@PathVariable Long id) {
        service.adminDeleteOffer(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/report")
    public ResponseEntity<?> reportOffer(@RequestBody ReportDto reportDto) {
        service.reportOffer(reportDto.getOfferId(), reportDto.getReason());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/report/fetchAll")
    public ResponseEntity<List<ReportDto>> fetchReports() {
        List<ReportDto> reportDtos = service.fetchReports();
        return ResponseEntity.ok().body(reportDtos);
    }
}
