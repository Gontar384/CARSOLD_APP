import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {AxiosResponse} from "axios";

export const sendMessage = async (message: object | null): Promise<void> => {
    try {
        await api.post("api/message/send", message);
    } catch (error) {
        handleError(error);
    }
};

export const getUnseenCount = async (): Promise<AxiosResponse> => {
    try {
        return await api.get("api/message/getUnseenCount");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getAllConversations = async (): Promise<AxiosResponse> => {
    try {
        return await api.get("api/message/getAllConversations");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getConversationOnInitial = async(username: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/message/getConversationOnInitial/${username}`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};