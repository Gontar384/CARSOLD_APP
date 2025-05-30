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
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.PagedModel;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
public class AdminControllerTest {

    @InjectMocks
    private AdminController adminController;

    @Mock
    private AdminService adminService;

    @Mock
    private PagedResourcesAssembler<ReportDto> pagedResourcesAssembler;

    private MockMvc mockMvc;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(adminController).build();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void adminDeleteOffer_shouldReturnOk() throws Exception {
        doNothing().when(adminService).adminDeleteOffer(1L);

        mockMvc.perform(delete("/api/private/admin/deleteOffer/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void adminFetchReports_shouldReturnOk_withDefaultParams() throws Exception {
        when(adminService.adminFetchReports(0, 6)).thenReturn(Page.empty());
        lenient().when(pagedResourcesAssembler.toModel(any())).thenReturn(PagedModel.empty());

        mockMvc.perform(get("/api/private/admin/fetchReports"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void adminDeleteReport_shouldReturnOk() throws Exception {
        doNothing().when(adminService).adminDeleteReport(1L);

        mockMvc.perform(delete("/api/private/admin/deleteReport/1"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    public void adminDeleteUser_shouldReturnOk() throws Exception {
        doNothing().when(adminService).adminDeleteUser("testUser");

        mockMvc.perform(delete("/api/private/admin/deleteUser/testUser"))
                .andExpect(status().isOk());
    }
}