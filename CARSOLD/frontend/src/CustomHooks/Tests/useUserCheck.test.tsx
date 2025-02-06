import {render, waitFor} from '@testing-library/react';
import {api} from "../../Config/AxiosConfig/AxiosConfig";
import {useUserInfo} from "../useUserInfo.ts";

jest.mock('../../Config/AxiosConfig/AxiosConfig', () => ({
    api: {
        get: jest.fn(),
    },
}));

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useUserCheck', () => {
    it('checks if email exists', async () => {
        const mockEmail = 'test@example.com';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { exists: true } });

        const TestComponent = () => {
            const { emailExists } = useUserInfo();
            emailExists(mockEmail);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/register/check-email', {
                params: { email: mockEmail },
            });
        });
    });

    it('checks if username exists', async () => {
        const mockUsername = 'testUser';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { exists: true } });

        const TestComponent = () => {
            const { usernameExists } = useUserInfo();
            usernameExists(mockUsername);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/register/check-username', {
                params: { username: mockUsername },
            });
        });
    });

    it('checks if user account is active', async () => {
        const mockLogin = 'testUser';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { active: true } });

        const TestComponent = () => {
            const { isActive } = useUserInfo();
            isActive(mockLogin);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/check-active', {
                params: { login: mockLogin },
            });
        });
    });

    it('checks if user authenticated via Google', async () => {
        const mockLogin = 'testUser';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { oauth2: true } });

        const TestComponent = () => {
            const { isOauth2 } = useUserInfo();
            isOauth2(mockLogin);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/check-oauth2', {
                params: { login: mockLogin },
            });
        });
    });

    it('checks if password meets the strength criteria', () => {
        const {checkPassword} = useUserInfo();

        expect(checkPassword('Test1234')).toBe(true);   //valid password
        expect(checkPassword('test')).toBe(false);      //invalid password (too short and no upper case)
        expect(checkPassword('TEST1234')).toBe(false);  //invalid password (no lowercase)
        expect(checkPassword('test1234')).toBe(false);  //invalid password (no uppercase)
        expect(checkPassword('Test3210123456789876543210123')).toBe(false); //invalid password (too long)
    });

    it('checks old password', async () => {
        const mockPassword = 'oldPassword123';
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { valid: true } });

        const TestComponent = () => {
            const { checkOldPassword } = useUserInfo();
            checkOldPassword(mockPassword);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/validate-password', {
                params: { password: mockPassword },
            });
        });
    });

    it('checks if Google authentication is valid', async () => {
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { valid: true } });

        const TestComponent = () => {
            const { checkGoogleAuth } = useUserInfo();
            checkGoogleAuth();
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith('api/auth/check-google-auth');
        });
    });
});