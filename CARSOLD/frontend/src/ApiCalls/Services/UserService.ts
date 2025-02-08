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
        await api.get(`api/auth/activateAccount`, { params: { token } });
    } catch (error) {
        handleError(error);
    }
};

export const authenticate = async (login: string | null, password: string | null): Promise<AxiosResponse> => {
    return await api.get(`api/auth/authenticate`, { params: { login, password } }); //manually handling errors in main function
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

export const changePassword = async (oldPassword: string | null, newPassword: string | null): Promise<void> => {
    try {
        await api.put("api/changePassword", { oldPassword: oldPassword, newPassword: newPassword });
    } catch (error) {
        handleError(error);
    }
};

export const changePasswordRecovery = async (token: string | null, password: string | null): Promise<void> => {
    try {
        await api.put('api/changePasswordRecovery', { token: token, password: password });
    } catch (error) {
        handleError(error);
    }
};

export const deleteUser = async (password: string | null): Promise<void> => {
    try {
        await api.delete('api/deleteUser', { params: { password: password } });
    } catch (error) {
        handleError(error);
    }
}

//---EmailNotification---

export const sendPasswordRecoveryEmail = async (email: string | null): Promise<void> => {
    try {
        await api.get('api/sendPasswordRecoveryEmail', { params: { email: email } });
    } catch (error) {
        handleError(error);
    }
}

//---Info---

export const checkLogin = async (login: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/checkLogin', { params : { login: login } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const checkInfo = async (login: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/checkInfo', { params: { login: login } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const checkGoogleAuth = async (): Promise<AxiosResponse> => {
    try{
        return await api.get('api/checkGoogleAuth');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
}

export const checkOldPassword = async (password: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/checkOldPassword', { params: { password: password } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
}

export const checkAdmin = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/checkAdmin');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
}

//---ProfilePic---

export const fetchProfilePic = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/fetchProfilePic');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const uploadProfilePic = async (formData: FormData): Promise<void> => {
    try {
        await api.put('api/uploadProfilePic', formData);
    } catch (error) {
        handleError(error);
    }
};

export const deleteProfilePic = async (): Promise<void> => {
    try {
        await api.delete('api/deleteProfilePic');
    } catch (error) {
        handleError(error);
    }
};

//---ContactInfo---

export const updateName = async (name: string | null): Promise<AxiosResponse> => {
    return await api.put('api/updateName', { value: name }); //manually handling errors in main function
};

export const updatePhone = async (phone: string | null): Promise<AxiosResponse> => {
    return await api.put('api/updatePhone', { value: phone }); //manually handling errors in main function
};

export const updateCity = async (city: string | null): Promise<AxiosResponse> => {
    return await api.put('api/updateCity', { value: city }); //manually handling errors in main function
};

export const fetchCitySuggestions = async (value: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/fetchCitySuggestions', { params: { value: value } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const updateAndFetchContactPublic = async (isPublic: boolean | null): Promise<AxiosResponse> => {
    try {
        return await api.put('api/updateAndFetchContactPublic', { value: isPublic });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const fetchContactInfo = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/fetchContactInfo');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};