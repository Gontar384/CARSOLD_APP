import React, {useEffect, useState} from "react";
import Input from "../FormUtil/Input.tsx";
import SubmitButton from "../FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useUserCheck} from "../../CustomHooks/useUserCheck.ts";
import {useNavigate} from "react-router-dom";
import {api} from "../../Config/AxiosConfig/AxiosConfig.ts";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {AxiosResponse} from "axios";

interface PasswordChangeFormProps {
    setIsChanged?: React.Dispatch<React.SetStateAction<boolean>>;
    setWentWrong?: React.Dispatch<React.SetStateAction<boolean>>;
    loggedIn: boolean;
    scaled?: boolean;
    isShrink?: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({setIsChanged, setWentWrong, loggedIn, scaled, isShrink}) => {

    const [password, setPassword] = useState<string>("");
    const [passwordRep, setPasswordRep] = useState<string>("");
    const [oldPassword, setOldPassword] = useState<string>("");
    const {CreateDebouncedValue} = useUtil();
    const debouncedOldPassword: string = CreateDebouncedValue(oldPassword, 300);

    const [passwordIcon, setPasswordIcon] = useState<IconProp | null>(null);
    const [passwordInfo, setPasswordInfo] = useState<string>("");
    const [passwordActive, setPasswordActive] = useState<boolean>(false);
    const [passwordRepIcon, setPasswordRepIcon] = useState<IconProp | null>(null);
    const [oldPasswordIcon, setOldPasswordIcon] = useState<IconProp | null>(null);
    const [heldValue, setHeldValue] = useState<string>("");   //holds previous 'oldPassword' value, prevents display bug

    const {checkPassword, checkOldPassword} = useUserCheck();
    const {checkAuth, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [inputType, setInputType] = useState<"password" | "text">("password")

    useEffect(() => {
        let isMounted = true;

        if (oldPassword !== "") {
            if (oldPassword.length >= 7 && oldPassword.length <= 25) {
                const validatePassword = async () => {
                    try {
                        const response: AxiosResponse = await checkOldPassword(oldPassword);
                        if (isMounted) {
                            if (response.data.checks) {
                                setOldPasswordIcon(faCircleCheck);
                                setHeldValue(oldPassword);
                            } else {
                                setOldPasswordIcon(faCircleExclamation);
                            }
                        }
                    } catch (error) {
                        console.error("Error checking old password: ", error)
                    }
                }
                validatePassword().then();

                return () => {
                    isMounted = false;
                };
            } else {
                setOldPasswordIcon(faCircleExclamation);
            }
        } else {
            setOldPasswordIcon(null);
        }
    }, [debouncedOldPassword]);    //performs only when user is authenticated and oldPassword input is present

    useEffect(() => {
        if (loggedIn && oldPassword !== "" && oldPasswordIcon === faCircleCheck && oldPassword === heldValue || !loggedIn) {
            if (password !== "") {
                if (password.length >= 7) {
                    if (password.length <= 25) {
                        if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
                            if (password !== oldPassword) {
                                setPasswordIcon(faCircleCheck);
                                setPasswordInfo("");
                                setPasswordActive(false);
                            } else {
                                setPasswordIcon(faCircleExclamation);
                                setPasswordInfo("New password cannot be the same!");
                                setPasswordActive(true);
                            }
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
        } else {
            setPasswordIcon(null);
            setPasswordInfo("");
            setPasswordActive(false);
        }
    }, [oldPassword, oldPasswordIcon, password])   //checks if password is strong enough

    useEffect(() => {
        if (loggedIn && oldPassword !== "" && oldPasswordIcon === faCircleCheck && oldPassword === heldValue || !loggedIn) {
            if (password !== "" && passwordRep !== "") {
                if (checkPassword(password) && password !== oldPassword) {
                    if (passwordRep === password) {
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
        } else {
            setPasswordRepIcon(null);
        }
    }, [passwordRep, password, checkPassword, oldPasswordIcon, oldPassword])   //checks if repeated password equals password

    const handleRecoveryPasswordChange = async () => {
        if (isDisabled) return;
        if (password && passwordRep) {
            if (checkPassword(password) && password === passwordRep) {
                const urlParams = new URLSearchParams(window.location.search);
                const token: string | null = urlParams.get('token');
                if (!token) return;
                setIsDisabled(true);
                try {
                    const response = await api.put('api/auth/password-recovery-change', {
                        token: token,
                        password: password,
                    });
                    if (response.data === "success") {
                        setIsChanged?.(true);
                        setPassword("");
                        setPasswordRep("");
                        setTimeout(async () => {
                            await checkAuth();
                        }, 2500)
                    } else {
                        setWentWrong?.(true);
                        setTimeout(async () => {
                            navigate("/authenticate/login");
                        }, 2500)
                    }
                } catch (error) {
                    console.error("Error recovery changing password: ", error);
                } finally {
                    setTimeout(() => {
                        setIsDisabled(false);
                    }, 2500)
                }
            }
        }
    }   //changes password during recover

    const handlePasswordChange = async () => {
        if (isDisabled) return;
        if (oldPassword && password && passwordRep) {
            if (checkPassword(password) && password === passwordRep && password !== oldPassword) {
                try {
                    const oldPasswordResponse: AxiosResponse = await checkOldPassword(oldPassword);
                    if (!oldPasswordResponse.data.checks) {
                        return;
                    }
                    setIsDisabled(true);
                    const response: AxiosResponse = await api.put("api/auth/password-change", {
                        password: password
                    });
                    if (response.data === "success") {
                        setIsChanged?.(true);
                        setOldPassword("");
                        setPassword("");
                        setPasswordRep("");
                        setOldPasswordIcon(null);
                    }
                } catch (error) {
                    console.error("Error changing password: ", error)
                } finally {
                    setTimeout(() => {
                        setIsDisabled(false);
                    }, 5000)
                }
            }
        }
    }   //changes when user is authenticated

    return (
        <div className={`flex flex-col items-center w-full h-full gap-6 xs:gap-7 2xl:gap-8 3xl:gap-9 
        ${scaled ? "scale-[99%] xs:scale-[80%] sm:scale-[70%] lg:scale-[76%] xl:scale-[83%] 2xl:scale-[85%] 3xl:scale-[77%]" : ""}
        text-base xs:text-xl lg:text-[22px] 2xl:text-2xl 3xl:text-3xl`}>
            {loggedIn && <Input placeholder={"Old password"} inputType={inputType} setInputType={setInputType}
                                value={oldPassword} setValue={setOldPassword} icon={oldPasswordIcon} isShrink={isShrink}/>}
            <Input placeholder={"New password"} inputType={inputType} setInputType={setInputType}
                   value={password} setValue={setPassword} icon={passwordIcon} info={passwordInfo}
                   isActive={passwordActive} isShrink={isShrink}/>
            <Input placeholder={"Repeat password"} inputType={inputType} setInputType={setInputType}
                   value={passwordRep} setValue={setPasswordRep} icon={passwordRepIcon} hasEye={true}
                   whichForm={"none"} isShrink={isShrink}/>
            <SubmitButton label={"Change"} disabled={isDisabled}
                          onClick={isAuthenticated ? handlePasswordChange : handleRecoveryPasswordChange}/>
        </div>
    )
}

export default PasswordChangeForm