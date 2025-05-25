import React, {useEffect, useState} from "react";
import LoginForm from "./Atomic/Form/LoginForm.tsx";
import Headers from "./Atomic/Headers/Headers.tsx";
import {useNavigate, useParams} from "react-router-dom";
import RegisterForm from "./Atomic/Form/RegisterForm.tsx";
import AuthWindowLoader from "../../../Additional/Loading/AuthWindowLoader.tsx";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";


const AuthWindow: React.FC = () => {
    const [choice, setChoice] = useState<"login" | "register">("login");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const {section} = useParams();
    const navigate = useNavigate();
    const {isMobile} = useUtil();

    useEffect(() => {
        const validSections: Array<"login" | "register"> = [
            "login", "register"];

        if (section && validSections.includes(section as never)) {
            setChoice(section as "login" | "register");
            setIsLoading(false);
        } else {
            navigate("/authenticate/login", {replace: true});
        }
    }, [section, navigate])       //checks for section change

    if (isLoading) return <AuthWindowLoader choice={choice}/>

    return (
        <div className={`flex flex-col items-center w-full h-full bg-lime py-6 max-w-[460px] rounded-sm
        ${isMobile ? "border-y" : "border"} border-gray-300`}>
            <Headers/>
            {choice === "login" ? <LoginForm/> : <RegisterForm/>}
        </div>
    )
}

export default AuthWindow