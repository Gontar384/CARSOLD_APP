import React, {useEffect, useState} from "react";
import LoginForm from "./Atomic/Form/LoginForm.tsx";
import Headers from "./Atomic/Headers/Headers.tsx";
import {useNavigate, useParams} from "react-router-dom";
import RegisterForm from "./Atomic/Form/RegisterForm.tsx";
import AuthWindowLoader from "../../../SharedComponents/Additional/Loading/AuthWindowLoader.tsx";


const AuthWindow: React.FC = () => {

    const {section} = useParams();   //retrieves params from url

    const navigate = useNavigate();

    const [choice, setChoice] = useState<"login" | "register">("login");  //sets display: login or register form
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    if (isLoading) {
        return (
            <AuthWindowLoader/>
        )
    }  //to prevent /login blinking

    return (
        <div className="flex flex-col items-center bg-lime py-6 xs:py-8 2xl:py-10 w-11/12 xs:w-10/12
        max-w-[360px] xs:max-w-[420px] sm:min-w-[420px] 2xl:max-w-[500px] 3xl:max-w-[600px] rounded-sm">
            <Headers/>
            {choice === "login" ? <LoginForm/> : <RegisterForm/>}
        </div>
    )
}

export default AuthWindow