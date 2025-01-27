import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuth } from '../../../GlobalProviders/Auth/useAuth'; // Adjust the import path if needed
import { api } from '../../AxiosConfig/AxiosConfig'; // Adjust the import path if needed
import { useFetchCsrf } from '../TokenUtil'; // Adjust the import path if needed

// Mock the useAuth hook to control the authentication state
vi.mock('../../../GlobalProviders/Auth/useAuth', () => ({
    useAuth: vi.fn(),
}));

// Mock the api get method
vi.mock('../../AxiosConfig/AxiosConfig', () => ({
    api: {
        get: vi.fn(),
        defaults: {
            headers: {},
        },
    },
}));

// Component to use the hook for testing
const TestComponent: React.FC = () => {
    useFetchCsrf();
    return <div>Test Component</div>;
};

describe('useFetchCsrf', () => {
    it('sets the X-CSRF-TOKEN header when authenticated', async () => {
        api.get = vi.fn().mockResolvedValueOnce({ data: { token: 'mock-csrf-token' } });

        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            checkAuth: vi.fn(),
            loadingAuth: false,
        });

        render(<TestComponent />);

        await waitFor(() => {
            // Assert that the CSRF token is set in the headers
            expect(api.defaults.headers['X-CSRF-TOKEN']).toBe('mock-csrf-token');
        });
    });

    it('does not set CSRF token header when not authenticated', async () => {
        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: false,
            checkAuth: vi.fn(),
            loadingAuth: false,
        });

        render(<TestComponent />);

        await waitFor(() => {
            // Assert that the CSRF token is not set in the headers
            expect(api.defaults.headers['X-CSRF-TOKEN']).toBeUndefined();
        });
    });

    it('handles errors gracefully when fetching CSRF token', async () => {
        // Mock API failure
        api.get = vi.fn().mockRejectedValueOnce(new Error('Error fetching CSRF token'));

        vi.mocked(useAuth).mockReturnValue({
            isAuthenticated: true,
            checkAuth: vi.fn(),
            loadingAuth: false,
        });

        render(<TestComponent />);

        await waitFor(() => {
            // Assert that CSRF token is not set in headers after an error occurs
            expect(api.defaults.headers['X-CSRF-TOKEN']).toBeUndefined();
        });
    });
});