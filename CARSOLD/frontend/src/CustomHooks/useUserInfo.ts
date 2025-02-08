import {checkGoogleAuth, checkInfo, checkLogin, checkOldPassword} from "../ApiCalls/Services/UserService.ts";

export const useUserInfo = () => {

    const handleCheckLogin = async (login: string | null) => {
        try {
            const response = await checkLogin(login);
            if (response.data) {
                return response.data.value;
            }
        } catch (error) {
            console.error("Unexpected error during login check: ", error);
        }
    };

    const handleCheckInfo = async (login: string | null) => {
        try {
            const response = await checkInfo(login);
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            console.error("Unexpected error during info check: ", error);
        }
    };

    const handleCheckGoogleAuth = async () => {
        try {
            const response = await checkGoogleAuth();
            if (response.data) {
                return response.data.value;
            }
        } catch (error) {
            console.error("Unexpected error during GoogleAuth check: ", error);
        }
    };

    const handleCheckOldPassword = async (password: string | null) => {
        try {
            const response = await checkOldPassword(password);
            if (response.data) {
                return response.data.value;
            }
        } catch (error) {
            console.error("Unexpected error during password check: ", error);
        }
    };

    const handleCheckPassword = (password: string): boolean => {
        if (password.trim().length < 8 || password.trim().length > 50) {
            return false;
        }
        return !(!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password));
    }

    return {handleCheckLogin, handleCheckInfo, handleCheckGoogleAuth, handleCheckOldPassword, handleCheckPassword}
}