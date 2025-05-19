import React, {useEffect, useState} from "react";
import Input from "./FormUtil/Input.tsx";
import SubmitButton from "./FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import AnimatedBanner from "../../../../../Additional/Banners/AnimatedBanner.tsx";
import {useUserInfo} from "../../../../../CustomHooks/useUserInfo.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {authenticate} from "../../../../../ApiCalls/Services/UserService.ts";
import {AxiosError} from "axios";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

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
    const {handleCheckLogin, handleCheckAccount} = useUserInfo();
    const {handleCheckAuth} = useAuth();
    const {t, language} = useLanguage();

    useEffect(() => {
        setLoginInfo("");
    }, [language]); //resets info when language changes

    useEffect(() => {
        if (login.length < 3) {
            setLoginIcon(null);
            setLoginInfo("");
            return;
        }
        const checkLogin = async () => {
            const present = await handleCheckLogin(login);
            if (present) {
                const account = await handleCheckAccount(login);
                if (!account.active) {
                    setLoginInfo(t("login1"));
                    setLoginIcon(faCircleExclamation);
                    return;
                } else if (account.oauth2) {
                    setLoginInfo(t("login2"));
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
                    setLoginInfo(t("login3"));
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
            <Input placeholder={t("login4")} inputType={"text"} value={login} setValue={setLogin}
                   icon={loginIcon} info={loginInfo}/>
            <Input placeholder={t("login5")} inputType={inputType} setInputType={setInputType} value={password}
                   setValue={setPassword} hasEye={true} whichForm={"login"}/>
            <SubmitButton label={t("login6")} onClick={handleAuthenticate} disabled={isDisabled}/>
            {wrongPassword && <AnimatedBanner text={t("animatedBanner11")} onAnimationEnd={() => setWrongPassword(false)}
                                              delay={2000} color={"bg-coolRed"} z={"z-40"}/>}
            {wentWrong && <AnimatedBanner text={t("animatedBanner1")} onAnimationEnd={() => setWentWrong(false)}
                                          delay={4000} color={"bg-coolYellow"} z={"z-40"}/>}
            {isAccountDeleted && <AnimatedBanner text={t("animatedBanner12")} onAnimationEnd={() => setIsAccountDeleted(false)}
                                delay={4000} color={"bg-coolYellow"} z={"z-40"}/>}
        </div>
    )
}

export default LoginForm