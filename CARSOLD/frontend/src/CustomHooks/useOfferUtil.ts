import {fetchAllUserOffers, fetchOffer, fetchOfferWithUser} from "../ApiCalls/Services/OfferService.ts";
import {NotFoundError} from "../ApiCalls/Errors/CustomErrors.ts";
import {useState} from "react";

export const useOfferUtil = () => {

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
            }
            console.error("Unexpected error when fetching offer: ", error);
        }

        return { offerData: null, userPermission: false };
    };

    const [loading, setLoading] = useState<boolean>(false);

    const handleFetchOfferWithUser = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetchOfferWithUser(id);
            if (response.data) {
                return response.data;
            }
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                console.error("Offer not found: ", error);
            }
            console.error("Unexpected error when fetching offer with user's contact info: ", error);
        } finally {
            setLoading(false);
        }

        return { offerWithContactData: null, userPermission: false };
    };

    const handleFetchAllUserOffers = async () => {
        setLoading(true);
        try {
            const response = await fetchAllUserOffers();
            if (response.data) return response.data;
        } catch (error) {
            console.error("Unexpected error occurred during offers fetch: ", error);
        } finally {
            setLoading(false);
        }
    };

    return {handleFetchOffer, handleFetchOfferWithUser, handleFetchAllUserOffers, loading}
}

