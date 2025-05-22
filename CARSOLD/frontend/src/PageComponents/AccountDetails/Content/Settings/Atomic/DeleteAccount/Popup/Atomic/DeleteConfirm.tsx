import React, {useEffect, useState} from "react";
import Input from "../../../../../../../Authentication/AuthWindow/Atomic/Form/FormUtil/Input.tsx";
import ConfirmButton from "./Atomic/ConfirmButton.tsx";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserInfo} from "../../../../../../../../CustomHooks/useUserInfo.ts";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../../../../../../../GlobalProviders/Auth/useAuth.ts";
import {deleteUser} from "../../../../../../../../ApiCalls/Services/UserService.ts";
import {ForbiddenError, InternalServerError} from "../../../../../../../../ApiCalls/Errors/CustomErrors.ts";
import {useLanguage} from "../../../../../../../../GlobalProviders/Language/useLanguage.ts";

interface ConfirmProps {
    googleLogged: boolean;
    label: string;
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setWentWrong: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteConfirm: React.FC<ConfirmProps> = ({googleLogged, label, setPopup, setWentWrong}) => {
    const [password, setPassword] = useState<string>("");
    const [icon, setIcon] = useState<IconProp | null>(null);
    const [info, setInfo] = useState<string>("");
    const {CreateDebouncedValue} = useUtil();
    const debouncedPassword = CreateDebouncedValue(password, 300);
    const {handleCheckOldPassword} = useUserInfo();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {handleCheckAuth} = useAuth();
    const [confirmation, setConfirmation] = useState<string>("");
    const {t} = useLanguage();

    useEffect(() => {
        const checkPassword = async () => {
            setInfo("");
            if (password.length < 5 || password.length > 50) {
                setIcon(null);
                return;
            }
            const matches = await handleCheckOldPassword(password);
            setIcon(matches ? faCircleCheck : faCircleExclamation);
        };

        checkPassword();
    }, [debouncedPassword]);

    const deleteAccount = async () => {
        if (isDisabled) return;
        setIsDisabled(true);
        try {
            await deleteUser(password);
            await handleCheckAuth();
            sessionStorage.setItem("isAccountDeleted", "true");
        } catch (error: unknown) {
            if (error instanceof ForbiddenError) {
                setInfo(t("deleteAccount7"))
            } else if (error instanceof InternalServerError) {
                setWentWrong(true);
                setPopup(false);
                console.error("Error deleting account, problem with database or Google Cloud: ", error);
            } else {
                setWentWrong(true);
                setPopup(false);
                console.error("Unexpected error: ", error);
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 1000);
        }
    }

    const handleDeleteAccount = async () => {
        if (password.length < 5 || password.length > 50) return;
        await deleteAccount();
    };

    const handleDeleteGoogleAccount = async () => {
        if (confirmation !== "delete_account" && confirmation !== "usuń_konto") {
            setInfo(t("deleteAccount8"));
            return;
        }
        await deleteAccount();
    };

    useEffect(() => {
        setInfo("");
    }, [confirmation]);

    return (
        <div className="flex flex-col items-center mb-8 m:mb-10 px-2">
            <p className="text-center mt-8 m:mt-10">
                {label}
            </p>
            <div className="flex w-full justify-center mt-5 m:mt-7 mb-2 m:mb-3">
                {!googleLogged ? (
                    <Input placeholder={t("deleteAccount9")} inputType="password" value={password} setValue={setPassword} icon={icon} info={info}/>
                ) : (
                    <Input placeholder="" inputType="text" value={confirmation} setValue={setConfirmation} info={info}/>
                )
                }
            </div>
            <ConfirmButton label={t("deleteAccount10")} type="submit" isDisabled={isDisabled}
                           onClick={!googleLogged ? handleDeleteAccount : handleDeleteGoogleAccount}/>
        </div>
    )
}

export default DeleteConfirm