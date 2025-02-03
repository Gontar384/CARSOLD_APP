package org.gontar.carsold.ServiceTest.UserContactInfoServiceTest;

import jakarta.servlet.http.HttpServletRequest;
import org.gontar.carsold.Exceptions.ErrorHandler;
import org.gontar.carsold.Exceptions.CustomExceptions.InvalidJwtException;
import org.gontar.carsold.Model.User;
import org.gontar.carsold.Repository.UserRepository;
import org.gontar.carsold.Service.JwtService.JwtService;
import org.gontar.carsold.Service.UserService.UserContactInfoService.UserContactInfoServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserContactInfoServiceUnitTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private HttpServletRequest request;

    @Mock
    private UserRepository repo;

    @Mock
    private ErrorHandler errorHandler;

    @InjectMocks
    private UserContactInfoServiceImpl service;

    @Test
    public void testChangeContactInfoPublic_failure_problemWithRequest() {
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidJwtException("JWT is missing in the cookie"));

        boolean result = service.changeContactInfoPublic(request, true);

        assertFalse(result, "Should return false, problem with request");
        verify(jwtService).extractUserFromRequest(request);
        verify(errorHandler).logBoolean("Error changing contact info: JWT is missing in the cookie");
        verifyNoMoreInteractions(jwtService, errorHandler);
    }

    @Test
    public void testChangeContactInfoPublic_success_changedToTrue() {
        User mockuser = new User();
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockuser);

        boolean result = service.changeContactInfoPublic(request, true);

        assertTrue(result, "Should return true, changed successfully");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testChangeContactInfoPublic_success_changedToFalse() {
        User mockuser = new User();
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockuser);

        boolean result = service.changeContactInfoPublic(request, false);

        assertFalse(result, "Should return false, changed successfully");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testFetchContactInfoPublic_failure_isNull() {
        User mockuser = new User();
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockuser);

        boolean result = service.fetchContactInfoPublic(request);

        assertFalse(result, "Should return false, contactPublic is null");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testFetchContactInfoPublic_success_isTrue() {
        User mockuser = new User();
        mockuser.setContactPublic(true);
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockuser);

        boolean result = service.fetchContactInfoPublic(request);

        assertTrue(result, "Should return true, contactPublic is true");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testFetchContactInfoPublic_success_isFalse() {
        User mockuser = new User();
        mockuser.setContactPublic(false);
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockuser);

        boolean result = service.fetchContactInfoPublic(request);

        assertFalse(result, "Should return false, contactPublic is false");
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }

    @Test
    public void testFetchInfo_failure_problemWithRequest() {
        when(jwtService.extractUserFromRequest(request))
                .thenThrow(new InvalidJwtException("JWT is missing in the cookie"));

        Map<String, String> result = service.fetchInfo(request);

        assertEquals(Collections.emptyMap(), result);
        verify(jwtService).extractUserFromRequest(request);
        verify(errorHandler).logVoid("Error fetching info: JWT is missing in the cookie");
        verifyNoMoreInteractions(jwtService, errorHandler);
    }

    @Test
    public void testFetchInfo_success() {
        User mockuser = new User();
        mockuser.setName("Kuba");
        mockuser.setPhone("+48721721721");
        mockuser.setCity("Warsaw, Poland");
        when(jwtService.extractUserFromRequest(request)).thenReturn(mockuser);

        Map<String, String> result = service.fetchInfo(request);
        assertEquals("Kuba", result.get("name"));
        assertEquals("+48721721721", result.get("phone"));
        assertEquals("Warsaw, Poland", result.get("city"));
        verify(jwtService).extractUserFromRequest(request);
        verifyNoMoreInteractions(jwtService);
    }
}
