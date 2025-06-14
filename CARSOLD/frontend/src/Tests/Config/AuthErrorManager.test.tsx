import {render, screen, waitFor} from '@testing-library/react';
import AuthErrorManager from "../../Config/AuthConfig/AuthErrorManager.tsx";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {act} from "react";
import {AuthProvider} from "../../GlobalProviders/Auth/AuthProvider.tsx";
import {MemoryRouter} from "react-router-dom";
import {UtilProvider} from "../../GlobalProviders/Util/UtilProvider.tsx";

jest.mock('../../Config/AxiosConfig/AxiosConfig.ts', () => ({
    api: {
        get: jest.fn(),
        interceptors: {
            response: {
                use: jest.fn(),
                eject: jest.fn(),
            },
        },
    },
}));

jest.mock("../../Additional/Banners/SessionExpiredBanner.tsx", () => () => <div>Session Expired Banner</div>);

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

const setupInterceptorMock = (status: number) => {
    let onRejected: (error: unknown) => unknown;

    jest.spyOn(api.interceptors.response, 'use').mockImplementationOnce((_onFulfilled, errorHandler) => {
        onRejected = errorHandler!;
        return 1;
    });

    render(
        <MemoryRouter>
            <UtilProvider>
                <AuthProvider>
                    <AuthErrorManager/>
                </AuthProvider>
            </UtilProvider>
        </MemoryRouter>
    );

    return async () => {
        await act(async () => {
            try {
                await onRejected({response: {status}});
            } catch {
                //prevents from treating this as unhandled error
            }
        });
    };
};

describe('AuthErrorManager', () => {
    it('shows session expired banner on authentication error (401)', async () => {
        const triggerError = setupInterceptorMock(401);

        await triggerError();

        await waitFor(() => {
            expect(screen.getByText('Session Expired Banner')).toBeInTheDocument();
        });
    });

    it('does not show the banner on non-authentication error', async () => {
        const triggerError = setupInterceptorMock(500);

        await triggerError();

        await waitFor(() => {
            expect(screen.queryByText('Session Expired Banner')).not.toBeInTheDocument();
        });
    });
});