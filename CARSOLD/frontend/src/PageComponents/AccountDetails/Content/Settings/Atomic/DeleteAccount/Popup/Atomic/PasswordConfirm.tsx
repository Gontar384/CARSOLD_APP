import React, {useEffect, useState} from "react";
import Input from "../../../../../../../../SharedComponents/FormUtil/Input.tsx";
import ConfirmButton from "./Atomic/ConfirmButton.tsx";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {useUtil} from "../../../../../../../../GlobalProviders/Util/useUtil.ts";
import {useUserCheck} from "../../../../../../../../CustomHooks/useUserCheck.ts";
import {AxiosResponse} from "axios";
import {faCircleCheck, faCircleExclamation} from "@fortawesome/free-solid-svg-icons";
import {api} from "../../../../../../../../Config/AxiosConfig/AxiosConfig.ts";

const PasswordConfirm: React.FC = () => {

    const [password, setPassword] = useState<string>("");
    const [icon, setIcon] = useState<IconProp | null>(null);
    const {CreateDebouncedValue} = useUtil();
    const debouncedPassword = CreateDebouncedValue(password, 300);
    const {checkOldPassword} = useUserCheck();

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

    const handleDeleteAccount = async () => {
        if (password.length >= 7 && password.length <= 25) {
            try {
                const passwordResponse: AxiosResponse = await checkOldPassword(password);
                if (passwordResponse.data.checks) {
                    await api.delete("api/delete-user");
                }
            } catch (error) {
                console.error("Error checking password: ", error);
            }
        }
    }

    return (
        <div className="flex flex-col items-center w-full h-ful relative">
            <p className="text-center mt-3 xs:mt-4 lg:mt-6 xl:mt-7 2xl:mt-8 3xl:mt-9 mb-3 xs:mb-4
            lg:mb-6 xl:mb-7 2xl:mb-8 3xl:mb-9">
                Please, provide your password:</p>
            <div className="flex justify-center w-4/5 max-w-[280px] xs:max-w-[350px] sm:max-w-[500px]
            mb-4 xs:mb-5 lg:mb-6 xl:mb-7 2xl:mb-8 3xl:mb-9">
                <Input placeholder="Password" inputType="password" value={password} setValue={setPassword} icon={icon}/>
            </div>
            <ConfirmButton label="Submit" type="submit" onClick={handleDeleteAccount}/>
        </div>
    )
}

export default PasswordConfirm