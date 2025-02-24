import {AxiosResponse} from "axios";
import {handleError} from "../Errors/ErrorHandler.ts";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";

export const addOffer = async (offer: object): Promise<AxiosResponse> => {
    try {
        return api.post('api/offer/add', offer);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
}