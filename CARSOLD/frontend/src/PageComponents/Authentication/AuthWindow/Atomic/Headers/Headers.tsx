import React from "react";
import {useNavigate} from "react-router-dom";
import HeaderButton from "./Atomic/HeaderButton.tsx";

const Headers: React.FC = () => {

    const navigate = useNavigate();

    const handleNavigation = (destination: "login" | "register") => {
        navigate(`/authenticate/${destination}`);
    }

    const handleGoogleAuth = async () => {
        try {
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}oauth2/authorization/google`;
        } catch (error) {
            console.error('Error during google authentication:', error);
        }
    };       //for Google auth

    return (
        <div className="flex flex-col w-11/12 gap-2 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl">
            <div className="flex flex-row divide-x divide-black">
                <HeaderButton label={"Login"} serial={1} onClick={() => handleNavigation("login")}/>
                <HeaderButton label={"Register"} serial={2} onClick={() => handleNavigation("register")}/>
            </div>
            <HeaderButton label={"Authenticate using Google"} serial={3} onClick={handleGoogleAuth} isGoogle={true}/>
        </div>
    )
}

export default Headers