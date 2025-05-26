import {render, waitFor, act, renderHook} from '@testing-library/react';
import {UserUtilProvider} from "../../../GlobalProviders/UserUtil/UserUtilProvider.tsx";
import {fetchProfilePic, fetchUsername} from "../../../ApiCalls/Services/UserService.ts";
import {MemoryRouter} from "react-router-dom";
import {UserUtilContext, useUserUtil} from "../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {useAuth} from "../../../GlobalProviders/Auth/useAuth.ts";
import {AuthProvider} from "../../../GlobalProviders/Auth/AuthProvider.tsx";
import {UtilProvider} from "../../../GlobalProviders/Util/UtilProvider.tsx";

jest.mock("../../../ApiCalls/Services/UserService.ts", () => ({
    fetchProfilePic: jest.fn(),
    fetchUsername: jest.fn(),
}));

jest.mock("../../../GlobalProviders/Auth/useAuth.ts", () => {
    const actual = jest.requireActual("../../../GlobalProviders/Auth/useAuth.ts");
    return {
        ...actual,
        useAuth: jest.fn(),
    };
});

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

const TestComponent = () => {
    const {username, profilePic, usernameFetched, profilePicFetched, setProfilePicChanged} = useUserUtil();

    return (
        <div>
            <div>{username}</div>
            <div>{profilePic}</div>
            <div>{usernameFetched ? 'Username Fetched' : 'Username Not Fetched'}</div>
            <div>{profilePicFetched ? 'Profile Pic Fetched' : 'Profile Pic Not Fetched'}</div>
            <button onClick={() => setProfilePicChanged(true)}>Change Profile Pic</button>
        </div>
    );
};

const renderComponent = () => {
    return render(
        <MemoryRouter>
            <UtilProvider>
                <AuthProvider>
                    <UserUtilProvider>
                        <TestComponent/>
                    </UserUtilProvider>
                </AuthProvider>
            </UtilProvider>
        </MemoryRouter>
    );
};

describe('UserUtilProvider', () => {
    it('fetches and displays username and profile pic when authenticated', async () => {
        (fetchUsername as jest.Mock).mockResolvedValueOnce({data: {value: "testuser"}});
        (fetchProfilePic as jest.Mock).mockResolvedValueOnce({data: {value: "testpic.jpg"}});
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
        });

        const {getByText} = renderComponent();

        await waitFor(() => {
            expect(fetchUsername).toHaveBeenCalled();
            expect(fetchProfilePic).toHaveBeenCalled();
            expect(getByText('testuser')).toBeInTheDocument();
            expect(getByText('testpic.jpg')).toBeInTheDocument();
        });
    });

    it('does not fetch username or profile pic if not authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
        });
        const {getByText} = renderComponent();

        await waitFor(() => {
            expect(fetchUsername).not.toHaveBeenCalled();
            expect(fetchProfilePic).not.toHaveBeenCalled();
            expect(getByText('Username Not Fetched')).toBeInTheDocument();
            expect(getByText('Profile Pic Not Fetched')).toBeInTheDocument();
        });
    });

    it('handles fetch errors for username and profile pic', async () => {
        const mockError = new Error("API Error");
        (fetchUsername as jest.Mock).mockRejectedValueOnce(mockError);
        (fetchProfilePic as jest.Mock).mockRejectedValueOnce(mockError);

        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
        });

        const {getByText} = renderComponent();

        await waitFor(() => {
            expect(fetchUsername).toHaveBeenCalled();
            expect(fetchProfilePic).toHaveBeenCalled();
            expect(getByText('Username Not Fetched')).toBeInTheDocument();
            expect(getByText('Profile Pic Not Fetched')).toBeInTheDocument();
        });

        expect(console.error).toHaveBeenCalledWith("Error fetching username: ", mockError);
        expect(console.error).toHaveBeenCalledWith("Error fetching profilePic: ", mockError);
    });

    it('updates profile pic state when profilePicChanged is set', async () => {
        const mockProfilePic = 'new-profile-pic-url';
        (fetchUsername as jest.Mock).mockResolvedValueOnce({data: {value: 'JohnDoe'}});
        (fetchProfilePic as jest.Mock).mockResolvedValueOnce({data: {value: 'profile-pic-url'}});

        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: true,
        });

        const {getByText, rerender} = renderComponent();

        await waitFor(() => {
            expect(fetchUsername).toHaveBeenCalled();
            expect(fetchProfilePic).toHaveBeenCalled();
            expect(getByText('profile-pic-url')).toBeInTheDocument();
        });

        act(() => {
            getByText('Change Profile Pic').click();
        });

        (fetchProfilePic as jest.Mock).mockResolvedValueOnce({data: {value: mockProfilePic}});

        rerender(
            <MemoryRouter>
                <UtilProvider>
                <AuthProvider>
                    <UserUtilProvider>
                        <TestComponent/>
                    </UserUtilProvider>
                </AuthProvider>
                </UtilProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(fetchProfilePic).toHaveBeenCalledTimes(3); // Called initially and after the button click
            expect(getByText(mockProfilePic)).toBeInTheDocument();
        });
    });

    it('throws error when used outside UserUtilProvider', () => {
        expect(() => {
            renderHook(() => useUserUtil(), {
                wrapper: ({children}) => <>{children}</>,
            });
        }).toThrow('useUserUtil must be used within an UserUtilProvider');
    });

    it('provides correct values from context', () => {
        const mockContextValue = {
            username: 'JohnDoe',
            profilePic: 'profile-pic-url',
            usernameFetched: true,
            profilePicFetched: true,
            setProfilePicChanged: jest.fn(),
        };

        const {result} = renderHook(() => useUserUtil(), {
            wrapper: ({children}) => (
                <UserUtilContext.Provider value={mockContextValue}>{children}</UserUtilContext.Provider>
            ),
        });

        expect(result.current).toEqual(mockContextValue);
    });
});