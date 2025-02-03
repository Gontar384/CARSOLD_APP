import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {AxiosResponse} from "axios";

export const getCsrfToken = async (): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/auth/csrf`);
    } catch(error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getAuthCheck = async (): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/auth/check-authentication`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getJwtRefreshed = async (): Promise<void> => {
    try {
        await api.get('api/auth/refresh');
    } catch (error) {
        handleError(error);
    }
};

export const getSessionActive = async (): Promise<void> => {
    try {
        await api.get(`api/auth/keep-alive`);
    } catch (error) {
        handleError(error);
    }
}

export const getAccountActive = async (token: string | null): Promise<void> => {
    try {
        await api.get(`api/auth/activate`, {params: {token}});
    } catch (error) {
        handleError(error);
    }
};

export const getAuthentication = async (login: string | null, password: string | null): Promise<void> => {
    try {
        await api.get(`api/auth/login`, { params: { login, password } });
    } catch (error) {
        handleError(error);
    }
};

export const getLogout = async (): Promise<void> => {
    try {
        await api.get(`api/auth/logout`);
    } catch (error) {
        handleError(error);
    }
}
