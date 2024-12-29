import React, {useEffect, useState} from "react";
import Input from "../../../../../../../../SharedComponents/FormUtil/Input.tsx";
import ConfirmButton from "./Atomic/ConfirmButton.tsx";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserCheck} from "../../../../../../../../CustomHooks/useUserCheck.ts";
import {AxiosResponse} from "axios";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {api} from "../../../../../../../../Config/AxiosConfig/AxiosConfig.ts";
import {useUserDetails} from "../../../../../../../../CustomHooks/useUserDetails.ts";

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

    useEffect(() => {
        const checkPassword = async () => {
            if (password.length >= 7 && password.length <= 25) {
                try {
                    const response: AxiosResponse = await checkOldPassword(password);
                    if (response.data.checks) {
                        setIcon(faCircleCheck);
                    } else {
                        setIcon(faCircleExclamation);
                    }
                } catch (error) {
                    console.error("Error checking password: ", error);
                }
            } else {
                setIcon(null);
            }
        }
        checkPassword().then();
    }, [debouncedPassword])

    const {logout} = useUserDetails();

    const handleDeleteAccount = async () => {
        if (password.length >= 7 && password.length <= 25) {
            setIsDisabled(true);
            try {
                const passwordResponse: AxiosResponse = await checkOldPassword(password);
                if (passwordResponse.data.checks) {
                    const response: AxiosResponse = await api.delete('api/delete-user');
                    if (response.data) {
                        await logout();
                        sessionStorage.setItem("isAccountDeleted", "true");
                    }
                }
            } catch (error) {
                console.error("Error deleting account: ", error);
            } finally {
                setTimeout(() => {
                    setIsDisabled(false);
                }, 2000)
            }
        }
    }

    const [confirmation, setConfirmation] = useState<string>("");

    const handleDeleteGoogleAccount = async () => {
        if (confirmation === "delete_account") {
            setIsDisabled(true);
            try {
                const response: AxiosResponse = await api.delete('api/delete-user');
                if (response.data) {
                    await logout();
                    sessionStorage.setItem("isAccountDeleted", "true");
                }
            } catch (error) {
                console.error("Error deleting Google account: ", error);
            } finally {
                setTimeout(() => {
                    setIsDisabled(false);
                }, 2000)
            }
        }
    }

    return (
        <div className="flex flex-col items-center w-full h-ful relative">
            <p className="text-center mt-3 xs:mt-4 lg:mt-6 xl:mt-7 2xl:mt-8 3xl:mt-9 mb-3 xs:mb-4
            lg:mb-6 xl:mb-7 2xl:mb-8 3xl:mb-9">
                {label}</p>
            <div className="flex justify-center w-4/5 max-w-[280px] xs:max-w-[350px] sm:max-w-[500px]
            mb-4 xs:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8 3xl:mb-9">
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