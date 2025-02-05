import React, {useEffect, useState} from "react";
import Input from "../../../../../SharedComponents/FormUtil/Input.tsx";
import SubmitButton from "../../../../../SharedComponents/FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import AnimatedBanner from "../../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUserCheck} from "../../../../../CustomHooks/useUserCheck.ts";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {authenticate} from "../../../../../ApiCalls/Service/UserService.ts";
import {AxiosError} from "axios";

const LoginForm: React.FC = () => {

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginIcon, setLoginIcon] = useState<IconDefinition | null>(null);
    const [loginInfo, setLoginInfo] = useState<string>("");
    const [loginActive, setLoginActive] = useState<boolean>(false);
    const [inputType, setInputType] = useState<"text" | "password">("password");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);
    const [isAccountDeleted, setIsAccountDeleted] = useState<boolean>(false);
    const {CreateDebouncedValue} = useUtil();
    const debouncedLogin: string = CreateDebouncedValue(login, 300);
    const [wentWrong, setWentWrong] = useState<boolean>(false);
    const {emailExists, usernameExists, isActive, isOauth2} = useUserCheck();
    const {handleCheckAuth} = useAuth();

    //checks login, displays info for user
    useEffect(() => {
        let isMounted = true;

        if (login.length < 5) {
            setLoginIcon(null);
            setLoginInfo("");
            setLoginActive(false);
            return;
        }

        const checkLogin = async () => {
            try {
                const [emailResponse, usernameResponse] = await Promise.all([
                    emailExists(login),
                    usernameExists(login),
                ]);
                if (!isMounted) return;
                if (emailResponse.data.exists || usernameResponse.data.exists) {
                    const [isActiveResponse, isOauth2Response] = await Promise.all([
                        isActive(login),
                        isOauth2(login),
                    ]);
                    if (!isMounted) return;
                    if (isActiveResponse.data.checks) {
                        setLoginIcon(faCircleCheck);
                        setLoginInfo("");
                        setLoginActive(false);
                        if (isOauth2Response.data.checks) {
                            setLoginInfo("Please authenticate using Google.");
                            setLoginIcon(faCircleExclamation);
                            setLoginActive(true);
                        }
                    } else {
                        setLoginInfo("Please confirm your account via email.");
                        setLoginIcon(faCircleExclamation);
                        setLoginActive(true);
                    }
                } else {
                    setLoginIcon(faCircleExclamation);
                    setLoginInfo("");
                    setLoginActive(false);
                }
            } catch (error) {
                console.error("Error checking login: ", error);
                setLoginIcon(faCircleExclamation);
                setLoginInfo("An error occurred, please try again.");
                setLoginActive(true);
            }
        };

        checkLogin();

        return () => {
            isMounted = false;
        };
    }, [debouncedLogin]);

    const handleAuthenticate = async () => {
        if (isDisabled) return;
        if (!login || password.length < 7) return;
        setIsDisabled(true);
        setWrongPassword(false);

        try {
            await authenticate(login, password);
            setIsLoggedIn(true);
            setTimeout(async () => await handleCheckAuth(), 2000);
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 401) {
                    setWrongPassword(true);
                } else if (error.response.status === 404) {
                    setLoginInfo("Wrong username.");
                    setLoginActive(true);
                } else if (error.response.status !== 400) {
                    setWentWrong(true);
                    console.error("Unexpected error during authentication: ", error);
                }
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 2000);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("isAccountDeleted") === "true") {
            setIsAccountDeleted(true);
            sessionStorage.removeItem("isAccountDeleted");
        }
    }, []);     //detects if account was deleted and displays banner

    return (
        <div className="flex flex-col items-center w-11/12 py-10 mt-3 rounded-sm shadow-2xl ">
            <Input placeholder={"E-mail or username"} inputType={"text"} value={login} setValue={setLogin}
                   icon={loginIcon} info={loginInfo} isActive={loginActive}/>
            <Input placeholder={"Password"} inputType={inputType} setInputType={setInputType} value={password}
                   setValue={setPassword} hasEye={true} whichForm={"login"}/>
            <SubmitButton label={"Sign in"} onClick={handleAuthenticate} disabled={isDisabled}/>
            {isLoggedIn && <AnimatedBanner text={"Logged in successfully!"} color={"bg-lowLime"} z={"z-50"}/>}
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