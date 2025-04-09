package org.gontar.carsold.Service.OfferService.AdminService;

import org.gontar.carsold.Domain.Model.ReportDto;

import java.util.List;

public interface AdminService {
    void adminDeleteOffer(Long id);
    List<ReportDto> adminFetchReports();
    void adminDeleteReport(Long id);
}
