import React, {useEffect, useState} from "react";
import Input from "./FormUtil/Input.tsx";
import SubmitButton from "./FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import AnimatedBanner from "../../../../../Additional/Banners/AnimatedBanner.tsx";
import {useUserInfo} from "../../../../../CustomHooks/useUserInfo.ts";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {registerUser} from "../../../../../ApiCalls/Services/UserService.ts";
import {AxiosError} from "axios";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";
import RegisterAndSearchLoading from "../../../../../Additional/Loading/RegisterAndSearchLoading.tsx";

export interface User {
    email: string,
    username: string,
    password: string
}

const RegisterForm: React.FC = () => {
    const [user, setUser] = useState<User>({
        email: "", username: "", password: ""
    })
    const [passwordRep, setPasswordRep] = useState<string>("");
    const {CreateDebouncedValue} = useUtil();
    const debouncedEmail: string = CreateDebouncedValue(user.email, 300);
    const debouncedUsername: string = CreateDebouncedValue(user.username, 300);
    const [emailIcon, setEmailIcon] = useState<IconProp | null>(null);
    const [emailInfo, setEmailInfo] = useState<string>("");
    const [usernameIcon, setUsernameIcon] = useState<IconProp | null>(null);
    const [usernameInfo, setUsernameInfo] = useState<string>("");
    const [passwordIcon, setPasswordIcon] = useState<IconProp | null>(null)
    const [passwordInfo, setPasswordInfo] = useState<string>("");
    const [passwordRepIcon, setPasswordRepIcon] = useState<IconProp | null>(null);
    const [inputType, setInputType] = useState<"text" | "password">("password");
    const {handleCheckLogin, handleCheckAccount, handleCheckPassword} = useUserInfo();
    const [termsCheck, setTermsCheck] = useState<boolean>(false);
    const [mark, setMark] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [wentWrong, setWentWrong] = useState<boolean>(false);
    const [wrongData, setWrongData] = useState<boolean>(false);
    const {t, language} = useLanguage();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setEmailInfo("");
        setUsernameInfo("");
        setPasswordInfo("");
    }, [language]); //resets info when language changes

    useEffect(() => {
        if (user.email.length < 5) {
            setEmailIcon(null);
            setEmailInfo("");
            return;
        }
        if (user.email.length > 50) {
            setEmailIcon(faCircleExclamation);
            setEmailInfo(t("register1"));
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            setEmailIcon(faCircleExclamation);
            setEmailInfo(t("register2"));
            return;
        }

        const checkEmail = async () => {
            const taken = await handleCheckLogin(user.email);
            if (taken) {
                const account = await handleCheckAccount(user.email);
                if (account.active) {
                    setEmailIcon(faCircleExclamation);
                    setEmailInfo(t("register3"));
                } else {
                    setEmailIcon(faCircleCheck);
                    setEmailInfo("");
                }
            } else {
                setEmailIcon(faCircleCheck);
                setEmailInfo("");
            }
        };

        checkEmail();
    }, [debouncedEmail]);  //checks if email is valid

    useEffect(() => {
        if (user.username === "") {
            setUsernameIcon(null);
            setUsernameInfo("");
            return;
        }
        if (!/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(user.username)) {
            setUsernameIcon(faCircleExclamation);
            setUsernameInfo(t("register4"));
            return;
        }
        if (user.username.length < 3) {
            setUsernameIcon(faCircleExclamation);
            setUsernameInfo(t("register5"));
            return;
        }
        if (user.username.length > 15) {
            setUsernameIcon(faCircleExclamation);
            setUsernameInfo(t("register6"));
            return;
        }

        const checkUsername = async () => {
            const taken = await handleCheckLogin(user.username);
            if (taken) {
                const account = await handleCheckAccount(user.username);
                if (account.active) {
                    setUsernameIcon(faCircleExclamation);
                    setUsernameInfo(t("register7"));
                } else {
                    setUsernameIcon(faCircleCheck);
                    setUsernameInfo("");
                }
            } else {
                setUsernameIcon(faCircleCheck);
                setUsernameInfo("");
            }
        };

        checkUsername();

    }, [debouncedUsername]); //checks if username is valid

    useEffect(() => {
        if (user.password == "") {
            setPasswordIcon(null);
            setPasswordInfo("");
            return;
        }
        if (user.password.length < 8) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo(t("register8"));
            return;
        }
        if (user.password.length > 50) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo(t("register9"));
            return;
        }
        if (/[A-Z]/.test(user.password) && /[a-z]/.test(user.password) && /\d/.test(user.password)) {
            setPasswordIcon(faCircleCheck);
            setPasswordInfo("");
        } else {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo(t("register10"));
        }
    }, [user.password]);  //checks if password is strong enough

    useEffect(() => {
        if (user.password == "" || passwordRep == "") {
            setPasswordRepIcon(null);
            return;
        }
        if (!handleCheckPassword(user.password)) {
            setPasswordRepIcon(null);
            return;
        }

        if (passwordRep === user.password) setPasswordRepIcon(faCircleCheck);
        else setPasswordRepIcon(faCircleExclamation);

    }, [handleCheckPassword, passwordRep, user.password]);   //checks if repeated password equals password

    useEffect(() => {
        if (termsCheck) setMark(false);
    }, [termsCheck]);   //checks checkbox mark

    const handleRegisterUser = async () => {
        if (isDisabled) return;
        if (!user.email || !user.username || !user.password || !passwordRep) return;
        if (user.email.length > 30 || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))) {
            return;
        }
        if (user.username.length < 3 || user.username.length > 15 || (!/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(user.username))) {
            return;
        }
        if (!handleCheckPassword(user.password) || user.password !== passwordRep) {
            return;
        }
        if (!termsCheck) {
            setMark(true);
            return;
        } else {
            setMark(false);
        }
        setIsDisabled(true);
        setLoading(true);
        try {
            const response = await registerUser(user, language === "ENG");
            if (response.status === 201) {
                setIsRegistered(true);
                setUser({email: '', username: '', password: '',});
                setPasswordRep('');
                setEmailIcon(null);
                setUsernameIcon(null);
                setTermsCheck(false);
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 422) {
                    setUsernameIcon(faCircleExclamation);
                    setUsernameInfo(t("register11"));
                } else if (error.response.status === 400) {
                    setWrongData(true);
                    console.error("Wrong data provided:", error);
                } else {
                    setWentWrong(true);
                    console.error("Unexpected error during registration: ", error);
                }
            }
        } finally {
            setLoading(false);
        }
        setTimeout(() => setIsDisabled(false), 1000);
    };

    return (
        <div className="flex flex-col items-center w-11/12 py-8 mt-3 rounded-sm shadow-2xl relative">
            <Input placeholder={"E-mail"} inputType={"text"} value={user.email} field={"email"} setValue={setUser}
                   icon={emailIcon} info={emailInfo}/>
            <Input placeholder={t("register12")} inputType={"text"} value={user.username} field={"username"}
                   setValue={setUser} icon={usernameIcon} info={usernameInfo}/>
            <Input placeholder={t("register13")} inputType={inputType} setInputType={setInputType} value={user.password}
                   field={"password"} setValue={setUser} icon={passwordIcon} info={passwordInfo}/>
            <Input placeholder={t("register14")} inputType={inputType} setInputType={setInputType} value={passwordRep}
                   setValue={setPasswordRep} hasEye={true} whichForm={"register"} termsCheck={termsCheck}
                   setTermsCheck={setTermsCheck} icon={passwordRepIcon} mark={mark}/>
            <SubmitButton label={t("register15")} onClick={handleRegisterUser} disabled={isDisabled}/>
            {isRegistered && <AnimatedBanner
                text={t("animatedBanner9")}
                onAnimationEnd={() => setIsRegistered(false)} delay={5000} color={"bg-lowLime"} z={"z-50"}/>}
            {wentWrong && <AnimatedBanner text={t("animatedBanner1")} onAnimationEnd={() => setWentWrong(false)}
                                          delay={5000} color={"bg-coolYellow"} z={"z-40"}/>}
            {wrongData && <AnimatedBanner text={t("animatedBanner10")} onAnimationEnd={() => setWrongData(false)}
                                          delay={4000} color={"bg-gray-300"} z={"z-40"}/>}
            {loading && <RegisterAndSearchLoading usage="register"/>}
        </div>
    )
}

export default RegisterForm