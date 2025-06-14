import { render, waitFor } from '@testing-library/react';
import { useOfferUtil } from '../../CustomHooks/useOfferUtil.ts';
import { useNavigate } from 'react-router-dom';
import {fetchAllFollowed, fetchAllUserOffers, fetchOffer, fetchOfferWithUser, fetchStats, followAndCheck} from "../../ApiCalls/Services/OfferService.ts";
import {NotFoundError} from "../../ApiCalls/Errors/CustomErrors.ts";
import {useEffect} from "react";

jest.mock('../../Config/AxiosConfig/AxiosConfig.ts', () => ({
    api: {
        get: jest.fn(),
    },
}));

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
});

jest.mock('../../ApiCalls/Services/OfferService.ts');
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

afterEach(() => {
    jest.restoreAllMocks();
});

describe('useOfferUtil', () => {
    it('fetches offer data successfully', async () => {
        const mockResponse = { data: { id: 1, name: 'Offer 1' }, headers: { 'user-permission': 'true' } };
        (fetchOffer as jest.Mock).mockResolvedValueOnce(mockResponse);
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        const TestComponent = () => {
            const { handleFetchOffer } = useOfferUtil();
            useEffect(() => {
                handleFetchOffer(1);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchOffer).toHaveBeenCalledWith(1);
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    it('handles 404 error when fetching offer', async () => {
        (fetchOffer as jest.Mock).mockRejectedValueOnce(new NotFoundError('Offer not found', undefined));
        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        const TestComponent = () => {
            const { handleFetchOffer } = useOfferUtil();
            useEffect(() => {
                handleFetchOffer(1);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchOffer).toHaveBeenCalledWith(1);
            expect(mockNavigate).toHaveBeenCalledWith("/details/myOffers");
        });
    });

    it('fetches offer with user data successfully', async () => {
        const mockResponse = { data: { id: 1, contact: 'contact@example.com' } };
        (fetchOfferWithUser as jest.Mock).mockResolvedValueOnce(mockResponse);

        const TestComponent = () => {
            const { handleFetchOfferWithUser } = useOfferUtil();
            useEffect(() => {
                handleFetchOfferWithUser(1);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchOfferWithUser).toHaveBeenCalledWith(1);
        });
    });

    it('handles 404 error when fetching offer with user data', async () => {
        (fetchOfferWithUser as jest.Mock).mockRejectedValueOnce(new NotFoundError('Offer not found', undefined));

        const mockNavigate = jest.fn();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

        const TestComponent = () => {
            const { handleFetchOfferWithUser } = useOfferUtil();
            useEffect(() => {
                handleFetchOfferWithUser(1);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchOfferWithUser).toHaveBeenCalledWith(1);
            expect(mockNavigate).toHaveBeenCalledWith("/search?page=0&size=10");
        });
    });

    it('fetches all user offers successfully', async () => {
        const mockResponse = { data: [{ id: 1, name: 'Offer 1' }] };
        (fetchAllUserOffers as jest.Mock).mockResolvedValueOnce(mockResponse);

        const TestComponent = () => {
            const { handleFetchAllUserOffers } = useOfferUtil();
            useEffect(() => {
                handleFetchAllUserOffers(1, 3);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchAllUserOffers).toHaveBeenCalled();
        });
    });

    it('handles error when fetching all user offers', async () => {
        (fetchAllUserOffers as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

        const TestComponent = () => {
            const { handleFetchAllUserOffers } = useOfferUtil();
            useEffect(() => {
                handleFetchAllUserOffers(1, 3);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchAllUserOffers).toHaveBeenCalled();
        });
    });

    it('follows and checks successfully', async () => {
        const mockResponse = { status: 200 };
        (followAndCheck as jest.Mock).mockResolvedValueOnce(mockResponse);

        const TestComponent = () => {
            const { handleFollowAndCheck } = useOfferUtil();
            handleFollowAndCheck(1, true);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(followAndCheck).toHaveBeenCalledWith(1, true);
        });
    });

    it('handles error when following and checking', async () => {
        (followAndCheck as jest.Mock).mockRejectedValueOnce(new Error('Offer not found'));

        const TestComponent = () => {
            const { handleFollowAndCheck } = useOfferUtil();
            handleFollowAndCheck(1, true);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(followAndCheck).toHaveBeenCalledWith(1, true);
        });
    });

    it('fetches offer stats successfully', async () => {
        const mockResponse = { data: { views: 100 } };
        (fetchStats as jest.Mock).mockResolvedValueOnce(mockResponse);

        const TestComponent = () => {
            const { handleFetchStats } = useOfferUtil();
            handleFetchStats(1);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchStats).toHaveBeenCalledWith(1);
        });
    });

    it('handles error when fetching offer stats', async () => {
        (fetchStats as jest.Mock).mockRejectedValueOnce(new NotFoundError('Offer not found', undefined));

        const TestComponent = () => {
            const { handleFetchStats } = useOfferUtil();
            handleFetchStats(1);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchStats).toHaveBeenCalledWith(1);
        });
    });

    it('fetches all followed offers successfully', async () => {
        const mockResponse = { data: [{ id: 1, name: 'Followed Offer' }] };
        (fetchAllFollowed as jest.Mock).mockResolvedValueOnce(mockResponse);

        const TestComponent = () => {
            const { handleFetchAllFollowed } = useOfferUtil();
            useEffect(() => {
                handleFetchAllFollowed(1, 3);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchAllFollowed).toHaveBeenCalled();
        });
    });

    it('handles error when fetching all followed offers', async () => {
        (fetchAllFollowed as jest.Mock).mockRejectedValueOnce(new Error('Unexpected error'));

        const TestComponent = () => {
            const { handleFetchAllFollowed } = useOfferUtil();
            useEffect(() => {
                handleFetchAllFollowed(1, 3);
            }, []);
            return null;
        };

        render(<TestComponent />);

        await waitFor(() => {
            expect(fetchAllFollowed).toHaveBeenCalled();
        });
    });
});