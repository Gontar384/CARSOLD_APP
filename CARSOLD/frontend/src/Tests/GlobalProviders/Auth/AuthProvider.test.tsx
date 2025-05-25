import {render, waitFor, act, renderHook} from '@testing-library/react';
import {AuthContext, useAuth} from "../../../GlobalProviders/Auth/useAuth.ts";
import {AuthProvider} from "../../../GlobalProviders/Auth/AuthProvider.tsx";
import {checkAuth, fetchJwt, logout} from "../../../ApiCalls/Services/UserService.ts";
import {InternalServerError} from "../../../ApiCalls/Errors/CustomErrors.ts";
import {MemoryRouter} from "react-router-dom";
import {UtilProvider} from "../../../GlobalProviders/Util/UtilProvider.tsx";

jest.mock("../../../ApiCalls/Services/UserService.ts", () => ({
    checkAuth: jest.fn(),
    logout: jest.fn(),
    fetchJwt: jest.fn()
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.clear();
});

afterEach(() => {
    jest.restoreAllMocks();
});

const TestComponent = ({showLoadingAuth = true}) => {
    const {isAuthenticated, loadingAuth, handleLogout} = useAuth();
    return (
        <div>
            {showLoadingAuth
                ? loadingAuth
                    ? 'Loading'
                    : isAuthenticated
                        ? 'Authenticated'
                        : 'Not Authenticated'
                : isAuthenticated
                    ? 'Authenticated'
                    : 'Not Authenticated'}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

const renderComponent = (showLoadingAuth = true) => {
    return render(
        <MemoryRouter>
            <UtilProvider>
                <AuthProvider>
                    <TestComponent showLoadingAuth={showLoadingAuth}/>
                </AuthProvider>
            </UtilProvider>
        </MemoryRouter>
    );
};

describe('AuthProvider', () => {
    it('sets authentication state correctly when authenticated', async () => {
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 200});

        const {getByText} = renderComponent();

        expect(getByText('Loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(checkAuth).toHaveBeenCalled();
            expect(getByText('Authenticated')).toBeInTheDocument();
        });
    });

    it('sets authentication state correctly when not authenticated', async () => {
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 204});

        const {getByText} = renderComponent();

        expect(getByText('Loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(checkAuth).toHaveBeenCalled();
            expect(getByText('Not Authenticated')).toBeInTheDocument();
        });
    });

    it('handles authentication check error', async () => {
        const mockError = new Error('Auth check failed');
        (checkAuth as jest.Mock).mockRejectedValueOnce(mockError);

        const {getByText} = renderComponent();

        expect(getByText('Loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Error checking authentication: ", mockError);
            expect(getByText('Not Authenticated')).toBeInTheDocument();
        });
    });

    it('updates authentication state when localStorage changes', async () => {
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 204});

        const {getByText, rerender} = renderComponent(false);

        await waitFor(() => {
            expect(getByText('Not Authenticated')).toBeInTheDocument();
        });

        act(() => {
            localStorage.setItem('Authenticated', 'true');
            window.dispatchEvent(new StorageEvent('storage', {key: 'Authenticated', newValue: 'true'}));
        });

        rerender(
            <MemoryRouter>
                <UtilProvider>
                    <AuthProvider>
                        <TestComponent showLoadingAuth={false}/>
                    </AuthProvider>
                </UtilProvider>
            </MemoryRouter>);

        await waitFor(() => {
            expect(getByText('Authenticated')).toBeInTheDocument();
        });
    });

    it('calls fetchJwt when authenticated', async () => {
        jest.useFakeTimers();
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 200});
        (fetchJwt as jest.Mock).mockResolvedValueOnce(undefined);

        const {getByText} = renderComponent();

        expect(getByText('Loading')).toBeInTheDocument();

        await waitFor(() => {
            expect(checkAuth).toHaveBeenCalled();
            expect(getByText('Authenticated')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(fetchJwt).toHaveBeenCalledTimes(1);
        });

        act(() => {
            jest.advanceTimersByTime(5 * 60 * 1000);
        });

        await waitFor(() => {
            expect(fetchJwt).toHaveBeenCalledTimes(2);
        });

        jest.useRealTimers();
    });

    it('does not call fetchJwt when not authenticated', async () => {
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 204});

        renderComponent();

        await waitFor(() => {
            expect(checkAuth).toHaveBeenCalled();
            expect(fetchJwt).not.toHaveBeenCalled();
        });
    });

    it('logs out the user and updates authentication state', async () => {
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 200});
        (logout as jest.Mock).mockResolvedValueOnce(undefined);
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 204});

        const {getByText} = renderComponent();

        await waitFor(() => {
            expect(getByText('Authenticated')).toBeInTheDocument();
        });

        act(() => {
            getByText('Logout').click();
        });

        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
            expect(checkAuth).toHaveBeenCalledTimes(2);
            expect(getByText('Not Authenticated')).toBeInTheDocument();
        });
    });

    it('handles logout failure gracefully', async () => {
        (checkAuth as jest.Mock).mockResolvedValueOnce({status: 200});
        (logout as jest.Mock).mockRejectedValueOnce(new InternalServerError("Logout failed", undefined));

        const {getByText} = renderComponent();

        await waitFor(() => {
            expect(getByText('Authenticated')).toBeInTheDocument();
        });

        act(() => {
            getByText('Logout').click();
        });

        await waitFor(() => {
            expect(logout).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith("Error during logout: ", expect.any(InternalServerError));
            expect(getByText('Authenticated')).toBeInTheDocument();
        });
    });

    it('throws an error when used outside AuthProvider', () => {
        expect(() => {
            renderHook(() => useAuth(), {
                wrapper: ({ children }) => <>{children}</>,
            });
        }).toThrow('useAuth must be used within an AuthProvider');
    });

    it('returns correct values from context', () => {
        const mockContextValue = {
            isAuthenticated: true,
            handleCheckAuth: jest.fn(),
            handleLogout: jest.fn(),
            loadingAuth: false,
            preventFetch: false,
        };

        const { result } = renderHook(() => useAuth(), {
            wrapper: ({ children }) => (
                <AuthContext.Provider value={mockContextValue}>{children}</AuthContext.Provider>
            ),
        });

        expect(result.current).toEqual(mockContextValue);
    });
});