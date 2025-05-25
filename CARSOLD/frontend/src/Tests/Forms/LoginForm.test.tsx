import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {api} from '../../Config/AxiosConfig/AxiosConfig';
import {MemoryRouter} from 'react-router-dom';
import {useUserInfo} from '../../CustomHooks/useUserInfo';
import LoginForm from "../../PageComponents/Authentication/AuthWindow/Atomic/Form/LoginForm";
import {LanguageProvider} from "../../GlobalProviders/Language/LanguageProvider.tsx";

jest.mock('../../Config/AxiosConfig/AxiosConfig', () => ({
    api: {
        post: jest.fn(),
    },
}));

jest.mock('../../GlobalProviders/Util/useUtil', () => ({
    useUtil: () => ({
        CreateDebouncedValue: jest.fn((value) => value),
    }),
}));

jest.mock('../../CustomHooks/useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

jest.mock('../../GlobalProviders/Auth/useAuth', () => ({
    useAuth: jest.fn(() => ({
        handleCheckAuth: jest.fn(),
    })),
}));

beforeEach(() => {
    localStorage.setItem("app_language", "ENG");
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

const renderComponent = () => {
    render(
        <MemoryRouter>
            <LanguageProvider>
                <LoginForm/>
            </LanguageProvider>
        </MemoryRouter>
    );
};

describe('LoginForm', () => {
    const mockUserCheck = (overrides = {}) => {
        (useUserInfo as jest.Mock).mockReturnValue({
            handleCheckLogin: jest.fn(() => Promise.resolve(true)),
            handleCheckAccount: jest.fn(() => Promise.resolve({active: true, oauth2: false})),
            ...overrides,
        });
    };

    it('should render form fields correctly', () => {
        mockUserCheck();
        renderComponent();

        ['Username or e-mail', 'Password'].forEach((placeholder) => {
            expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
        });
        expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    it('should show wrong password message if credentials are incorrect', async () => {
        jest.spyOn(api, 'post').mockResolvedValueOnce({status: 401});
        mockUserCheck();
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Username or e-mail'), {target: {value: 'user@example.com'}});
        fireEvent.change(screen.getByPlaceholderText('Password'), {target: {value: 'WrongPass123'}});

        fireEvent.click(screen.getByText('Sign in'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('api/public/auth/authenticate',
                {login: 'user@example.com', password: 'WrongPass123'});
            expect(screen.queryByText('Wrong password!')).not.toBeInTheDocument();
        });
    });

    it('should authenticate user successfully when credentials are correct', async () => {
        jest.spyOn(api, 'post').mockResolvedValueOnce({status: 200});
        mockUserCheck();
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Username or e-mail'), {target: {value: 'user@example.com'}});
        fireEvent.change(screen.getByPlaceholderText('Password'), {target: {value: 'ValidPass123'}});
        fireEvent.click(screen.getByText('Sign in'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('api/public/auth/authenticate',
                {login: 'user@example.com', password: 'ValidPass123'});
            expect(screen.queryByText('Something went wrong...')).not.toBeInTheDocument();
        });
    });

    it('should show account deleted banner when sessionStorage item is set', () => {
        sessionStorage.setItem('isAccountDeleted', 'true');
        renderComponent();

        expect(screen.getByText('Account has been deleted...')).toBeInTheDocument();
    });
});