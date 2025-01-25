import {api} from "../Config/AxiosConfig/AxiosConfig.ts";

export const useUserCheck = () => {

    const emailExists = async (email: string) => {
        return await api.get(`api/auth/register/check-email`, {
            params: {email: email},
        });
    };      //checks if email already exists

    const usernameExists = async (username: string) => {
        return await api.get(`api/auth/register/check-username`, {
            params: {username: username},
        });
    };      //checks if username already exists

    const isActive = async (login: string) => {
        return await api.get(`api/auth/check-active`, {
            params: {login: login},
        });
    };       //checks if user's account is active

    const isOauth2 = async (login: string) => {
        return await api.get(`api/auth/check-oauth2`, {
            params: {login: login},
        });
    };        //checks if user was authenticated via Google

    const checkPassword = (password: string): boolean => {
        if (password.trim().length < 7 || password.trim().length > 25) {
            return false;
        }
        return !(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password));
    }     //checks if password is strong enough

    const checkOldPassword = async (password: string) => {
        return await api.get('api/auth/validate-password', {
            params: {password}
        });
    }

    //checks google auth
    const checkGoogleAuth = async () => {
        return await api.get('api/auth/check-google-auth');
    }

    return {emailExists, usernameExists, isActive, isOauth2, checkPassword, checkOldPassword, checkGoogleAuth}
}