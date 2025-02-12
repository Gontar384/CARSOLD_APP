import React, {useEffect, useState} from "react";
import Input from "../../../../../SharedComponents/FormUtil/Input.tsx";
import SubmitButton from "../../../../../SharedComponents/FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import AnimatedBanner from "../../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUserInfo} from "../../../../../CustomHooks/useUserInfo.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {authenticate} from "../../../../../ApiCalls/Services/UserService.ts";
import {AxiosError} from "axios";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";

const LoginForm: React.FC = () => {

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginIcon, setLoginIcon] = useState<IconDefinition | null>(null);
    const [loginInfo, setLoginInfo] = useState<string>("");
    const [inputType, setInputType] = useState<"text" | "password">("password");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);
    const [isAccountDeleted, setIsAccountDeleted] = useState<boolean>(false);
    const {CreateDebouncedValue} = useUtil();
    const debouncedLogin: string = CreateDebouncedValue(login, 300);
    const [wentWrong, setWentWrong] = useState<boolean>(false);
    const {handleCheckLogin, handleCheckInfo} = useUserInfo();
    const {handleCheckAuth} = useAuth();

    useEffect(() => {
        if (login.length < 3) {
            setLoginIcon(null);
            setLoginInfo("");
            return;
        }

        const checkLogin = async () => {
            const present = await handleCheckLogin(login);
            if (present) {
                const account = await handleCheckInfo(login);
                if (!account.active) {
                    setLoginInfo("Please confirm your account via email.");
                    setLoginIcon(faCircleExclamation);
                    return;
                } else if (account.oauth2) {
                    setLoginInfo("Please authenticate using Google.");
                    setLoginIcon(faCircleExclamation);
                    return;
                }
                setLoginIcon(faCircleCheck);
                setLoginInfo("");
            } else {
                setLoginIcon(faCircleExclamation);
                setLoginInfo("");
            }
        };

        checkLogin();

    }, [debouncedLogin]);      //checks login, displays info for user

    const handleAuthenticate = async () => {
        if (isDisabled) return;
        if (!login || password.length < 5) return;

        setWrongPassword(false);
        setIsDisabled(true);
        try {
            await authenticate(login, password);
            await handleCheckAuth();
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 401) {
                    setWrongPassword(true);
                } else if (error.response.status === 404) {
                    setLoginInfo("Wrong username.");
                } else if (error.response.status !== 400) {
                    setWentWrong(true);
                    console.error("Unexpected error during authentication: ", error);
                }
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 1000);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("isAccountDeleted") === "true") {
            setIsAccountDeleted(true);
            sessionStorage.removeItem("isAccountDeleted");
        }
    }, []);   //detects if account was deleted and displays banner

    return (
        <div className="flex flex-col items-center w-11/12 py-10 mt-3 rounded-sm shadow-2xl ">
            <Input placeholder={"E-mail or username"} inputType={"text"} value={login} setValue={setLogin}
                   icon={loginIcon} info={loginInfo}/>
            <Input placeholder={"Password"} inputType={inputType} setInputType={setInputType} value={password}
                   setValue={setPassword} hasEye={true} whichForm={"login"}/>
            <SubmitButton label={"Sign in"} onClick={handleAuthenticate} disabled={isDisabled}/>
            {wrongPassword && <AnimatedBanner text={"Wrong password!"} onAnimationEnd={() => setWrongPassword(false)}
                                              delay={2000} color={"bg-coolRed"} z={"z-40"}/>}
            {wentWrong && <AnimatedBanner text={"Something went wrong..."} onAnimationEnd={() => setWentWrong(false)}
                                          delay={4000} color={"bg-coolYellow"} z={"z-40"}/>}
            {isAccountDeleted && <AnimatedBanner text={"Account deleted..."} onAnimationEnd={() => setIsAccountDeleted(false)}
                                delay={4000} color={"bg-coolYellow"} z={"z-40"}/>}
        </div>
    )
}

export default LoginForm