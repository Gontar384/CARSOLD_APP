// import {render, waitFor} from '@testing-library/react';
// import {useAuth} from "../../GlobalProviders/Auth/useAuth";
// import {useFetchCsrf, useRefreshJwt, useTrackUserActivity} from "../../Config/JWTConfig/JWTConfig.ts";
// import {api} from "../../Config/AxiosConfig/AxiosConfig";
//
// jest.mock("../../GlobalProviders/Auth/useAuth", () => ({
//     useAuth: jest.fn(),
// }));
//
// jest.mock("../../Config/AxiosConfig/AxiosConfig", () => ({
//     api: {
//         get: jest.fn(),
//         defaults: {
//             headers: {},
//         },
//     },
// }));
//
// beforeEach(() => {
//     jest.clearAllMocks();
//     jest.spyOn(console, 'error').mockImplementation(() => {});
// });  //clears console logs
//
// afterEach(() => {
//     jest.restoreAllMocks();
// });
//
// describe('useFetchCsrf', () => {
//     const renderTestComponent = () => {
//         const TestComponent = () => {
//             useFetchCsrf();
//             return null;
//         };
//         return render(<TestComponent />);
//     }
//
//     it('fetches CSRF token and sets it in api.defaults.headers', async () => {
//         const mockToken = 'test-csrf-token';
//
//         (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loadingAuth: false });
//         (api.get as jest.Mock).mockResolvedValueOnce({ data: { token: mockToken } });
//
//         renderTestComponent();
//
//         await waitFor(() => {
//             expect(api.get).toHaveBeenCalledWith('api/auth/getCsrfToken');
//             expect(api.defaults.headers['X-CSRF-TOKEN']).toBe(mockToken);
//         });
//     });
//
//     it('deletes X-CSRF-TOKEN from headers if there is an error fetching CSRF', async () => {
//         (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true, loadingAuth: false });
//         (api.get as jest.Mock).mockRejectedValueOnce(new Error('Error fetching CSRF'));
//
//         renderTestComponent();
//
//         await waitFor(() => {
//             expect(api.get).toHaveBeenCalled();
//             expect(api.defaults.headers['X-CSRF-TOKEN']).toBeUndefined();
//         });
//     });
// });
//
// describe('useRefreshJwt', () => {
//     const renderTestComponent = () => {
//         const TestComponent = () => {
//             useRefreshJwt();
//             return null;
//         };
//         return render(<TestComponent />);
//     }
//
//     it('refreshes JWT token if authenticated', async () => {
//         (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
//         (api.get as jest.Mock).mockResolvedValueOnce({ data: {} });
//
//         renderTestComponent();
//
//         await waitFor(() => {
//             expect(api.get).toHaveBeenCalledWith('api/auth/refreshJwt');
//         });
//     });
//
//     it('does not refresh JWT token if not authenticated', async () => {
//         (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
//
//         renderTestComponent();
//
//         await waitFor(() => {
//             expect(api.get).not.toHaveBeenCalled();
//         });
//     });
//
//     it('logs error if refreshing JWT fails', async () => {
//         (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
//         (api.get as jest.Mock).mockRejectedValueOnce(new Error('Error refreshing JWT'));
//
//         renderTestComponent();
//
//         await waitFor(() => {
//             expect(api.get).toHaveBeenCalledWith('api/auth/refreshJwt');
//             expect(console.error).toHaveBeenCalledWith("Error refreshing JWT token: ", expect.any(Error));
//         });
//     });
// });
//
// describe('useTrackUserActivity', () => {
//     const renderTestComponentAndSimulate = (activityCount = 1, timeToAdvance = 0) => {
//         const TestComponent = () => {
//             useTrackUserActivity();
//             return null;
//         };
//         render(<TestComponent />);
//
//         for (let i = 0; i < activityCount; i++) {
//             window.dispatchEvent(new MouseEvent('click'));
//         }
//
//         jest.advanceTimersByTime(timeToAdvance);
//     };
//
//     it('sends keep-alive request on user activity if not disabled', () => {
//         jest.useFakeTimers();
//
//         renderTestComponentAndSimulate(1);
//
//         expect(api.get).toHaveBeenCalledWith('api/auth/keepSessionAlive');
//     });
//
//     it('does not send request if disabled', () => {
//         jest.useFakeTimers();
//
//         renderTestComponentAndSimulate(1);
//         jest.advanceTimersByTime(30000);
//
//         renderTestComponentAndSimulate(1);
//
//         expect(api.get).toHaveBeenCalledTimes(2);   //called twice because of strict mode
//     });
//
//     it('sets isDisabled to false after 1 minute and sends request again', () => {
//         jest.useFakeTimers();
//
//         renderTestComponentAndSimulate(1);
//         jest.advanceTimersByTime(61000);
//
//         renderTestComponentAndSimulate(1);
//
//         expect(api.get).toHaveBeenCalledTimes(2);
//     });
// });