package org.gontar.carsold.Service.OfferService.AdminService;

import org.gontar.carsold.Domain.Model.Report.ReportDto;
import org.springframework.data.domain.Page;

public interface AdminService {
    void adminDeleteOffer(Long id);
    Page<ReportDto> adminFetchReports(int page, int size);
    void adminDeleteReport(Long id);
}
