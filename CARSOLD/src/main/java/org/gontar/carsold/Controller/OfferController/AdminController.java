package org.gontar.carsold.Controller.OfferController;

import org.gontar.carsold.Domain.Model.Report.ReportDto;
import org.gontar.carsold.Service.OfferService.AdminService.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/private/admin/deleteOffer/{id}")
    public ResponseEntity<?> adminDeleteOffer(@PathVariable Long id) {
        service.adminDeleteOffer(id);
        return ResponseEntity.ok().build();
    }

    @Secured("ROLE_ADMIN")
    @GetMapping("/private/admin/fetchReports")
    public ResponseEntity<PagedModel<EntityModel<ReportDto>>> adminFetchReports(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size,
            PagedResourcesAssembler<ReportDto> assembler) {
        Page<ReportDto> reports = service.adminFetchReports(page, size);
        PagedModel<EntityModel<ReportDto>> pagedModel = assembler.toModel(reports);
        return ResponseEntity.ok().body(pagedModel);
    }

    @Secured("ROLE_ADMIN")
    @DeleteMapping("/private/admin/deleteReport/{id}")
    public ResponseEntity<?> adminDeleteReport(@PathVariable Long id) {
        service.adminDeleteReport(id);
        return ResponseEntity.ok().build();
    }
}
