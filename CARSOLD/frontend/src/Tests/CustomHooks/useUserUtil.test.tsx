import { render, waitFor, screen } from '@testing-library/react';
import React from "react";
import { useAuth } from "../../GlobalProviders/Auth/useAuth";
import { api } from "../../Config/AxiosConfig/AxiosConfig";
import { useUserUtil } from "../../CustomHooks/useUserUtil";
import { useItems } from "../../GlobalProviders/Items/useItems";

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

describe('useUserUtil', () => {
    const renderUsernameFetchTestComponent = () => {
        const TestComponent = () => {
            const { handleFetchUsername, username, usernameFetched } = useUserUtil();
            React.useEffect(() => {
                handleFetchUsername();
            }, []);

            return <div>{usernameFetched ? username : 'Loading...'}</div>;
        };

        return render(<TestComponent />);
    };

    it('fetches username correctly when authenticated', async () => {
        const mockUsername = 'testUser';
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { value: mockUsername } });

        renderUsernameFetchTestComponent();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/fetchUsername');
            expect(api.get).toHaveBeenCalledTimes(1);
            expect(screen.getByText(mockUsername)).toBeInTheDocument();
        });
    });

    it('does not fetch username if not authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

        renderUsernameFetchTestComponent();

        await waitFor(() => {
            expect(api.get).not.toHaveBeenCalled();
            expect(screen.getByText("Loading...")).toBeInTheDocument();
        });
    });

    const renderPicFetchTestComponent = () => {
        const TestComponent = () => {
            const { handleFetchProfilePic, profilePic, profilePicFetched } = useUserUtil();
            React.useEffect(() => {
                handleFetchProfilePic();
            }, []);

            return <div>{profilePicFetched ? profilePic : 'Loading...'}</div>;
        };

        return render(<TestComponent />);
    };

    it('fetches profile picture correctly when authenticated', async () => {
        const mockProfilePic = 'https://example.com/profile.jpg';
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { value: mockProfilePic } });

        (useItems as jest.Mock).mockReturnValue({ setProfilePicChange: jest.fn() });

        renderPicFetchTestComponent();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/fetchProfilePic');
            expect(api.get).toHaveBeenCalledTimes(1);
            expect(screen.getByText(mockProfilePic)).toBeInTheDocument();
        });
    });

    it('does not fetch profile picture if not authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

        renderPicFetchTestComponent();

        await waitFor(() => {
            expect(api.get).not.toHaveBeenCalled();
            expect(screen.getByText("Loading...")).toBeInTheDocument();
        });
    });
});