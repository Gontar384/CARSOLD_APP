import { render, screen, waitFor } from '@testing-library/react';
import AuthErrorManager from "../../Config/AuthConfig/AuthErrorManager";
import { api } from "../../Config/AxiosConfig/AxiosConfig";
import { act } from "react";
import {AuthProvider} from "../../GlobalProviders/Auth/AuthProvider";

jest.mock('../../Config/AxiosConfig/AxiosConfig', () => ({
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

jest.mock("../../SharedComponents/Additional/Banners/SessionExpiredBanner", () => () => <div>Session Expired Banner</div>);

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
        <AuthProvider>
            <AuthErrorManager />
        </AuthProvider>
    );

    return async () => {
        await act(async () => {
            try {
                await onRejected({ response: { status } });
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