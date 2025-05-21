import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {AxiosResponse} from "axios";
import {MessageDto} from "../../PageComponents/AccountDetails/Content/Messages/Atomic/ChatWindow.tsx";

export const activateConversation = async (username: string | null): Promise<void> => {
    try {
        await api.post("api/private/message/activateConversation", { value: username });
    } catch (error) {
        handleError(error);
    }
};

export const sendMessage = async (message: MessageDto | null): Promise<void> => {
    try {
        await api.post("api/private/message/send", message);
    } catch (error) {
        handleError(error);
    }
};

export const getUnseenCount = async (): Promise<AxiosResponse> => {
    try {
        return await api.get("api/private/message/getUnseenCount");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getAllConversations = async (): Promise<AxiosResponse> => {
    try {
        return await api.get("api/private/message/getAllConversations");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getConversationOnInitial = async(username: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/private/message/getConversationOnInitial/${username}`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const deleteConversation = async(username: string | null): Promise<void> => {
    try {
        await api.delete(`api/private/message/deleteConversation/${username}`);
    } catch (error) {
        handleError(error);
    }
};

export const blockUnblockUser = async(username: string | null): Promise<void> => {
    try {
        await api.patch(`api/private/message/blockUnblockUser/${username}`);
    } catch (error) {
        handleError(error);
    }
};

export const makeSeen = async(username: string | null): Promise<void> => {
    try {
        await api.patch(`api/private/message/makeSeen/${username}`);
    } catch (error) {
        handleError(error);
    }
};

export const getPreviousMessages = async(username: string | null, page: number | null): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/private/message/getPreviousMessages/${username}/${page}`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};