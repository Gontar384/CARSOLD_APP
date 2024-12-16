import React, {useEffect, useState} from "react";
import Input from "../../../../../SharedComponents/FormUtil/Input.tsx";
import SubmitButton from "../../../../../SharedComponents/FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {api} from "../../../../../Config/AxiosConfig/AxiosConfig.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {AxiosResponse} from "axios";
import AnimatedBanner from "../../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {useUserCheck} from "../../../../../CustomHooks/useUserCheck.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

const RegisterForm: React.FC = () => {

    interface User {
        email: string,
        username: string,
        password: string
    }

    const [user, setUser] = useState<User>({
        email: "", username: "", password: ""
    })
    const [passwordRep, setPasswordRep] = useState<string>("");

    const { CreateDebouncedValue } = useUtil();
    const debouncedEmail: string = CreateDebouncedValue(user.email, 300);
    const debouncedUsername: string = CreateDebouncedValue(user.username, 300);

    const [emailIcon, setEmailIcon] = useState<IconProp | null>(null);
    const [emailInfo, setEmailInfo] = useState<string>("");
    const [emailActive, setEmailActive] = useState<boolean>(false);
    const [usernameIcon, setUsernameIcon] = useState<IconProp | null>(null);
    const [usernameInfo, setUsernameInfo] = useState<string>("");
    const [usernameActive, setUsernameActive] = useState<boolean>(false);
    const [passwordIcon, setPasswordIcon] = useState<IconProp | null>(null)
    const [passwordInfo, setPasswordInfo] = useState<string>("");
    const [passwordActive, setPasswordActive] = useState<boolean>(false);
    const [passwordRepIcon, setPasswordRepIcon] = useState<IconProp | null>(null);

    const [inputType, setInputType] = useState<"text" | "password">("password");

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };  //checks correct email format

    const { emailExists, usernameExists, isActive, checkPassword } = useUserCheck();

    //all useEffects display info for user
    useEffect(() => {
        let isMounted: boolean = true;

        if (user.email.length >= 5) {
            if (validateEmail(user.email)) {
                if (user.email.length <= 30) {
                    const checkEmail = async () => {
                        try {
                            const response: AxiosResponse = await emailExists(user.email);
                            const isActiveResponse: AxiosResponse = await isActive(user.email);
                            if (isMounted) {
                                if (response.data.exists && isActiveResponse.data.checks) {
                                    setEmailIcon(faCircleExclamation);
                                    setEmailInfo("Email is already taken.")
                                    setEmailActive(true);
                                } else {
                                    setEmailIcon(faCircleCheck);
                                    setEmailInfo("");
                                    setEmailActive(false);
                                }
                            }
                        } catch (error) {
                            console.log("Error checking email: ", error)
                        }
                    }
                    checkEmail().then();

                    return () => {
                        isMounted = false;
                    };

                } else {
                    setEmailIcon(faCircleExclamation);
                    setEmailInfo("Email is too long.")
                    setEmailActive(true);
                }
            } else {
                setEmailIcon(faCircleExclamation);
                setEmailInfo("It doesn't look like an email...")
                setEmailActive(true);
            }
        } else {
            setEmailIcon(null);
            setEmailInfo("")
            setEmailActive(false);
        }
    }, [debouncedEmail])     //checks if email is valid

    useEffect(() => {
        let isMounted: boolean = true;

        if (user.username !== "") {
            if (/^[a-zA-Z0-9]+$/.test(user.username)) {
                if (user.username.length <= 15) {
                    if (user.username.length >= 3) {
                        const checkUsername = async () => {
                            try {
                                const response: AxiosResponse = await usernameExists(user.username);
                                const isActiveResponse: AxiosResponse = await isActive(user.username);
                                if (isMounted) {
                                    if (response.data.exists && isActiveResponse.data.checks) {
                                        setUsernameIcon(faCircleExclamation);
                                        setUsernameInfo("Username already exists.")
                                        setUsernameActive(true);
                                    } else {
                                        setUsernameIcon(faCircleCheck);
                                        setUsernameInfo("")
                                        setUsernameActive(false);
                                    }
                                }
                            } catch (error) {
                                console.log("Error checking username: ", error);
                            }
                        }
                        checkUsername().then();

                        return () => {
                            isMounted = false;
                        }
                    } else {
                        setUsernameIcon(faCircleExclamation);
                        setUsernameInfo("Username is too short.")
                        setUsernameActive(true);
                    }
                } else {
                    setUsernameIcon(faCircleExclamation);
                    setUsernameInfo("Username is too long.")
                    setUsernameActive(true);
                }
            } else {
                setUsernameIcon(faCircleExclamation);
                setUsernameInfo("Username has not allowed characters.")
                setUsernameActive(true);
            }
        } else {
            setUsernameIcon(null);
            setUsernameInfo("")
            setUsernameActive(false);
        }
    }, [debouncedUsername])     //checks if username is valid

    useEffect(() => {
        if (user.password !== "") {
            if (user.password.length >= 7) {
                if (user.password.length <= 25) {
                    if (/[A-Z]/.test(user.password) && /[a-z]/.test(user.password) && /\d/.test(user.password)) {
                        setPasswordIcon(faCircleCheck);
                        setPasswordInfo("");
                        setPasswordActive(false);
                    } else {
                        setPasswordIcon(faCircleExclamation);
                        setPasswordInfo("Must include lowercase, uppercase and number.");
                        setPasswordActive(true);
                    }
                } else {
                    setPasswordIcon(faCircleExclamation);
                    setPasswordInfo("Password is too long.");
                    setPasswordActive(true);
                }
            } else {
                setPasswordIcon(faCircleExclamation);
                setPasswordInfo("Password is too short.");
                setPasswordActive(true);
            }
        } else {
            setPasswordIcon(null);
            setPasswordInfo("");
            setPasswordActive(false);
        }
    }, [user.password])      //checks if password is strong enough

    useEffect(() => {
        if (user.password !== "" && passwordRep !== "") {
            if (checkPassword(user.password)) {
                if (passwordRep === user.password) {
                    setPasswordRepIcon(faCircleCheck);
                } else {
                    setPasswordRepIcon(faCircleExclamation);
                }
            } else {
                setPasswordRepIcon(null);
            }
        } else {
            setPasswordRepIcon(null);
        }
    }, [checkPassword, passwordRep, user.password])   //checks if repeated password equals password

    const [termsCheck, setTermsCheck] = useState<boolean>(false);   //manages terms of use
    const [mark, setMark] = useState<boolean>(false);

    useEffect(() => {
        if (termsCheck) {
            setMark(false);
        }
    }, [termsCheck]);   //checks checkbox mark

    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button

    const [isRegistered, setIsRegistered] = useState<boolean>(false);   //displays banner

    const handleRegister = async () => {
        if (isDisabled) return;
        if (user.email && user.username && user.password && passwordRep) {
            setIsDisabled(true);
            try {
                if (user.email.length > 30 || !validateEmail(user.email)) {
                    return;
                }
                if (user.username.length < 3 || user.username.length > 15 || (!/^[a-zA-Z0-9]+$/.test(user.username))) {
                    return;
                }
                if (!checkPassword(user.password) || user.password !== passwordRep) {
                    return;
                }
                const emailResponse: AxiosResponse = await emailExists(user.email);
                const isActiveResponse: AxiosResponse = await isActive(user.email);
                if (emailResponse.data.exists && isActiveResponse.data.checks) {
                    return;
                }
                const usernameResponse: AxiosResponse = await usernameExists(user.username);
                if (usernameResponse.data.exists && isActiveResponse.data.checks) {
                    return;
                }
                if (!termsCheck) {
                    setMark(true);
                    return;
                } else {
                    setMark(false);
                }
                const response = await api.post(`api/auth/register`, user);
                if (response.data) {
                    setIsRegistered(true);
                }
            } catch (error) {
                console.log("Error during register:", error)
            } finally {
                setTimeout((): void => {
                    setIsDisabled(false);
                }, 2000)
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-11/12 pb-8 pt-6 2xl:pb-10 2xl:pt-8 3xl:pb-11 3xl:pt-9
        mt-3 gap-6 xs:gap-7 2xl:gap-8 3xl:gap-9 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl rounded-sm shadow-2xl">
            <Input placeholder={"E-mail"} inputType={"text"} value={user.email} field={"email"} setValue={setUser}
                   icon={emailIcon} info={emailInfo} isActive={emailActive}/>
            <Input placeholder={"Username"} inputType={"text"} value={user.username} field={"username"}
                   setValue={setUser} icon={usernameIcon} info={usernameInfo} isActive={usernameActive}/>
            <Input placeholder={"Password"} inputType={inputType} setInputType={setInputType} value={user.password}
                   field={"password"} setValue={setUser} icon={passwordIcon} info={passwordInfo} isActive={passwordActive}/>
            <Input placeholder={"Repeat password"} inputType={inputType} setInputType={setInputType} value={passwordRep}
                   setValue={setPasswordRep} hasEye={true} whichForm={"register"} termsCheck={termsCheck}
                   setTermsCheck={setTermsCheck} icon={passwordRepIcon} mark={mark}/>
            <SubmitButton label={"Register"} onClick={handleRegister} disabled={isDisabled}/>
            {isRegistered ? <AnimatedBanner text={"Registered successfully! We've sent you e-mail with confirmation link. Check it out!"}
                                            onAnimationEnd={() => setIsRegistered(false)} delay={7000} color={"bg-lowLime"} z={"z-50"}/> : null}
        </div>
    )
}

export default RegisterForm