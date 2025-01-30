import {render, waitFor} from '@testing-library/react';
import {useAuth} from "../../../GlobalProviders/Auth/useAuth";
import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "../TokenUtil";
import {api} from "../../AxiosConfig/AxiosConfig";

jest.mock("../../../GlobalProviders/Auth/useAuth", () => ({
    useAuth: jest.fn(),
}));

jest.mock("../../AxiosConfig/AxiosConfig", () => ({
    api: {
        get: jest.fn(),
        defaults: {
            headers: {},
        },
    },
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});  //clears console logs

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useFetchCsrf', () => {
    it('fetches CSRF token if authenticated and sets it in api.defaults.headers', async () => {
        const mockToken = 'test-csrf-token';

        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loadingAuth: false });
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { token: mockToken } });

        const TestComponent = () => {
            useFetchCsrf();
            return null;
        };
        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/csrf');
            expect(api.defaults.headers['X-CSRF-TOKEN']).toBe(mockToken);
        });
    });

    it('does not fetch CSRF token if not authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false, loadingAuth: false });

        const TestComponent = () => {
            useFetchCsrf();
            return null;
        };
        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).not.toHaveBeenCalled();
            expect(api.defaults.headers['X-CSRF-TOKEN']).toBeUndefined();
        });
    });

    it('deletes X-CSRF-TOKEN from headers if there is an error fetching CSRF', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loadingAuth: false });
        (api.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching CSRF'));

        const TestComponent = () => {
            useFetchCsrf();
            return null;
        };
        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalled();
            expect(api.defaults.headers['X-CSRF-TOKEN']).toBeUndefined();
        });
    });
});

describe('useRefreshJwt', () => {
    it('refreshes JWT token if authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
        (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });

        const TestComponent = () => {
            useRefreshJwt();
            return null;
        };
        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/refresh');
        });
    });

    it('does not refresh JWT token if not authenticated', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

        const TestComponent = () => {
            useRefreshJwt();
            return null;
        };
        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).not.toHaveBeenCalled();
        });
    });

    it('logs error if refreshing JWT fails', async () => {
        (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
        (api.get as jest.Mock).mockRejectedValueOnce(new Error('Error refreshing JWT'));

        const TestComponent = () => {
            useRefreshJwt();
            return null;
        };
        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/refresh');
            expect(console.error).toHaveBeenCalledWith("Error refreshing JWT token: ", expect.any(Error));
        });
    });
});

describe('useTrackUserActivity', () => {
    const simulateUserActivityAndAdvanceTime = (activityCount = 1, timeToAdvance = 0) => {
        const TestComponent = () => {
            useTrackUserActivity();
            return null;
        };
        render(<TestComponent />);

        for (let i = 0; i < activityCount; i++) {
            window.dispatchEvent(new MouseEvent('click'));
        }

        jest.advanceTimersByTime(timeToAdvance);
    };

    it('sends keep-alive request on user activity if not disabled', () => {
        jest.useFakeTimers();

        simulateUserActivityAndAdvanceTime(1);

        expect(api.get).toHaveBeenCalledWith('api/auth/keep-alive');
    });

    it('does not send request if disabled', () => {
        jest.useFakeTimers();

        simulateUserActivityAndAdvanceTime(1);
        jest.advanceTimersByTime(30000);

        simulateUserActivityAndAdvanceTime(1);

        expect(api.get).toHaveBeenCalledTimes(2);   //called twice because of strict mode
    });

    it('sets isDisabled to false after 1 minute and sends request again', () => {
        jest.useFakeTimers();

        simulateUserActivityAndAdvanceTime(1);
        jest.advanceTimersByTime(61000);

        simulateUserActivityAndAdvanceTime(1);

        expect(api.get).toHaveBeenCalledTimes(3);
    });
});