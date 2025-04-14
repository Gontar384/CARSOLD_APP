package org.gontar.carsold.ControllerTest.OfferControllerTest;

import org.gontar.carsold.Controller.OfferController.AdminController;
import org.gontar.carsold.Domain.Model.Report.ReportDto;
import org.gontar.carsold.Service.OfferService.AdminService.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.List;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    @InjectMocks
    private AdminController adminController;

    @Mock
    private AdminService adminService;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    @Test
    void adminDeleteOffer_shouldReturnOk() throws Exception {
        Long offerId = 1L;
        doNothing().when(adminService).adminDeleteOffer(offerId);

        mockMvc.perform(delete("/api/offer/adminDelete/{id}", offerId))
                .andExpect(status().isOk());
    }

    @Test
    void adminFetchReports_shouldReturnOk() throws Exception {
        List<ReportDto> reportDtos = List.of(new ReportDto(1L, 1L, "Scam Listing", "Inappropriate content"));
        when(adminService.adminFetchReports()).thenReturn(reportDtos);

        mockMvc.perform(get("/api/offer/adminFetchReports"))
                .andExpect(status().isOk());
    }

    @Test
    void adminDeleteReport_shouldReturnOk() throws Exception {
        Long reportId = 1L;
        doNothing().when(adminService).adminDeleteReport(reportId);

        mockMvc.perform(delete("/api/offer/adminDeleteReport/{id}", reportId))
                .andExpect(status().isOk());
    }
}