import React, {useEffect, useState} from "react";
import Input from "../../../../../SharedComponents/FormUtil/Input.tsx";
import SubmitButton from "../../../../../SharedComponents/FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {api} from "../../../../../Config/AxiosConfig/AxiosConfig.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
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
    const {CreateDebouncedValue} = useUtil();
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
    const {emailExists, usernameExists, isActive, checkPassword} = useUserCheck();
    const [termsCheck, setTermsCheck] = useState<boolean>(false);   //manages terms of use
    const [mark, setMark] = useState<boolean>(false);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button
    const [isRegistered, setIsRegistered] = useState<boolean>(false);   //displays banner
    const [wentWrong, setWentWrong] = useState<boolean>(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };  //checks correct email format

    useEffect(() => {
        let isMounted = true;

        if (user.email.length < 5) {
            setEmailIcon(null);
            setEmailInfo("");
            setEmailActive(false);
            return;
        }
        if (user.email.length > 30) {
            setEmailIcon(faCircleExclamation);
            setEmailInfo("Email is too long.");
            setEmailActive(true);
            return;
        }
        if (!validateEmail(user.email)) {
            setEmailIcon(faCircleExclamation);
            setEmailInfo("It doesn't look like an email...");
            setEmailActive(true);
            return;
        }

        const checkEmail = async () => {
            try {
                const [response, isActiveResponse] = await Promise.all([
                    emailExists(user.email),
                    isActive(user.email)
                ]);
                if (!isMounted) return;
                if (response.data.exists && isActiveResponse.data.checks) {
                    setEmailIcon(faCircleExclamation);
                    setEmailInfo("Email is already taken.");
                    setEmailActive(true);
                } else {
                    setEmailIcon(faCircleCheck);
                    setEmailInfo("");
                    setEmailActive(false);
                }
            } catch (error) {
                console.error("Error checking email: ", error);
                if (isMounted) {
                    setEmailIcon(faCircleExclamation);
                    setEmailInfo("Error with email.");
                    setEmailActive(true);
                }
            }
        };

        checkEmail();

        return () => {
            isMounted = false;
        };
    }, [debouncedEmail]);  //checks if email is valid

    useEffect(() => {
        let isMounted = true;

        if (user.username === "") {
            setUsernameIcon(null);
            setUsernameInfo("");
            setUsernameActive(false);
            return;
        }
        if (!/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(user.username)) {
            setUsernameIcon(faCircleExclamation);
            setUsernameInfo("Username has not allowed characters.");
            setUsernameActive(true);
            return;
        }
        if (user.username.length < 3) {
            setUsernameIcon(faCircleExclamation);
            setUsernameInfo("Username is too short.");
            setUsernameActive(true);
            return;
        }
        if (user.username.length > 15) {
            setUsernameIcon(faCircleExclamation);
            setUsernameInfo("Username is too long.");
            setUsernameActive(true);
            return;
        }

        const checkUsername = async () => {
            try {
                const [response, isActiveResponse] = await Promise.all([
                    usernameExists(user.username),
                    isActive(user.username)
                ]);
                if (!isMounted) return;
                if (response.data.exists && isActiveResponse.data.checks) {
                    setUsernameIcon(faCircleExclamation);
                    setUsernameInfo("Username already exists.");
                    setUsernameActive(true);
                } else {
                    setUsernameIcon(faCircleCheck);
                    setUsernameInfo("");
                    setUsernameActive(false);
                }
            } catch (error) {
                console.error("Error checking username: ", error);
                if (isMounted) {
                    setUsernameIcon(faCircleExclamation);
                    setUsernameInfo("Error with username.");
                    setUsernameActive(true);
                }
            }
        };

        checkUsername();

        return () => {
            isMounted = false;
        };
    }, [debouncedUsername]); //checks if username is valid

    useEffect(() => {
        if (user.password == "") {
            setPasswordIcon(null);
            setPasswordInfo("");
            setPasswordActive(false);
            return;
        }
        if (user.password.length < 7) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo("Password is too short.");
            setPasswordActive(true);
            return;
        }
        if (user.password.length > 25) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo("Password is too long.");
            setPasswordActive(true);
            return;
        }
        if (/[A-Z]/.test(user.password) && /[a-z]/.test(user.password) && /\d/.test(user.password)) {
            setPasswordIcon(faCircleCheck);
            setPasswordInfo("");
            setPasswordActive(false);
        } else {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo("Must include lowercase, uppercase and number.");
            setPasswordActive(true);
        }
    }, [user.password]);  //checks if password is strong enough

    useEffect(() => {
        if (user.password == "" || passwordRep == "") {
            setPasswordRepIcon(null);
            return;
        }
        if (!checkPassword(user.password)) {
            setPasswordRepIcon(null);
            return;
        }

        if (passwordRep === user.password) setPasswordRepIcon(faCircleCheck);
        else setPasswordRepIcon(faCircleExclamation);

    }, [checkPassword, passwordRep, user.password]);   //checks if repeated password equals password

    useEffect(() => {
        if (termsCheck) setMark(false);
    }, [termsCheck]);   //checks checkbox mark

    const handleRegister = async () => {
        if (isDisabled) return;
        if (!user.email || !user.username || !user.password || !passwordRep) return;
        setIsDisabled(true);

        try {
            if (user.email.length > 30 || !validateEmail(user.email)) {
                return;
            }
            if (user.username.length < 3 || user.username.length > 15 || !/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(user.username)) {
                return;
            }
            if (!checkPassword(user.password) || user.password !== passwordRep) {
                return;
            }
            const emailResponse = await emailExists(user.email);
            const isActiveResponse = await isActive(user.email);
            if (emailResponse.data.exists && isActiveResponse.data.checks) {
                return;
            }

            const usernameResponse = await usernameExists(user.username);
            if (usernameResponse.data.exists && isActiveResponse.data.checks) {
                return;
            }

            if (!termsCheck) {
                setMark(true);
                return;
            } else {
                setMark(false);
            }

            const gateResponse = await api.get('api/auth/register/is-username-safe', {
                params: { username: user.username },
            });

            if (!gateResponse.data.isSafe) {
                setUsernameIcon(faCircleExclamation);
                setUsernameInfo("Username is inappropriate!");
                setUsernameActive(true);
                return;
            }

            const response = await api.post('api/auth/register', user);
            if (response.data) {
                setIsRegistered(true);
                setUser({
                    email: '',
                    username: '',
                    password: '',
                });
                setPasswordRep('');
                setTermsCheck(false);
                setEmailIcon(null);
                setUsernameIcon(null);
            } else {
                setWentWrong(true);
            }
        } catch (error) {
            console.log("Error during register:", error);
            setWentWrong(true);
        } finally {
            setTimeout(() => setIsDisabled(false), 2000);
        }
    };

    return (
        <div className="flex flex-col items-center w-11/12 py-8 mt-3 rounded-sm shadow-2xl">
            <Input placeholder={"E-mail"} inputType={"text"} value={user.email} field={"email"} setValue={setUser}
                   icon={emailIcon} info={emailInfo} isActive={emailActive}/>
            <Input placeholder={"Username"} inputType={"text"} value={user.username} field={"username"}
                   setValue={setUser} icon={usernameIcon} info={usernameInfo} isActive={usernameActive}/>
            <Input placeholder={"Password"} inputType={inputType} setInputType={setInputType} value={user.password}
                   field={"password"} setValue={setUser} icon={passwordIcon} info={passwordInfo}
                   isActive={passwordActive}/>
            <Input placeholder={"Repeat password"} inputType={inputType} setInputType={setInputType} value={passwordRep}
                   setValue={setPasswordRep} hasEye={true} whichForm={"register"} termsCheck={termsCheck}
                   setTermsCheck={setTermsCheck} icon={passwordRepIcon} mark={mark}/>
            <SubmitButton label={"Register"} onClick={handleRegister} disabled={isDisabled}/>
            {isRegistered && <AnimatedBanner
                text={"Registered successfully! We've sent you e-mail with confirmation link. Check it out!"}
                onAnimationEnd={() => setIsRegistered(false)} delay={5000} color={"bg-lowLime"} z={"z-50"}/>}
            {wentWrong && <AnimatedBanner text={"Something went wrong..."} onAnimationEnd={() => setWentWrong(false)}
                                          delay={4000} color={"bg-coolYellow"} z={"z-40"}/>}
        </div>
    )
}

export default RegisterForm