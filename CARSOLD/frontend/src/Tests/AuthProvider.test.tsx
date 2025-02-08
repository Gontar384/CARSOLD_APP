    import { render, waitFor, act } from '@testing-library/react';
    import {api} from "../Config/AxiosConfig/AxiosConfig.ts";
    import {useAuth} from "../GlobalProviders/Auth/useAuth.ts";
    import {AuthProvider} from "../GlobalProviders/Auth/AuthProvider.tsx";

    jest.mock('../Config/AxiosConfig/AxiosConfig.ts', () => ({
        api: {
            get: jest.fn(),
        },
    }));

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {});
        localStorage.clear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const TestComponent = ({ showLoadingAuth = true }) => {
        const { isAuthenticated, loadingAuth } = useAuth();
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
            </div>
        );
    };

    const renderComponent = (showLoadingAuth: boolean = true) => {
        return render(
            <AuthProvider>
                <TestComponent showLoadingAuth={showLoadingAuth} />
            </AuthProvider>
        );
    };

    describe('AuthProvider', () => {
        it('sets authentication state correctly when authenticated', async () => {
            (api.get as jest.Mock).mockResolvedValueOnce({ data: { isAuth: true } });

            const { getByText } = renderComponent();

            expect(getByText('Loading')).toBeInTheDocument();

            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('api/auth/check-authentication');
                expect(getByText('Authenticated')).toBeInTheDocument();
            });
        });

        it('sets authentication state correctly when not authenticated', async () => {
            (api.get as jest.Mock).mockResolvedValueOnce({ data: { isAuth: false } });

            const { getByText } = renderComponent();

            expect(getByText('Loading')).toBeInTheDocument();

            await waitFor(() => {
                expect(api.get).toHaveBeenCalledWith('api/auth/check-authentication');
                expect(getByText('Not Authenticated')).toBeInTheDocument();
            });
        });

        it('handles authentication check error', async () => {
            const mockError = new Error('Auth check failed');
            (api.get as jest.Mock).mockRejectedValueOnce(mockError);

            const { getByText } = renderComponent();

            expect(getByText('Loading')).toBeInTheDocument();

            await waitFor(() => {
                expect(console.error).toHaveBeenCalledWith('Error checking authentication: ', mockError);
                expect(getByText('Not Authenticated')).toBeInTheDocument();
            });
        });

        it('updates authentication state when localStorage changes', async () => {
            (api.get as jest.Mock).mockResolvedValueOnce({ data: { isAuth: false } });

            const { getByText, rerender } = renderComponent(false);

            await waitFor(() => {
                expect(getByText('Not Authenticated')).toBeInTheDocument();
            });

            act(() => {
                localStorage.setItem('Authenticated', 'true');
                window.dispatchEvent(new StorageEvent('storage', { key: 'Authenticated', newValue: 'true' }));
            });

            rerender(<AuthProvider><TestComponent showLoadingAuth={false} /></AuthProvider>);

            await waitFor(() => {
                expect(getByText('Authenticated')).toBeInTheDocument();
            });
        });
    });
