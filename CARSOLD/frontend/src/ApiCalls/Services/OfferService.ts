import {AxiosResponse} from "axios";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {SelectedReason} from "../../PageComponents/OfferDisplay/BigContainer/OfferDetails/Report/ReportOffer.tsx";

//---Management---

export const fetchOffer = async (id: number | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/private/offer/fetch/${id}`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const fetchAllUserOffers = async (page: number, size: number): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/offer/fetchAllForUser', { params: { page: page, size: size } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const fetchOfferWithUser = async (id: number | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/public/offer/fetchWithUser/${id}`);
    }  catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const addOffer = async (offer: FormData): Promise<AxiosResponse> => {
    return await api.post('api/private/offer/add', offer);  //manually handling errors in main function
};

export const updateOffer = async (id: number | null, offer: FormData): Promise<AxiosResponse> => {
    return await api.put(`api/private/offer/update/${id}`, offer); //manually handling errors in main function
};

export const deleteOffer = async (id: number | null): Promise<void> => {
    try {
        await api.delete(`api/private/offer/delete/${id}`)
    } catch (error) {
        handleError(error);
    }
};

export const fetchRandomOffers = async ():Promise<AxiosResponse> => {
    try {
        return await api.get("api/public/offer/fetchRandom");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

//---Functionality---

export const fetchStats = async (id: number | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/private/offer/fetchStats/${id}`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const fetchAllFollowed = async (page: number, size: number): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/offer/fetchAllFollowed', { params: { page: page, size: size } });
    } catch (error) {
        handleError(error);
        return Promise.reject();
    }
};

export const followAndCheck = async (id: number | null, follow: boolean): Promise<AxiosResponse> => {
    return await api.patch(`api/private/offer/followAndCheck/${id}`, { value: follow }); //manually handling errors in main function
};

export const reportOffer = async (reason: SelectedReason): Promise<void> => {
    try {
        await api.post("api/private/offer/report", reason);
    } catch (error) {
        handleError(error);
    }
};

//---Search---

export const fetchFilteredOffers = async (queryParams: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/public/offer/search?${queryParams}`);
    } catch (error) {
        handleError(error);
        return Promise.reject();
    }
};