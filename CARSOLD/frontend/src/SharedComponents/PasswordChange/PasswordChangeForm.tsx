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
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({setIsChanged, setWentWrong, loggedIn}) => {

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

    const {checkPassword, checkOldPassword} = useUserCheck();
    const {checkAuth, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    //displays info
    useEffect(() => {
        if (oldPasswordIcon !== faCircleExclamation) {
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
        }
    }, [oldPassword, oldPasswordIcon, password])   //checks if password is strong enough

    useEffect(() => {
        if (oldPasswordIcon !== faCircleExclamation) {
            if (password !== "" && passwordRep !== "") {
                if (checkPassword(password)) {
                    if (passwordRep === password && password !== oldPassword) {
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
    }, [debouncedOldPassword]);    //performs only when user is authenticated (when oldPassword input is present)


    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const handleRecoveryPasswordChange = async () => {
        if (isDisabled) return;
        if (password && passwordRep) {
            if (checkPassword(password) && password === passwordRep) {
                const urlParams = new URLSearchParams(window.location.search);
                const token: string | null = urlParams.get('token');
                if (!token) return;
                setIsDisabled(true);
                try {
                    const response = await api.post('api/auth/password-recovery-change', {
                        token: token,
                        password: password,
                    });
                    if (response.data === "success") {
                        setIsChanged?.(true);
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
                    const response: AxiosResponse = await api.post("api/auth/password-change", {
                        password: password
                    });
                    if (response.data === "success") {
                        setIsChanged?.(true);
                    }
                    setOldPassword("");
                    setPassword("");
                    setPasswordRep("");
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

    const [inputType, setInputType] = useState<"password" | "text">("password")

    return (
        <div className="flex flex-col items-center w-full h-full gap-6 xs:gap-7 2xl:gap-8 3xl:gap-9">
            {loggedIn && <Input placeholder={"Old password"} inputType={inputType} setInputType={setInputType}
                                value={oldPassword} setValue={setOldPassword} icon={oldPasswordIcon}/>}
            <Input placeholder={"New password"} inputType={inputType} setInputType={setInputType}
                   value={password} setValue={setPassword} icon={passwordIcon} info={passwordInfo}
                   isActive={passwordActive}/>
            <Input placeholder={"Repeat password"} inputType={inputType} setInputType={setInputType}
                   value={passwordRep} setValue={setPasswordRep} icon={passwordRepIcon} hasEye={true}
                   whichForm={"none"}/>
            <SubmitButton label={"Change"} disabled={isDisabled}
                          onClick={isAuthenticated ? handlePasswordChange : handleRecoveryPasswordChange}/>
        </div>
    )
}

export default PasswordChangeForm