import React, {useEffect, useState} from "react";
import Input from "../../../../../../../../SharedComponents/FormUtil/Input.tsx";
import ConfirmButton from "./Atomic/ConfirmButton.tsx";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserCheck} from "../../../../../../../../CustomHooks/useUserCheck.ts";
import {AxiosResponse} from "axios";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {useAuth} from "../../../../../../../../GlobalProviders/Auth/useAuth.ts";
import {deleteUser} from "../../../../../../../../ApiCalls/Service/UserService.ts";
import {BadRequestError} from "../../../../../../../../ApiCalls/Errors/CustomErrors.ts";

interface ConfirmProps {
    googleLogged: boolean;
    label: string;
}

const DeleteConfirm: React.FC<ConfirmProps> = ({googleLogged, label}) => {

    const [password, setPassword] = useState<string>("");
    const [icon, setIcon] = useState<IconProp | null>(null);
    const {CreateDebouncedValue} = useUtil();
    const debouncedPassword = CreateDebouncedValue(password, 300);
    const {checkOldPassword} = useUserCheck();
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {handleLogout} = useAuth();
    const [confirmation, setConfirmation] = useState<string>("");

    useEffect(() => {
        const checkPassword = async () => {
            if (password.length < 7 || password.length > 25) {
                setIcon(null);
                return;
            }

            try {
                const response: AxiosResponse = await checkOldPassword(password);
                setIcon(response.data.checks ? faCircleCheck : faCircleExclamation);
            } catch (error) {
                console.error("Error checking password: ", error);
            }
        };

        checkPassword();
    }, [debouncedPassword]);

    const handleDeleteAccount = async () => {
        if (password.length < 7 || password.length > 25) return;
        setIsDisabled(true);

        try {
            const passwordResponse: AxiosResponse = await checkOldPassword(password);
            if (passwordResponse.data.checks) {

                try {
                    await deleteUser();
                    await handleLogout();
                    sessionStorage.setItem("isAccountDeleted", "true");
                } catch (error: unknown) {
                    if (error instanceof BadRequestError) {
                        console.error("Error deleting account, problem with Google Cloud: ", error);
                    } else {
                        console.error("Unexpected error: ", error);
                    }
                }

            }
        } catch (error) {
            console.error("Error deleting account: ", error);
        } finally {
            setIsDisabled(false);
        }
    };

    const handleDeleteGoogleAccount = async () => {
        if (confirmation !== "delete_account") return;
        setIsDisabled(true);

        try {
            await deleteUser();
            await handleLogout();
            sessionStorage.setItem("isAccountDeleted", "true");
        } catch (error: unknown) {
            if (error instanceof BadRequestError) {
                console.error("Error deleting account, problem with Google Cloud: ", error);
            } else {
                console.error("Unexpected error: ", error);
            }
        } finally {
            setIsDisabled(false);
        }
    };

    return (
        <div className="flex flex-col items-center mb-8 m:mb-10">
            <p className="text-center mt-8 m:mt-10">
                {label}</p>
            <div className="flex w-full justify-center mt-5 m:mt-7 mb-2 m:mb-3">
                {!googleLogged ? (
                    <Input placeholder="Password" inputType="password" value={password} setValue={setPassword}
                           icon={icon}/>
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