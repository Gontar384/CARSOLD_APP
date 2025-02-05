import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {AxiosResponse} from "axios";

//---Authentication---

export const getCsrfToken = async (): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/auth/getCsrfToken`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const checkAuth = async (): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/auth/checkAuth`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const refreshJwt = async (): Promise<void> => {
    try {
        await api.get('api/auth/refreshJwt');
    } catch (error) {
        handleError(error);
    }
};

export const keepSessionAlive = async (): Promise<void> => {
    try {
        await api.get(`api/auth/keepSessionAlive`);
    } catch (error) {
        handleError(error);
    }
};

export const activateAccount = async (token: string | null): Promise<void> => {
    try {
        await api.get(`api/auth/activateAccount`, {params: {token}});
    } catch (error) {
        handleError(error);
    }
};

export const authenticate = async (login: string | null, password: string | null): Promise<AxiosResponse> => {
    return await api.get(`api/auth/authenticate`, {params: {login, password}}); //manually handling errors in main function
};

export const logout = async (): Promise<void> => {
    try {
        await api.get(`api/auth/logout`);
    } catch (error) {
        handleError(error);
    }
};

//---Management---

export const registerUser = async (user: object): Promise<AxiosResponse> => {
    return await api.post('api/registerUser', user); //manually handling errors in main function
};

export const fetchUsername = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/fetchUsername');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const changePassword = async (password: string | null): Promise<void> => {
    try {
        await api.put("api/changePassword", {password: password});
    } catch (error) {
        handleError(error);
    }
};

export const changePasswordRecovery = async (token: string | null, password: string | null): Promise<void> => {
    try {
        await api.put('api/changePasswordRecovery', {token: token, password: password});
    } catch (error) {
        handleError(error);
    }
};

export const deleteUser = async () => {
    try {
        await api.delete('api/deleteUser');
    } catch (error) {
        handleError(error);
    }
}
