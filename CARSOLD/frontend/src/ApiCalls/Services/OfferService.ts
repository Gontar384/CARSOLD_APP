import {AxiosResponse} from "axios";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {SelectedReason} from "../../PageComponents/OfferDisplay/BigContainer/OfferDetails/Report/ReportOffer.tsx";

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

export const deleteOffer = async (id: number | null): Promise<void> => {
    try {
        await api.delete(`api/offer/delete/${id}`)
    } catch (error) {
        handleError(error);
    }
};

export const fetchRandomOffers = async ():Promise<AxiosResponse> => {
    try {
        return await api.get("api/offer/fetchRandom");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

//---Functionality---

export const followAndCheck = async (id: number | null, follow: boolean): Promise<AxiosResponse> => {
    return await api.patch(`api/offer/followAndCheck/${id}`, { value: follow }); //manually handling errors in main function
};

export const fetchStats = async (id: number | null): Promise<AxiosResponse> => {
  try {
      return await api.get(`api/offer/fetchStats/${id}`);
  } catch (error) {
      handleError(error);
      return Promise.reject(error);
  }
};

export const fetchAllFollowed = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/offer/fetchAllFollowed');
    } catch (error) {
        handleError(error);
        return Promise.reject();
    }
};

export const reportOffer = async (reason: SelectedReason): Promise<void> => {
    try {
        await api.post("api/offer/report", reason);
    } catch (error) {
        handleError(error);
    }
};

//---Search---

export const fetchFilteredOffers = async (queryParams: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/offer/search?${queryParams}`);
    } catch (error) {
        handleError(error);
        return Promise.reject();
    }
};

//---Admin---

export const adminDeleteOffer = async (id: number | null): Promise<void> => {
    try {
        await api.delete(`api/offer/adminDelete/${id}`);
    } catch (error) {
        handleError(error);
    }
};

export const adminFetchReports = async (): Promise<AxiosResponse> => {
    try {
        return await api.get("api/offer/adminFetchReports");
    } catch (error) {
        handleError(error);
        return Promise.reject();
    }
};

export const adminDeleteReport = async (id: number | null): Promise<void> => {
    try {
        await api.delete(`api/offer/adminDeleteReport/${id}`);
    } catch (error) {
        handleError(error);
    }
};