import { render, waitFor } from '@testing-library/react';
import React from "react";
import {useAuth} from "../../GlobalProviders/Auth/useAuth";
import {api} from "../../Config/AxiosConfig/AxiosConfig";
import {useUserUtil} from "../useUserUtil.ts";
import {useItems} from "../../GlobalProviders/Items/useItems";

jest.mock('../../Config/AxiosConfig/AxiosConfig', () => ({
    api: {
        get: jest.fn(),
    },
}));

jest.mock('../../GlobalProviders/Auth/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../GlobalProviders/Items/useItems', () => ({
    useItems: jest.fn().mockReturnValue({ setProfilePicChange: jest.fn() }),
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useUserDetails', () => {
    const renderUsernameFetchTestComponent = () => {
        const TestComponent = () => {
            const { handleUsernameFetch, userDetails } = useUserUtil();
            React.useEffect(() => {
                handleUsernameFetch();
            }, []);

            return <div>{userDetails}</div>;
        };

        return render(<TestComponent />);
    }

    it('fetches username correctly when authenticated', async () => {
        const mockUsername = 'testUser';
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, checkAuth: jest.fn() });
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { username: mockUsername } });

        renderUsernameFetchTestComponent();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/get-username');
            expect(api.get).toHaveBeenCalledTimes(1);
        });

        expect(document.querySelector('div')?.textContent).toBe(mockUsername);
    });

    it('does not fetch username if not authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, checkAuth: jest.fn() });

        renderUsernameFetchTestComponent();

        await waitFor(() => {
            expect(api.get).not.toHaveBeenCalled();
        });

        expect(document.querySelector('div')?.textContent).toBe('');
    });

    const renderPicFetchTestComponent = () => {
        const TestComponent = () => {
            const { handleProfilePicFetch, profilePic } = useUserUtil();
            React.useEffect(() => {
                handleProfilePicFetch();
            }, []);

            return <div>{profilePic}</div>;
        };

        return render(<TestComponent />);
    }

    it('fetches profile picture correctly when authenticated', async () => {
        const mockProfilePic = 'https://example.com/profile.jpg';
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, checkAuth: jest.fn() });
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { profilePic: mockProfilePic } });

        (useItems as jest.Mock).mockReturnValue({ setProfilePicChange: jest.fn() });

        renderPicFetchTestComponent();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/get-profilePic');
            expect(api.get).toHaveBeenCalledTimes(1);
        });

        expect(document.querySelector('div')?.textContent).toBe(mockProfilePic);
    });

    it('does not fetch profile picture if not authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, checkAuth: jest.fn() });

        renderPicFetchTestComponent();

        await waitFor(() => {
            expect(api.get).not.toHaveBeenCalled();
        });

        expect(document.querySelector('div')?.textContent).toBe('');
    });

    const renderLogoutTestComponent = () => {
        const TestComponent = () => {
            const { logout } = useUserUtil();
            React.useEffect(() => {
                logout();
            }, []);

            return null;
        };

        return render(<TestComponent />);
    }

    it('handles logout correctly with setTimeout', async () => {
        jest.useFakeTimers();
        const mockLogoutResponse = { data: {} };
        const mockCheckAuth = jest.fn();
        (api.get as jest.Mock).mockResolvedValueOnce(mockLogoutResponse);
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, checkAuth: mockCheckAuth });

        renderLogoutTestComponent();

        jest.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/logout');
            expect(mockCheckAuth).toHaveBeenCalled();
        });

        jest.useRealTimers();
    });

    it('logs error if logout fails', async () => {
        jest.useFakeTimers();
        const mockError = new Error('Error during logout');
        const mockCheckAuth = jest.fn();
        (api.get as jest.Mock).mockRejectedValueOnce(mockError);
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, checkAuth: mockCheckAuth });

        renderLogoutTestComponent();

        jest.advanceTimersByTime(1000);

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith('Error during logout: ', mockError);
        });

        jest.useRealTimers();
    });
});