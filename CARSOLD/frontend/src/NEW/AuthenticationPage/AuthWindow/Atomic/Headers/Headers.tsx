import React, {SetStateAction} from "react";
import {useNavigate} from "react-router-dom";
import Button from "./Atomic/Button.tsx";

interface HeadersProps {
    setChoice: React.Dispatch<SetStateAction<"login" | "register">>;
}

const Headers: React.FC<HeadersProps> = ({setChoice}) => {

    const navigate = useNavigate();

    const handleNavigation = (destination: "login" | "register") => {
        navigate(`/authenticate/${destination}`);
        setChoice(destination);
    }

    const handleGoogleAuth = async () => {
        try {
            window.location.href = `${import.meta.env.VITE_BACKEND_URL}oauth2/authorization/google`;
        } catch (error) {
            console.error('Error during google authentication:', error);
        }
    };       //for Google auth


    return (
        <div className="flex flex-col w-11/12 gap-2">
            <div className="flex flex-row divide-x divide-black">
                <Button label={"Login"} serial={7} onClick={() => handleNavigation("login")}/>
                <Button label={"Register"} serial={8} onClick={() => handleNavigation("register")}/>
            </div>
            <Button label={"Authenticated using Google"} serial={9} onClick={handleGoogleAuth} isGoogle={true}/>
        </div>
    )
}

export default Headers