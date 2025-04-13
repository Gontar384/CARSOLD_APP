import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";

export const sendMessage = async (message: object | null): Promise<void> => {
    try {
        await api.post("api/message/send", message);
    } catch (error) {
        handleError(error);
    }
};