import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MemoryRouter, useParams, useNavigate, useLocation} from 'react-router-dom';
import {useOfferUtil} from '../../CustomHooks/useOfferUtil';
import OfferForm from "../../PageComponents/AddingOffer/OfferForm.tsx";
import {UtilProvider} from "../../GlobalProviders/Util/UtilProvider.tsx";
import {AuthProvider} from "../../GlobalProviders/Auth/AuthProvider.tsx";
import {SearchProvider} from "../../GlobalProviders/Search/SearchProvider.tsx";
import {UserUtilProvider} from "../../GlobalProviders/UserUtil/UserUtilProvider.tsx";
import {LanguageProvider} from "../../GlobalProviders/Language/LanguageProvider.tsx";

jest.mock('../../Config/AxiosConfig/AxiosConfig', () => ({
    api: {
        post: jest.fn(),
        put: jest.fn(),
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Preserve other exports
    useParams: jest.fn(),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('../../CustomHooks/useOfferUtil', () => ({
    useOfferUtil: jest.fn(),
}));

jest.mock('../../ApiCalls/Services/OfferService', () => ({
    addOffer: jest.fn(),
}));

jest.mock('../../GlobalProviders/Messages/useMessages', () => ({
    useMessages: () => ({
        addMessage: jest.fn(),
    }),
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
                <UtilProvider>
                    <AuthProvider>
                        <SearchProvider>
                            <UserUtilProvider>
                                <OfferForm/>
                            </UserUtilProvider>
                        </SearchProvider>
                    </AuthProvider>
                </UtilProvider>
            </LanguageProvider>
        </MemoryRouter>
    );
};

describe('OfferForm', () => {
    const mockNavigate = jest.fn();
    const mockLocation = {pathname: '/addingOffer'};
    const mockOfferData = {
        content: 'Some mock content',
    };

    const mockUseOfferUtil = (overrides = {}) => {
        (useOfferUtil as jest.Mock).mockReturnValue({
            handleFetchOffer: jest.fn().mockResolvedValue({
                offerData: mockOfferData,
                userPermission: true,
            }),
            ...overrides,
        });
    };

    beforeEach(() => {
        (useParams as jest.Mock).mockReturnValue({});
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        (useLocation as jest.Mock).mockReturnValue(mockLocation);

        mockUseOfferUtil();
    });

    it('should render the form fields correctly', async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText('Title')).toBeInTheDocument();
        });

        screen.getByText('Brand');
        screen.getByText('Model');
        screen.getByText('Body type');
        screen.getByText('Year of production');
        screen.getByText('Mileage');
        screen.getByText('Fuel');
        screen.getByText('Engine capacity');
        screen.getByText('Engine power');
        screen.getByText('Drive');
        screen.getByText('Transmission');
        screen.getByText('Color');
        screen.getByText('Condition');
        screen.getByText('Seats');
        screen.getByText('Steering wheel');
        screen.getByText('Doors');
        screen.getByText('Origin country');
        screen.getByText('VIN');
        screen.getByText('License plate');
        screen.getByText('First registration');
        screen.getByText('Description');
        screen.getByText('Price');
    });

    it('should show error messages when required fields are empty', async () => {
        renderComponent();

        fireEvent.click(screen.getByText('Submit and add offer'));

        await waitFor(() => {
            expect(screen.getByText('You have to provide title.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose brand.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose body type.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose year of production.')).toBeInTheDocument();
            expect(screen.getByText('You have to provide car\'s mileage.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose fuel type.')).toBeInTheDocument();
            expect(screen.getByText('You have to provide engine capacity.')).toBeInTheDocument();
            expect(screen.getByText('You have to provide engine power.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose drive.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose car\'s transmission.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose color.')).toBeInTheDocument();
            expect(screen.getByText('You have to choose car\'s condition.')).toBeInTheDocument();
            expect(screen.getByText('You have to add description.')).toBeInTheDocument();
            expect(screen.getByText('You have to set price.')).toBeInTheDocument();
        });
    });
});