import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {handleError} from "../Errors/ErrorHandler.ts";
import {AxiosResponse} from "axios";
import {User} from "../../PageComponents/Authentication/AuthWindow/Atomic/Form/RegisterForm.tsx";

//---Authentication---

export const checkAuth = async (): Promise<AxiosResponse> => {
    try {
        return await api.get(`api/public/auth/checkAuth`);
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const fetchJwt = async (): Promise<void> => {
    try {
        await api.get('api/private/auth/fetchJwt');
    } catch (error) {
        handleError(error);
    }
};

export const activateAccount = async (token: string | null): Promise<void> => {
    try {
        await api.patch(`api/public/auth/activateAccount`, { value: token });
    } catch (error) {
        handleError(error);
    }
};

export const authenticate = async (login: string | null, password: string | null): Promise<AxiosResponse> => {
    return await api.post(`api/public/auth/authenticate`, { login: login, password: password}); //manually handling errors in main function
};

export const logout = async (): Promise<void> => {
    try {
        await api.post(`api/public/auth/logout`);
    } catch (error) {
        handleError(error);
    }
};

//---Management---

export const registerUser = async (user: User, translate: boolean | null): Promise<AxiosResponse> => {
    return await api.post('api/public/user/register', user, { params: { translate }}); //manually handling errors in main function
};

export const fetchUsername = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/user/fetchUsername');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const fetchEmail = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/user/fetchEmail');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const changePassword = async (oldPassword: string | null, newPassword: string | null): Promise<void> => {
    try {
        await api.patch("api/private/user/changePassword", { oldPassword: oldPassword, newPassword: newPassword });
    } catch (error) {
        handleError(error);
    }
};

export const changePasswordRecovery = async (token: string | null, password: string | null): Promise<void> => {
    try {
        await api.patch('api/public/user/changePasswordRecovery', { token: token, password: password });
    } catch (error) {
        handleError(error);
    }
};

export const deleteUser = async (password: string | null): Promise<void> => {
    try {
        await api.delete('api/private/user/delete', { params: { password: password } });
    } catch (error) {
        handleError(error);
    }
};

//---EmailNotification---

export const sendPasswordRecoveryEmail = async (email: string | null, translate: boolean | null): Promise<void> => {
    try {
        await api.post('api/public/email/sendPasswordRecoveryEmail', {email: email, translate: translate});
    } catch (error) {
        handleError(error);
    }
};

//---Info---

export const checkLogin = async (login: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/public/userInfo/checkLogin', { params : { login: login } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const checkAccount = async (login: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/public/userInfo/checkAccount', { params: { login: login } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const checkGoogleAuth = async (): Promise<AxiosResponse> => {
    try{
        return await api.get('api/private/userInfo/checkGoogleAuth');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const checkOldPassword = async (password: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/userInfo/checkOldPassword', { params: { password: password } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const checkAdmin = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/userInfo/checkAdmin');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

//---ProfilePic---

export const fetchProfilePic = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/userProfilePic/fetch');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const uploadProfilePic = async (formData: FormData): Promise<void> => {
    try {
        await api.patch('api/private/userProfilePic/upload', formData);
    } catch (error) {
        handleError(error);
    }
};

export const deleteProfilePic = async (): Promise<void> => {
    try {
        await api.delete('api/private/userProfilePic/delete');
    } catch (error) {
        handleError(error);
    }
};

//---UserContactInfo---

export const updateName = async (name: string | null): Promise<AxiosResponse> => {
    return await api.patch('api/private/userContactInfo/updateName', { value: name }); //manually handling errors in main function
};

export const updatePhone = async (phone: string | null): Promise<AxiosResponse> => {
    return await api.patch('api/private/userContactInfo/updatePhone', { value: phone }); //manually handling errors in main function
};

export const updateCity = async (city: string | null): Promise<AxiosResponse> => {
    return await api.patch('api/private/userContactInfo/updateCity', { value: city }); //manually handling errors in main function
};

export const fetchCitySuggestions = async (value: string | null): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/userContactInfo/fetchCitySuggestions', { params: { value: value } });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const updateAndFetchContactPublic = async (isPublic: boolean | null): Promise<AxiosResponse> => {
    try {
        return await api.patch('api/private/userContactInfo/updateAndFetchContactPublic', { value: isPublic });
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

export const fetchContactInfo = async (): Promise<AxiosResponse> => {
    try {
        return await api.get('api/private/userContactInfo/fetch');
    } catch (error) {
        handleError(error);
        return Promise.reject(error);
    }
};

//---Admin---

export const adminDeleteOffer = async (id: number | null): Promise<void> => {
    try {
        await api.delete(`api/private/admin/deleteOffer/${id}`);
    } catch (error) {
        handleError(error);
    }
};

export const adminFetchReports = async (page: number, size: number): Promise<AxiosResponse> => {
    try {
        return await api.get("api/private/admin/fetchReports", { params: { page: page, size: size } });
    } catch (error) {
        handleError(error);
        return Promise.reject();
    }
};

export const adminDeleteReport = async (id: number | null): Promise<void> => {
    try {
        await api.delete(`api/private/admin/deleteReport/${id}`);
    } catch (error) {
        handleError(error);
    }
};

export const adminDeleteUser = async (username: string | null): Promise<void> => {
    try {
        await api.delete(`api/private/admin/deleteUser/${username}`);
    } catch (error) {
        handleError(error);
    }
};