import React, {useEffect, useState} from "react";
import Input from "../../../../../../../../SharedComponents/FormUtil/Input.tsx";
import ConfirmButton from "./Atomic/ConfirmButton.tsx";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserInfo} from "../../../../../../../../CustomHooks/useUserInfo.ts";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../../../../../../../GlobalProviders/Auth/useAuth.ts";
import {deleteUser} from "../../../../../../../../ApiCalls/Service/UserService.ts";
import {ForbiddenError, InternalServerError} from "../../../../../../../../ApiCalls/Errors/CustomErrors.ts";

interface ConfirmProps {
    googleLogged: boolean;
    label: string;
}

const DeleteConfirm: React.FC<ConfirmProps> = ({googleLogged, label}) => {

    const [password, setPassword] = useState<string>("");
    const [icon, setIcon] = useState<IconProp | null>(null);
    const [info, setInfo] = useState<string>("");
    const {CreateDebouncedValue} = useUtil();
    const debouncedPassword = CreateDebouncedValue(password, 300);
    const {handleCheckOldPassword} = useUserInfo();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {handleLogout} = useAuth();
    const [confirmation, setConfirmation] = useState<string>("");

    useEffect(() => {
        const checkPassword = async () => {
            setInfo("");
            if (password.length < 8 || password.length > 50) {
                setIcon(null);
                return;
            }
            const matches = await handleCheckOldPassword(password);
            setIcon(matches ? faCircleCheck : faCircleExclamation);
        };

        checkPassword();
    }, [debouncedPassword]);

    const deleteAccount = async () => {
        setIsDisabled(true);
        try {
            await deleteUser(password);
            await handleLogout();
            sessionStorage.setItem("isAccountDeleted", "true");
        } catch (error: unknown) {
            if (error instanceof ForbiddenError) {
                setInfo("Wrong password.")
            } else if (error instanceof InternalServerError) {
                console.error("Error deleting account, problem with Google Cloud: ", error);
            } else {
                console.error("Unexpected error: ", error);
            }
        } finally {
            setTimeout(() => setIsDisabled(false), 1000);
        }
    }

    const handleDeleteAccount = async () => {
        if (password.length < 8 || password.length > 50) return;
        await deleteAccount();
    };

    const handleDeleteGoogleAccount = async () => {
        if (confirmation !== "delete_account") return;
        await deleteAccount();
    };

    return (
        <div className="flex flex-col items-center mb-8 m:mb-10">
            <p className="text-center mt-8 m:mt-10">
                {label}</p>
            <div className="flex w-full justify-center mt-5 m:mt-7 mb-2 m:mb-3">
                {!googleLogged ? (
                    <Input placeholder="Password" inputType="password" value={password} setValue={setPassword}
                           icon={icon} info={info}/>
                ) : (
                    <Input placeholder="" inputType="text" value={confirmation} setValue={setConfirmation}/>
                )
                }
            </div>
            <ConfirmButton label="Submit" type="submit" isDisabled={isDisabled}
                           onClick={!googleLogged ? handleDeleteAccount : handleDeleteGoogleAccount}/>
        </div>
    )
}

export default DeleteConfirm