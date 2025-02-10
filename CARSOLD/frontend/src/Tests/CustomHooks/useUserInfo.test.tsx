import { render, waitFor } from '@testing-library/react';
import { api } from "../../Config/AxiosConfig/AxiosConfig";
import { useUserInfo } from "../../CustomHooks/useUserInfo";

jest.mock('../../Config/AxiosConfig/AxiosConfig', () => ({
    api: {
        get: jest.fn(),
    },
}));

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useUserInfo', () => {
    it('checks if email exists', async () => {
        const mockEmail = 'test@example.com';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { value: true } });

        const TestComponent = () => {
            const { handleCheckInfo } = useUserInfo();
            handleCheckInfo(mockEmail);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/checkInfo', {
                params: { login: mockEmail },
            });
        });
    });

    it('checks if username exists', async () => {
        const mockUsername = 'testUser';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { value: true } });

        const TestComponent = () => {
            const { handleCheckInfo } = useUserInfo();
            handleCheckInfo(mockUsername);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/checkInfo', {
                params: { login: mockUsername },
            });
        });
    });

    it('checks if user account is active', async () => {
        const mockLogin = 'testUser';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { active: true } });

        const TestComponent = () => {
            const { handleCheckLogin } = useUserInfo();
            handleCheckLogin(mockLogin);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/checkLogin', {
                params: { login: mockLogin },
            });
        });
    });

    it('checks if user authenticated via Google', async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { oauth2: true } });

        const TestComponent = () => {
            const { handleCheckGoogleAuth } = useUserInfo();
            handleCheckGoogleAuth();
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/checkGoogleAuth');
        });
    });

    it('checks if password meets the strength criteria', () => {
        const { handleCheckPassword } = useUserInfo();

        expect(handleCheckPassword('Test1234')).toBe(true);   // valid password
        expect(handleCheckPassword('test')).toBe(false);      // invalid password (too short and no upper case)
        expect(handleCheckPassword('TEST1234')).toBe(false);  // invalid password (no lowercase)
        expect(handleCheckPassword('test1234')).toBe(false);  // invalid password (no uppercase)
    });

    it('checks old password', async () => {
        const mockPassword = 'oldPassword123';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { value: true } });

        const TestComponent = () => {
            const { handleCheckOldPassword } = useUserInfo();
            handleCheckOldPassword(mockPassword);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/checkOldPassword', {
                params: { password: mockPassword },
            });
        });
    });
});