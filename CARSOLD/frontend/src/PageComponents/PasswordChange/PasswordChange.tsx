import React, {useEffect, useState} from "react";
import Input from "../Authentication/AuthWindow/Atomic/Form/Atomic/Input.tsx";
import {faCircleCheck, faCircleExclamation, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {useUserCheck} from "../Authentication/CustomHooks/UseUserCheck.ts";
import {useAuth} from "../../GlobalProviders/AuthProvider.tsx";
import {api} from "../../Config/AxiosConfig/AxiosConfig.tsx";
import SubmitButton from "../Authentication/AuthWindow/Atomic/Form/Atomic/SubmitButton.tsx";
import AnimatedBanner from "../../Additional/Banners/AnimatedBanner.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import {useNavigate} from "react-router-dom";

const PasswordChange: React.FC = () => {

    const [password, setPassword] = useState<string>("");
    const [passwordRep, setPasswordRep] = useState<string>("");

    const [passwordIcon, setPasswordIcon] = useState<IconDefinition | null>(null);
    const [passwordInfo, setPasswordInfo] = useState<string>("");
    const [passwordActive, setPasswordActive] = useState<boolean>(false);
    const [passwordRepIcon, setPasswordRepIcon] = useState<IconDefinition | null>(null);

    const {checksPassword} = useUserCheck();
    const {checkAuth} = useAuth();
    const navigate = useNavigate();

    //displays info
    useEffect(() => {
        if (password !== "") {
            if (password.length >= 7) {
                if (password.length <= 25) {
                    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
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
    }, [password])   //checks if password is strong enough

    useEffect(() => {
        if (password !== "" && passwordRep !== "") {
            if (checksPassword(password)) {
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
    }, [passwordRep, password])   //checks if repeated password equals password

    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [isChanged, setIsChanged] = useState<boolean>(false);   //banners
    const [wentWrong, setWentWrong] = useState<boolean>(false);

    const handlePasswordChange = async () => {
        if (isDisabled) return;
        if (password && passwordRep) {
            if (checksPassword(password) && password === passwordRep) {
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
                        setIsChanged(true);
                        setTimeout(async () => {
                            await checkAuth();
                        }, 2500)
                    } else {
                        setWentWrong(true);
                        setTimeout(async () => {
                            navigate("/authenticate/login");
                        }, 2500)
                    }
                } catch (error) {
                    console.error("Error changing password: ", error);
                } finally {
                    setTimeout(() => {
                        setIsDisabled(false);
                    }, 2500)
                }
            }
        }
    }

    const [inputType, setInputType] = useState<"password" | "text">("password")

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center w-10/12 min-w-[310px] xs:min-w-[450px] xs:max-w-[500px] lg:max-w-[530px]
                xl:max-w-[570px] 2xl:max-w-[640px] 3xl:max-w-[720px] mt-20 xs:mt-24 sm:mt-12 lg:mt-14 xl:mt-16 2xl:mt-[72px] 3xl:mt-20
                pt-5 xs:pt-7 sm:pt-8 lg:pt-9 xl:pt-10 2xl:pt-11 3xl:pt-12 pb-10 xs:pb-11 sm:pb-12 lg:pb-14 xl:pb-16 2xl:pb-[70px] 3xl-pb-[80px]
                gap-6 xs:gap-7 2xl:gap-8 3xl:gap-9 text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl bg-lime rounded-sm">
                    <p className="text-center text-xs xs:text-base 2xl:text-xl 3xl:text-2xl w-10/12">
                        Now you can change your password.
                    </p>
                    <Input placeholder={"New password"} inputType={inputType} setInputType={setInputType}
                           value={password} setValue={setPassword} icon={passwordIcon} info={passwordInfo} isActive={passwordActive}/>
                    <Input placeholder={"Repeat password"} inputType={inputType} setInputType={setInputType}
                           value={passwordRep} setValue={setPasswordRep} icon={passwordRepIcon} hasEye={true} whichForm={"none"}/>
                    <SubmitButton label={"Change"} disabled={isDisabled} onClick={handlePasswordChange}/>
                    {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}/> : null}
                    {wentWrong? <AnimatedBanner text={"Password change failed"} color={"bg-coolRed"} z={"z-50"}/>: null}
                </div>
            </div>
        </LayOut>
    )
}

export default PasswordChange