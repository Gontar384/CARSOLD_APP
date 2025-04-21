import {fetchAllFollowed, fetchAllUserOffers, fetchOffer, fetchOfferWithUser, fetchStats, followAndCheck} from "../ApiCalls/Services/OfferService.ts";
import {NotFoundError} from "../ApiCalls/Errors/CustomErrors.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {AxiosError} from "axios";

export const useOfferUtil = () => {

    const [offerFetched, setOfferFetched] = useState<boolean>(false);
    const [followed, setFollowed] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleFetchOffer = async (id: number) => {
        try {
            const response = await fetchOffer(id);
            const userPermission = response.headers["user-permission"] === "true";
            if (response.data) {
                return {
                    offerData: response.data,
                    userPermission
                };
            }
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                console.error("Offer not found: ", error);
                navigate('/home');
            } else {
                console.error("Unexpected error when fetching offer: ", error);
                navigate('/home');
            }
        }

        return { offerData: null, userPermission: false };
    };

    const handleFetchOfferWithUser = async (id: number) => {
        try {
            const response = await fetchOfferWithUser(id);
            if (response.data) {
                return response.data;
            }
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                console.error("Offer not found: ", error);
                navigate('/home');
            } else {
                console.error("Unexpected error when fetching offer with user's contact info: ", error);
                navigate('/home');
            }
        } finally {
            setOfferFetched(true);
        }

        return { offerWithContactData: null, userPermission: false };
    };

    const handleFetchAllUserOffers = async () => {
        try {
            const response = await fetchAllUserOffers();
            if (response.data) return response.data;
        } catch (error) {
            console.error("Unexpected error occurred during offers fetch: ", error);
        } finally {
            setOfferFetched(true);
        }
    };

    const handleFollowAndCheck = async (id: number | null, follow: boolean) => {
        try {
            const response = await followAndCheck(id, follow);
            if (response.status === 200) setFollowed(true);
            else if (response.status === 204) setFollowed(false);
        } catch (error: unknown) {
            setFollowed(false);
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 404) {
                    console.error("Offer not found");
                } else if (error.response.status === 405) {
                    console.error("User cannot follow his own offer");
                } else {
                    console.error("Unexpected error occurred during checking if following", error);
                }
            }
        }
    };

    const handleFetchStats = async (id: number | null) => {
      try {
          const response = await fetchStats(id);
          if (response.data) return response.data;
      } catch (error: unknown) {
          if (error instanceof NotFoundError) {
              console.error("Offer not found", error);
          } else {
              console.error("Unexpected error during offer stats fetching", error)
          }
      }
    };

    const handleFetchAllFollowed = async () => {
        try {
            const response = await fetchAllFollowed();
            if (response.data) return response.data;
        } catch (error) {
            console.error("Unexpected error fetching all followed offers: ", error)
        } finally {
            setOfferFetched(true);
        }
    };

    return {handleFetchOffer, handleFetchOfferWithUser, handleFetchAllUserOffers, offerFetched,
        handleFollowAndCheck, followed, handleFetchStats, handleFetchAllFollowed}
}

