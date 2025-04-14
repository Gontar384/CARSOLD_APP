package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.Report.ReportDto;
import org.gontar.carsold.Service.OfferService.AdminService.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offer")
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

    @Secured("ROLE_ADMIN")
    @GetMapping("/adminFetchReports")
    public ResponseEntity<List<ReportDto>> adminFetchReports() {
        List<ReportDto> reportDtos = service.adminFetchReports();
        return ResponseEntity.ok().body(reportDtos);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/adminDeleteReport/{id}")
    public ResponseEntity<?> adminDeleteReport(@PathVariable Long id) {
        service.adminDeleteReport(id);
        return ResponseEntity.ok().build();
    }
}
