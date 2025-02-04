import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {AxiosResponse} from "axios";

//---Authentication---

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
        return await api.get(`api/auth/checkAuth`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const getJwtRefreshed = async (): Promise<void> => {
    try {
        await api.get('api/auth/refreshJwt');
    } catch (error) {
        handleError(error);
    }
};

export const getSessionActive = async (): Promise<void> => {
    try {
        await api.get(`api/auth/keepSessionAlive`);
    } catch (error) {
        handleError(error);
    }
}

export const getAccountActive = async (token: string | null): Promise<void> => {
    try {
        await api.get(`api/auth/activateAccount`, {params: {token}});
    } catch (error) {
        handleError(error);
    }
};

export const getAuthentication = async (login: string | null, password: string | null): Promise<void> => {
    try {
        await api.get(`api/auth/authenticate`, { params: { login, password } });
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
