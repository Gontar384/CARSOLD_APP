package org.gontar.carsold.ServiceTest.OfferServiceTest.AdminServiceTest;

import org.gontar.carsold.Domain.Entity.Offer.Offer;
import org.gontar.carsold.Domain.Entity.Report.Report;
import org.gontar.carsold.Domain.Model.Report.ReportDto;
import org.gontar.carsold.Repository.ReportRepository;
import org.gontar.carsold.Service.OfferService.AdminService.AdminServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

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
    public void adminFetchReports_shouldReturnListOfReportDtos() {
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

        int page = 1;
        int size = 6;
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> pageResult = new PageImpl<>(List.of(report1, report2), pageable, 2);

        when(reportRepository.findAll(pageable)).thenReturn(pageResult);
        Page<ReportDto> result = adminService.adminFetchReports(page, size);

        assertNotNull(result);
        assertEquals(2, result.getContent().size());

        ReportDto dto1 = result.getContent().getFirst();
        assertEquals(1L, dto1.getId());
        assertEquals(100L, dto1.getOfferId());
        assertEquals("Spam", dto1.getReason());
        assertEquals("user1", dto1.getReportUsername());

        ReportDto dto2 = result.getContent().get(1);
        assertEquals(2L, dto2.getId());
        assertEquals(100L, dto2.getOfferId());
        assertEquals("Inappropriate content", dto2.getReason());
        assertEquals("user2", dto2.getReportUsername());

        verify(reportRepository).findAll(pageable);
    }

    @Test
    public void adminFetchReports_shouldReturnEmptyListWhenNoReportsExist() {
        int page = 0;
        int size = 6;
        Pageable pageable = PageRequest.of(page, size);
        Page<Report> emptyPage = Page.empty(pageable);

        when(reportRepository.findAll(pageable)).thenReturn(emptyPage);
        Page<ReportDto> result = adminService.adminFetchReports(page, size);

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());

        verify(reportRepository).findAll(pageable);
    }

    @Test
    public void adminDeleteReport_shouldDeleteById() {
        Long reportId = 10L;

        adminService.adminDeleteReport(reportId);

        verify(reportRepository).deleteById(reportId);
    }
}