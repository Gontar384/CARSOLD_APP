import {fetchOffer} from "../ApiCalls/Services/OfferService.ts";
import {NotFoundError} from "../ApiCalls/Errors/CustomErrors.ts";

export const useOfferUtil = () => {
    const handleFetchOffer = async (offerId: number) => {
        try {
            const response = await fetchOffer(offerId);
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

    return { handleFetchOffer }
}

