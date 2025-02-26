import {AxiosResponse} from "axios";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";

export const addOffer = async (offer: object): Promise<AxiosResponse> => {
    return api.post('api/offer/add', offer);  //manually handling errors in main function
}

export const fetchOffer = async (id: number): Promise<AxiosResponse> => {
    try {
        return api.get(`/api/offer/fetch/${id}`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
}