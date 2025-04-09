package org.gontar.carsold.ServiceTest.OfferServiceTest.AdminServiceTest;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.Report.Report;
import org.gontar.carsold.Domain.Model.ReportDto;
import org.gontar.carsold.Repository.ReportRepository;
import org.gontar.carsold.Service.OfferService.AdminService.AdminServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AdminServiceUnitTest {

    @InjectMocks
    private AdminServiceImpl adminService;

    @Mock
    private ReportRepository reportRepository;

    @Test
    void adminFetchReports_shouldReturnListOfReportDtos() {
        Offer offer = new Offer();
        offer.setId(100L);

        Report report1 = new Report();
        report1.setId(1L);
        report1.setOffer(offer);
        report1.setReason("Spam");
        report1.setReportUsername("user1");

        Report report2 = new Report();
        report2.setId(2L);
        report2.setOffer(offer);
        report2.setReason("Inappropriate content");
        report2.setReportUsername("user2");

        List<Report> mockReports = List.of(report1, report2);

        when(reportRepository.findAll()).thenReturn(mockReports);

        List<ReportDto> result = adminService.adminFetchReports();

        assertNotNull(result);
        assertEquals(2, result.size());

        ReportDto dto1 = result.getFirst();
        assertEquals(1L, dto1.getId());
        assertEquals(100L, dto1.getOfferId());
        assertEquals("Spam", dto1.getReason());
        assertEquals("user1", dto1.getReportUsername());

        ReportDto dto2 = result.get(1);
        assertEquals(2L, dto2.getId());
        assertEquals(100L, dto2.getOfferId());
        assertEquals("Inappropriate content", dto2.getReason());
        assertEquals("user2", dto2.getReportUsername());
    }

    @Test
    void adminFetchReports_shouldReturnEmptyListWhenNoReportsExist() {
        when(reportRepository.findAll()).thenReturn(new ArrayList<>());

        List<ReportDto> result = adminService.adminFetchReports();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void adminDeleteReport_shouldDeleteById() {
        Long reportId = 10L;

        adminService.adminDeleteReport(reportId);

        verify(reportRepository).deleteById(reportId);
    }
}