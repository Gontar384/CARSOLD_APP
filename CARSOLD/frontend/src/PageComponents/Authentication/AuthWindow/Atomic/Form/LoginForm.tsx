import React, {useEffect, useState} from "react";
import Input from "../../../../../SharedComponents/FormUtil/Input.tsx";
import SubmitButton from "../../../../../SharedComponents/FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {api} from "../../../../../Config/AxiosConfig/AxiosConfig.ts";
import AnimatedBanner from "../../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUserCheck} from "../../../../../CustomHooks/useUserCheck.ts";
import {useAuth} from "../../../../../GlobalProviders/Auth/useAuth.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {getAuthentication} from "../../../../../ApiCalls/Service/UserService.ts";
import {BadRequestError, NotFoundError} from "../../../../../ApiCalls/Errors/CustomErrors.ts";

const LoginForm: React.FC = () => {

    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginIcon, setLoginIcon] = useState<IconDefinition | null>(null);
    const [loginInfo, setLoginInfo] = useState<string>("");
    const [loginActive, setLoginActive] = useState<boolean>(false);
    const [inputType, setInputType] = useState<"text" | "password">("password");
    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);        //displays banner
    const [wrongPassword, setWrongPassword] = useState<boolean>(false);
    const [isAccountDeleted, setIsAccountDeleted] = useState<boolean>(false);
    const {CreateDebouncedValue} = useUtil();
    const debouncedLogin: string = CreateDebouncedValue(login, 300);
    const [wentWrong, setWentWrong] = useState<boolean>(false);
    const {emailExists, usernameExists, isActive, isOauth2} = useUserCheck();
    const {checkAuth} = useAuth();

    //checks and validates login, displays info for user
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
                    setLoginIcon(faCircleCheck);
                    const [isActiveResponse, isOauth2Response] = await Promise.all([
                        isActive(login),
                        isOauth2(login),
                    ]);
                    if (!isMounted) return;
                    if (isActiveResponse.data.checks) {
                        setLoginInfo("");
                        setLoginActive(false);
                        if (isOauth2Response.data.checks) {
                            setLoginInfo("Please authenticate using Google.");
                            setLoginActive(true);
                        }
                    } else {
                        setLoginInfo("Please confirm your account via email.");
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

    const validateUser = async (login: string, password: string) => {
        return await api.get('api/auth/validate-user', {
            params: {login: login, password: password},
        });
    }

    const handleLogin = async () => {
        if (isDisabled) return;
        if (!login || !password) return;

        setIsDisabled(true);
        setWrongPassword(false);

        try {
            const [emailResponse, usernameResponse, isActiveResponse, isOauth2Response] = await Promise.all([
                emailExists(login),
                usernameExists(login),
                isActive(login),
                isOauth2(login),
            ]);

            const isExistingUser = emailResponse.data.exists || usernameResponse.data.exists;
            const isPasswordValid = password.length >= 7;
            const isAccountActive = isActiveResponse.data.checks;
            const isOauth2User = isOauth2Response.data.checks;

            if (isExistingUser && isPasswordValid && !isOauth2User && isAccountActive) {
                const validateResponse = await validateUser(login, password);
                if (!validateResponse.data.isValid) {
                    setWrongPassword(true);
                    return;
                }

                try {
                    await getAuthentication(login, password);
                    setIsLoggedIn(true);
                    setTimeout(async () => await checkAuth(), 2000);
                } catch (error: unknown) {
                    setWentWrong(true);
                    if (error instanceof BadRequestError) {
                        console.log("Authentication failed - bad credentials: ", error);
                    } else if (error instanceof NotFoundError) {
                        console.log("Authentication failed - user not found: ", error);
                    } else {
                        console.log("Unexpected error during authentication: ", error);
                    }
                }

            } else {
                console.log("Login validation failed: conditions check");
            }
        } catch (error) {
            console.log("Error during login: ", error);
            setWentWrong(true);
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
            <SubmitButton label={"Sign in"} onClick={handleLogin} disabled={isDisabled}/>
            {isLoggedIn && <AnimatedBanner text={"Logged in successfully!"} color={"bg-lowLime"} z={"z-50"}/>}
            {wrongPassword && <AnimatedBanner text={"Wrong password!"} onAnimationEnd={() => setWrongPassword(false)}
                                              delay={2000} color={"bg-coolRed"} z={"z-40"}/>}
            {isAccountDeleted &&
                <AnimatedBanner text={"Account deleted..."} onAnimationEnd={() => setIsAccountDeleted(false)}
                                delay={4000} color={"bg-coolYellow"} z={"z-40"}/>}
            {wentWrong && <AnimatedBanner text={"Something went wrong..."} onAnimationEnd={() => setWentWrong(false)}
                                          delay={4000} color={"bg-coolYellow"} z={"z-40"}/>}
        </div>
    )
}

export default LoginForm