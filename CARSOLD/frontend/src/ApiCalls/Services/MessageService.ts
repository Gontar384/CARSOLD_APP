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
        return api.get("api/message/getUnseen");
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};