import React, {useEffect, useState} from "react";
import Input from "../../../../../SharedComponents/FormUtil/Input.tsx";
import SubmitButton from "../../../../../SharedComponents/FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {AxiosResponse} from "axios";
import {api} from "../../../../../Config/AxiosConfig/AxiosConfig.ts";
import AnimatedBanner from "../../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUserCheck} from "../../../../../CustomHooks/useUserCheck.ts";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

const LoginForm: React.FC = () => {

    const [login, setLogin] = useState<string>("");

    const [password, setPassword] = useState<string>("");

    const { checkAuth } = useAuth();
    const { CreateDebouncedValue } = useUtil();
    const debouncedLogin: string = CreateDebouncedValue(login, 300);

    const [loginIcon, setLoginIcon] = useState<IconDefinition | null>(null);
    const [loginInfo, setLoginInfo] = useState<string>("");
    const [loginActive, setLoginActive] = useState<boolean>(false);

    const [inputType, setInputType] = useState<"text" | "password">("password");

    const { emailExists, usernameExists, isActive, isOauth2 } = useUserCheck();

    //checks and validates login, displays info for user
    useEffect(() => {
        let isMounted = true;

        if (login.length >= 5) {
            const checkLogin = async (): Promise<void> => {
                try {
                    const emailResponse: AxiosResponse = await emailExists(login);
                    const usernameResponse: AxiosResponse = await usernameExists(login);
                    if (isMounted) {
                        if (emailResponse.data.exists || usernameResponse.data.exists) {
                            setLoginIcon(faCircleCheck);
                            const isActiveResponse: AxiosResponse = await isActive(login);
                            const isOauth2Response: AxiosResponse = await isOauth2(login);
                            if (isMounted) {
                                if (isActiveResponse.data.checks) {
                                    setLoginInfo("")
                                    setLoginActive(false);
                                    if (isOauth2Response.data.checks) {
                                        setLoginInfo("Please authenticate using google.")
                                        setLoginActive(true);
                                    }
                                } else {
                                    setLoginInfo("Please confirm your account on email.")
                                    setLoginActive(true);
                                }
                            }
                        } else {
                            setLoginIcon(faCircleExclamation);
                            setLoginInfo("");
                            setLoginActive(false);
                        }
                    }
                } catch (error) {
                    console.log("Error checking email: ", error);
                }
            }
            checkLogin().then();

            return () => {
                isMounted = false;
            }
        } else {
            setLoginIcon(null);
            setLoginInfo("");
            setLoginActive(false);
        }
    }, [debouncedLogin])

    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);        //displays banner
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);

    const validateUser = async (login: string, password: string) => {
        return await api.get('api/auth/validate-user', {
            params: {login: login, password: password},
        });
    }

    const handleLogin = async () => {
        if (isDisabled) return;
        if (login && password) {
            setIsDisabled(true);
            try {
                const emailResponse: AxiosResponse = await emailExists(login);
                const usernameResponse: AxiosResponse = await usernameExists(login);
                const isActiveResponse: AxiosResponse = await isActive(login);
                const isOauth2Response: AxiosResponse = await isOauth2(login);
                const validateResponse: AxiosResponse = await validateUser(login, password);
                if (emailResponse.data.exists || usernameResponse.data.exists && password.length >= 7 &&
                    !isOauth2Response.data.checks && isActiveResponse.data.checks) {
                    if (!validateResponse.data.isValid) {
                        setWrongPassword(true);
                        return;
                    }
                    const response = await api.get(`api/auth/login`, {
                        params: {login, password}
                    });
                    if (response) {
                        setIsLoggedIn(true);
                        setTimeout(async () => {
                            await checkAuth();
                        }, 2000)
                    }
                    if (!response.data) {
                        console.log("Authentication failed");
                    }
                }
            } catch (error) {
                console.log("Error during login: ", error);
            } finally {
                setTimeout(() => {
                    setIsDisabled(false);
                }, 1000)
            }
        }
    }

    return (
        <div className="flex flex-col items-center w-11/12 pb-8 pt-6 2xl:pb-10 2xl:pt-8 3xl:pb-11 3xl:pt-9 mt-3 gap-6
        xs:gap-7 2xl:gap-8 3xl:gap-9 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded-sm shadow-2xl ">
            <Input placeholder={"E-mail or username"} inputType={"text"} value={login} setValue={setLogin}
            icon={loginIcon} info={loginInfo} isActive={loginActive}/>
            <Input placeholder={"Password"} inputType={inputType} setInputType={setInputType} value={password}
                   setValue={setPassword} hasEye={true} whichForm={"login"}/>
            <SubmitButton label={"Sign in"} onClick={handleLogin} disabled={isDisabled}/>
            {isLoggedIn ? <AnimatedBanner text={"Logged in successfully!"} color={"bg-lowLime"} z={"z-50"}/> : null}
            {wrongPassword ? <AnimatedBanner text={"Wrong password"} onAnimationEnd={() => setWrongPassword(false)}
                                             delay={2000} color={"bg-coolRed"} z={"z-40"}/> : null}
        </div>
    )
}

export default LoginForm