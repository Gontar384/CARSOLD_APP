import React, {useEffect, useState} from "react";
import Input from "../../Authentication/AuthWindow/Atomic/Form/FormUtil/Input.tsx";
import SubmitButton from "../../Authentication/AuthWindow/Atomic/Form/FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useUserInfo} from "../../../CustomHooks/useUserInfo.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../../GlobalProviders/Auth/useAuth.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";
import {changePassword, changePasswordRecovery} from "../../../ApiCalls/Services/UserService.ts";
import {BadRequestError, ForbiddenError} from "../../../ApiCalls/Errors/CustomErrors.ts";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";

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
    const [passwordRepIcon, setPasswordRepIcon] = useState<IconProp | null>(null);
    const [oldPasswordIcon, setOldPasswordIcon] = useState<IconProp | null>(null);
    const [oldPasswordInfo, setOldPasswordInfo] = useState<string>("");
    const [heldValue, setHeldValue] = useState<string>("");   //holds previous 'oldPassword' value, prevents display bug
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [inputType, setInputType] = useState<"password" | "text">("password")
    const navigate = useNavigate();
    const {handleCheckPassword, handleCheckOldPassword} = useUserInfo();
    const {handleCheckAuth, isAuthenticated} = useAuth();
    const {t, language} = useLanguage();

    useEffect(() => {
        setPasswordInfo("");
        setOldPasswordInfo("");
    }, [language]); //resets info when changing language

    useEffect(() => {
        setOldPasswordInfo("");
        if (oldPassword === "") {
            setOldPasswordIcon(null);
            return;
        }
        if (oldPassword.length < 8 || oldPassword.length > 50) {
            setOldPasswordIcon(faCircleExclamation);
            return;
        }

        const checkOldPasswordMatch = async () => {
            const matches = await handleCheckOldPassword(oldPassword);
            if (matches) {
                setOldPasswordIcon(faCircleCheck);
                setHeldValue(oldPassword);
            } else {
                setOldPasswordIcon(faCircleExclamation);
            }
        };

        checkOldPasswordMatch();

    }, [debouncedOldPassword]);  //for auth user, compares provided password with oldPassword

    useEffect(() => {
        //for auth user
        if (loggedIn) {
            if (oldPassword === "" || oldPassword !== heldValue || oldPasswordIcon !== faCircleCheck) {
                setPasswordIcon(null);
                setPasswordInfo("");
                setPasswordRepIcon(null);
                return;
            }
            if (password === oldPassword) {
                setPasswordIcon(faCircleExclamation);
                setPasswordInfo(t("changePassword6"));
                setPasswordRepIcon(null);
                return;
            }
        }

        if (password === "") {
            setPasswordIcon(null);
            setPasswordInfo("");
            setPasswordRepIcon(null);
            return;
        }
        if (password.length < 8) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo(t("changePassword7"));
            setPasswordRepIcon(null);
            return;
        }
        if (password.length > 50) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo(t("changePassword8"));
            setPasswordRepIcon(null);
            return;
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo(t("changePassword9"));
            setPasswordRepIcon(null);
            return;
        }

        setPasswordIcon(faCircleCheck);
        setPasswordInfo("");

        if (passwordRep === "") {
            setPasswordRepIcon(null);
        } else if (passwordRep !== password) {
            setPasswordRepIcon(faCircleExclamation);
        } else {
            setPasswordRepIcon(faCircleCheck);
        }
    }, [heldValue, loggedIn, oldPassword, oldPasswordIcon, password, passwordRep]);

    const handleRecoveryPasswordChange = async () => {
        if (isDisabled || !(password.length > 7) || !(passwordRep.length > 7)) return;
        if (!handleCheckPassword(password)) return;
        if (password !== passwordRep) return;

        const token = new URLSearchParams(window.location.search).get('token');

        setIsDisabled(true);
        try {
            await changePasswordRecovery(token, password);
            setIsChanged?.(true);
            setPassword("");
            setPasswordRep("");
            setTimeout(async () => await handleCheckAuth(), 2500);
        } catch (error: unknown) {
            setWentWrong?.(true);
            setTimeout(() => navigate("/authenticate/login"), 2500);
            if (error instanceof BadRequestError) {
                console.error("Token is invalid or has expired", error);
            } else {
                console.error("Unexpected error during password recovery change: ", error);
            }
        } finally {
            setIsDisabled(false);
        }
    };   //changes password - recovery

    const handlePasswordChange = async () => {
        if (isDisabled || !(oldPassword.length > 7) || !(password.length > 7) || !(passwordRep.length > 7)) return;
        if (!handleCheckPassword(password)) return;
        if (password === oldPassword) return;
        if (password !== passwordRep) return;

        setIsDisabled(true);
        try {
            await changePassword(oldPassword, password);
            setIsChanged?.(true);
            setOldPassword("");
            setPassword("");
            setPasswordRep("");
            setOldPasswordIcon(null);
        } catch (error: unknown) {
            if (error instanceof ForbiddenError) {
                setOldPasswordInfo(t("changePassword10"));
            } else {
                console.error("Unexpected error during password change: ", error);
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 1000);
        }
    };   //changes password - auth user

    return (
        <div className={`flex flex-col items-center w-full`}>
            {loggedIn && <Input placeholder={t("changePassword2")} inputType={inputType} setInputType={setInputType}
                                value={oldPassword} setValue={setOldPassword} icon={oldPasswordIcon} info={oldPasswordInfo}/>}
            <Input placeholder={t("changePassword3")} inputType={inputType} setInputType={setInputType} value={password}
                   setValue={setPassword} icon={passwordIcon} info={passwordInfo}/>
            <Input placeholder={t("changePassword4")} inputType={inputType} setInputType={setInputType} value={passwordRep}
                   setValue={setPasswordRep} icon={passwordRepIcon} hasEye={true} whichForm={"none"}/>
            <SubmitButton label={t("changePassword5")} disabled={isDisabled}
                          onClick={isAuthenticated ? handlePasswordChange : handleRecoveryPasswordChange}/>
        </div>
    )
}

export default PasswordChangeForm