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

export const getUnseenMessages = async (): Promise<AxiosResponse> => {
    try {
        return await api.get("api/message/getUnseen");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getUserConversations = async (): Promise<AxiosResponse> => {
    try {
        return await api.get("api/message/getUserConversations");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getConversation = async(username: string | null, page: number | null, size: number | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/message/getConversation/${username}`, {
            params: {page, size}
        });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};