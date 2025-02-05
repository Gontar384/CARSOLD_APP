import React, {useEffect, useState} from "react";
import Input from "../FormUtil/Input.tsx";
import SubmitButton from "../FormUtil/SubmitButton.tsx";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useUserCheck} from "../../CustomHooks/useUserCheck.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {changePassword, changePasswordRecovery} from "../../ApiCalls/Service/UserService.ts";

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
    const [heldValue, setHeldValue] = useState<string>("");   //holds previous 'oldPassword' value, prevents display bug
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [inputType, setInputType] = useState<"password" | "text">("password")
    const navigate = useNavigate();
    const {checkPassword, checkOldPassword} = useUserCheck();
    const {handleCheckAuth, isAuthenticated} = useAuth();

    useEffect(() => {
        let isMounted = true;

        if (oldPassword === "") {
            setOldPasswordIcon(null);
            return;
        }
        if (oldPassword.length < 7 || oldPassword.length > 25) {
            setOldPasswordIcon(faCircleExclamation);
            return;
        }

        const validatePassword = async () => {
            try {
                const response = await checkOldPassword(oldPassword);
                if (isMounted) {
                    if (response.data.checks) {
                        setOldPasswordIcon(faCircleCheck);
                        setHeldValue(oldPassword);
                    } else {
                        setOldPasswordIcon(faCircleExclamation);
                    }
                }
            } catch (error) {
                console.error("Error checking old password: ", error);
            }
        };

        validatePassword();

        return () => {
            isMounted = false;
        };
    }, [debouncedOldPassword]);  //for auth user, compares provided password with oldPassword

    useEffect(() => {
        //reset when conditions are not met
        if (password === "") {
            setPasswordIcon(null);
            setPasswordInfo("");
            setPasswordActive(false);
            setPasswordRepIcon(null);
            return;
        }
        if (password.length < 7) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo("Password is too short.");
            setPasswordActive(true);
            setPasswordRepIcon(null);
            return;
        }
        if (password.length > 25) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo("Password is too long.");
            setPasswordActive(true);
            setPasswordRepIcon(null);
            return;
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            setPasswordIcon(faCircleExclamation);
            setPasswordInfo("Must include lowercase, uppercase, and number.");
            setPasswordActive(true);
            setPasswordRepIcon(null);
            return;
        }
        //for auth user
        if (loggedIn) {
            if (oldPassword === "" || oldPasswordIcon !== faCircleCheck || oldPassword !== heldValue) {
                setPasswordIcon(null);
                setPasswordInfo("");
                setPasswordActive(false);
                setPasswordRepIcon(null);
                return;
            }
            if (password === oldPassword) {
                setPasswordIcon(faCircleExclamation);
                setPasswordInfo("New password cannot be the same!");
                setPasswordActive(true);
                setPasswordRepIcon(null);
                return;
            }
        }

        setPasswordIcon(faCircleCheck);
        setPasswordInfo("");
        setPasswordActive(false);

        //checks repeated password validity
        if (passwordRep === "") {
            setPasswordRepIcon(null);
        } else if (passwordRep !== password) {
            setPasswordRepIcon(faCircleExclamation);
        } else {
            setPasswordRepIcon(faCircleCheck);
        }

    }, [loggedIn, oldPassword, oldPasswordIcon, heldValue, password, passwordRep]);

    const handleRecoveryPasswordChange = async () => {
        if (isDisabled || !password || !passwordRep) return;
        if (!checkPassword(password)) return;
        if (password !== passwordRep) return;

        const token = new URLSearchParams(window.location.search).get('token');
        if (!token) return;

        setIsDisabled(true);

        try {
            await changePasswordRecovery(token, password);
            setIsChanged?.(true);
            setPassword("");
            setPasswordRep("");
            setTimeout(async () => await handleCheckAuth(), 2500);
        } catch (error) {
            setWentWrong?.(true);
            setTimeout(() => navigate("/authenticate/login"), 2500);
            console.error("Error during recovery password change: ", error);
        } finally {
            setIsDisabled(false);
        }
    };   //changes password - recovery

    const handlePasswordChange = async () => {
        if (isDisabled || !oldPassword || !password || !passwordRep) return;
        if (!checkPassword(password)) return;
        if (password === oldPassword) return;
        if (password !== passwordRep) return;

        try {
            const oldPasswordResponse = await checkOldPassword(oldPassword);
            if (!oldPasswordResponse.data.checks) return;
            setIsDisabled(true);

            try {
                await changePassword(password);
                setIsChanged?.(true);
                setOldPassword("");
                setPassword("");
                setPasswordRep("");
                setOldPasswordIcon(null);
            } catch (error) {
                console.error("Error during password change: ", error);
            }

        } catch (error) {
            console.error("Error changing password: ", error);
        } finally {
            setIsDisabled(false);
        }
    };   //changes password - auth user

    return (
        <div className={`flex flex-col items-center w-full`}>
            {loggedIn && <Input placeholder={"Old password"} inputType={inputType} setInputType={setInputType}
                                value={oldPassword} setValue={setOldPassword} icon={oldPasswordIcon}/>}
            <Input placeholder={"New password"} inputType={inputType} setInputType={setInputType} value={password}
                   setValue={setPassword} icon={passwordIcon} info={passwordInfo} isActive={passwordActive}/>
            <Input placeholder={"Repeat password"} inputType={inputType} setInputType={setInputType} value={passwordRep}
                   setValue={setPasswordRep} icon={passwordRepIcon} hasEye={true} whichForm={"none"}/>
            <SubmitButton label={"Change"} disabled={isDisabled}
                          onClick={isAuthenticated ? handlePasswordChange : handleRecoveryPasswordChange}/>
        </div>
    )
}

export default PasswordChangeForm