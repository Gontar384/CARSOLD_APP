import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { api } from '../../../../../../Config/AxiosConfig/AxiosConfig';
import RegisterForm from '../RegisterForm';
import { MemoryRouter } from 'react-router-dom';
import { useUserCheck } from '../../../../../../CustomHooks/useUserCheck';

jest.mock('../../../../../../Config/AxiosConfig/AxiosConfig', () => ({
    api: {
        get: jest.fn(),
        post: jest.fn(),
    },
}));

jest.mock('../../../../../../GlobalProviders/Util/useUtil', () => ({
    useUtil: () => ({
        CreateDebouncedValue: jest.fn((value) => value),
    }),
}));

jest.mock('../../../../../../CustomHooks/useUserCheck', () => ({
    useUserCheck: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

const renderComponent = () => {
    render(
        <MemoryRouter>
            <RegisterForm />
        </MemoryRouter>
    );
};

describe('RegisterForm', () => {
    const mockUserCheck = (overrides = {}) => {
        (useUserCheck as jest.Mock).mockReturnValue({
            emailExists: jest.fn(() => Promise.resolve({ data: { exists: false } })),
            usernameExists: jest.fn(() => Promise.resolve({ data: { exists: false } })),
            isActive: jest.fn(() => Promise.resolve({ data: { checks: false } })),
            checkPassword: jest.fn(() => true),
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

        fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'invalidEmail' } });

        await waitFor(() => {
            expect(screen.getByText("It doesn't look like an email...")).toBeInTheDocument();
        });
    });

    it('should show email taken error on emailExists call', async () => {
        mockUserCheck({
            emailExists: jest.fn(() => Promise.resolve({ data: { exists: true } })),
            isActive: jest.fn(() => Promise.resolve({ data: { checks: true } })),
        });
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'test@example.com' } });

        await waitFor(() => {
            expect(screen.getByText('Email is already taken.')).toBeInTheDocument();
        });
    });

    it('should show username error if username exists', async () => {
        mockUserCheck({
            usernameExists: jest.fn(() => Promise.resolve({ data: { exists: true } })),
            isActive: jest.fn(() => Promise.resolve({ data: { checks: true } })),
        });
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'existingUser' } });

        await waitFor(() => {
            expect(screen.getByText('Username already exists.')).toBeInTheDocument();
        });
    });

    it('should show password validation error if password is too short', async () => {
        mockUserCheck({
            checkPassword: jest.fn(() => false),
        });
        renderComponent();

        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'short' } });

        await waitFor(() => {
            expect(screen.getByText('Password is too short.')).toBeInTheDocument();
        });
    });

    const fillRegistrationForm = () => {
        fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newUser' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'StrongPassword123' } });
        fireEvent.change(screen.getByPlaceholderText('Repeat password'), { target: { value: 'StrongPassword123' } });
        fireEvent.click(screen.getByLabelText('Accept'));
        fireEvent.click(screen.getByText('Register'));
    };

    it('should call api.post on successful registration and display success banner', async () => {
        mockUserCheck();
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { isSafe: true } });
        (api.post as jest.Mock).mockResolvedValueOnce({ data: true });

        renderComponent();
        fillRegistrationForm();

        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith('api/auth/register', {
                email: 'test@example.com',
                username: 'newUser',
                password: 'StrongPassword123',
            });
        });

        await waitFor(() => {
            expect(screen.getByText("Registered successfully! We've sent you e-mail with confirmation link. Check it out!"))
                .toBeInTheDocument();
        });
    });

    it('should handle error during registration and display error banner', async () => {
        mockUserCheck();
        (api.get as jest.Mock).mockResolvedValueOnce({ data: { isSafe: true } });
        (api.post as jest.Mock).mockRejectedValueOnce(new Error('Registration failed'));

        renderComponent();
        fillRegistrationForm();

        await waitFor(() => {
            expect(screen.getByText('Something went wrong...')).toBeInTheDocument();
        });
    });
});