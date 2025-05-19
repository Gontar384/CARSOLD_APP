import React from "react";
import {useNavigate} from "react-router-dom";
import HeaderButton from "./Atomic/HeaderButton.tsx";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

const Headers: React.FC = () => {
    const navigate = useNavigate();
    const {t} = useLanguage();

    const handleNavigation = (destination: "login" | "register") => {
        navigate(`/authenticate/${destination}`);
    }

    const handleGoogleAuth = async () => {
        try {
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/google`;
        } catch (error) {
            console.error('Error during google authentication:', error);
        }
    };

    return (
        <div className="flex flex-col w-11/12 gap-2">
            <div className="flex flex-row divide-x divide-black">
                <HeaderButton label={t("authHeader1")} onClick={() => handleNavigation("login")}/>
                <HeaderButton label={t("authHeader2")} onClick={() => handleNavigation("register")}/>
            </div>
            <HeaderButton label={t("authHeader3")} onClick={handleGoogleAuth} isGoogle={true}/>
        </div>
    )
}

export default Headers