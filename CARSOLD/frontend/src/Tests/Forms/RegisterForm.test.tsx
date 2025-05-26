import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {api} from '../../Config/AxiosConfig/AxiosConfig';
import RegisterForm from '../../PageComponents/Authentication/AuthWindow/Atomic/Form/RegisterForm';
import {MemoryRouter} from 'react-router-dom';
import {useUserInfo} from '../../CustomHooks/useUserInfo';
import {LanguageProvider} from "../../GlobalProviders/Language/LanguageProvider.tsx";

jest.mock('../../Config/AxiosConfig/AxiosConfig.ts', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

jest.mock('../../GlobalProviders/Util/useUtil.ts', () => ({
    useUtil: () => ({
        CreateDebouncedValue: jest.fn((value) => value),
    }),
}));

jest.mock('../../CustomHooks/useUserInfo.ts', () => ({
    useUserInfo: jest.fn(),
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
                <RegisterForm/>
            </LanguageProvider>
        </MemoryRouter>
    );
};

describe('RegisterForm', () => {

    const mockUserCheck = (overrides = {}) => {
        (useUserInfo as jest.Mock).mockReturnValue({
            handleCheckLogin: jest.fn(() => Promise.resolve(false)),
            handleCheckAccount: jest.fn(() => Promise.resolve({active: true, oauth2: false})),
            handleCheckPassword: jest.fn(() => true),
            ...overrides,
        });
    };

    it('should render form fields correctly', () => {
        mockUserCheck();
        renderComponent();

        ['E-mail', 'Username', 'Password', 'Repeat password'].forEach((placeholder) => {
            expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
        });
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    it('should show error if email is invalid', async () => {
        mockUserCheck();
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('E-mail'), {target: {value: 'invalidEmail'}});

        await waitFor(() => {
            expect(screen.getByText("It doesn't look like an e-mail...")).toBeInTheDocument();
        });
    });

    it('should show email taken error on emailExists call', async () => {
        mockUserCheck({
            handleCheckLogin: jest.fn(() => Promise.resolve(true)),
            handleCheckAccount: jest.fn(() => Promise.resolve({active: true, oauth2: false})),
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('E-mail'), {target: {value: 'test@example.com'}});

        await waitFor(() => {
            expect(screen.getByText('E-mail is already taken.')).toBeInTheDocument();
        });
    });

    it('should show username error if username exists', async () => {
        mockUserCheck({
            handleCheckLogin: jest.fn(() => Promise.resolve(true)),
            handleCheckAccount: jest.fn(() => Promise.resolve({active: true, oauth2: false})),
        });

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Username'), {target: {value: 'takenUsername'}});

        await waitFor(() => {
            expect(screen.getByText('Username is already taken.')).toBeInTheDocument();
        });
    });

    it('should register user successfully when form is valid', async () => {
        mockUserCheck({
            handleCheckLogin: jest.fn(() => Promise.resolve(false)),
            handleCheckAccount: jest.fn(() => Promise.resolve({active: false, oauth2: false})),
            handleCheckPassword: jest.fn(() => true),
        });

        jest.spyOn(api, 'post').mockResolvedValueOnce({status: 201});

        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('E-mail'), {target: {value: 'valid@example.com'}});
        fireEvent.change(screen.getByPlaceholderText('Username'), {target: {value: 'validUsername'}});
        fireEvent.change(screen.getByPlaceholderText('Password'), {target: {value: 'Valid123'}});
        fireEvent.change(screen.getByPlaceholderText('Repeat password'), {target: {value: 'Valid123'}});
        fireEvent.click(screen.getByLabelText('Accept'));
        fireEvent.click(screen.getByText('Register'));

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('api/public/user/register', {
                email: 'valid@example.com',
                username: 'validUsername',
                password: 'Valid123',
            },{ params: { translate: true }});
        });

        await waitFor(() => {
            expect(screen.getByText("Registered successfully! We've sent you e-mail with confirmation link. Check it out!"))
                .toBeInTheDocument();
        });
    });
});