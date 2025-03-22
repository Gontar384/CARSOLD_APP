import {AxiosResponse} from "axios";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";

//---Management---

export const addOffer = async (offer: object): Promise<AxiosResponse> => {
    return await api.post('api/offer/add', offer);  //manually handling errors in main function
}

export const fetchOffer = async (id: number | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/offer/fetch/${id}`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
}

export const fetchOfferWithUser = async (id: number | null): Promise<AxiosResponse> => {
  try {
      return await api.get(`api/offer/fetchWithUser/${id}`);
  }  catch (error) {
      handleError(error);
      return Promise.reject(error);
  }
};

export const updateOffer = async (id: number | null, offer: object): Promise<AxiosResponse> => {
    return await api.put(`api/offer/update/${id}`, offer); //manually handling errors in main function
}

export const fetchAllUserOffers = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/offer/fetchAllUser');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
}

//---Functionality---

export const followAndCheck = async (id: number | null, follow: boolean): Promise<AxiosResponse> => {
    return await api.patch(`api/offer/followAndCheck/${id}`, { value: follow }); //manually handling errors in main function
};