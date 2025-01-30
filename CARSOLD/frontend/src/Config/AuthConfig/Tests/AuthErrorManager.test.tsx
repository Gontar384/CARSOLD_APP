import {render, screen, waitFor} from '@testing-library/react';
import AuthErrorManager from "../AuthErrorManager";
import {api} from "../../AxiosConfig/AxiosConfig";
import {act} from "react";

jest.mock('../../AxiosConfig/AxiosConfig', () => ({
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

jest.mock("../../../SharedComponents/Additional/Banners/SessionExpiredBanner.tsx", () => () => <div>Session Expired Banner</div>);

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});  //clears console logs

afterEach(() => {
    jest.restoreAllMocks();
});

describe('AuthErrorManager', () => {
    it('shows session expired banner on authentication error (401)', async () => {
        let onRejected: (error: unknown) => unknown;

        jest.spyOn(api.interceptors.response, 'use').mockImplementationOnce((_onFulfilled, errorHandler) => {
            onRejected = errorHandler!;
            return 1;
        });

        render(<AuthErrorManager />);

        await act(async () => {
            try {
                await onRejected({ response: { status: 401 } });
            } catch {
                //prevents from treating this as unhandled error
            }
        });

        await waitFor(() => {
            expect(screen.getByText('Session Expired Banner')).toBeInTheDocument();
        });
    });

    it('does not show the banner on non-authentication error', async () => {
        let onRejected: (error: unknown) => unknown;

        jest.spyOn(api.interceptors.response, 'use').mockImplementationOnce((_onFulfilled, errorHandler) => {
            onRejected = errorHandler!;
            return 1;
        });

        render(<AuthErrorManager />);

        await act(async () => {
            try {
                await onRejected({ response: { status: 500 } });
            } catch {
                //prevents from treating this as unhandled error
            }
        });

        await waitFor(() => {
            expect(screen.queryByText('Session Expired Banner')).not.toBeInTheDocument();
        });
    });
});