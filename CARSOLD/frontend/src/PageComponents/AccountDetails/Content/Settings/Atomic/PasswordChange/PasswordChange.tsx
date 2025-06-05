import React from "react";
import PasswordChangeForm from "../../../../../PasswordRecoveryChange/PasswordChangeForm/PasswordChangeForm.tsx";
import {useLanguage} from "../../../../../../GlobalProviders/Language/useLanguage.ts";

interface PasswordChangeProps {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({setIsChanged}) => {
    const {t} = useLanguage();

    return (
        <div className="mt-36 m:mt-40">
            <h2 className="mb-8 m:mb-10 text-xl m:text-2xl text-center">
                {t("changePassword1")}
            </h2>
            <PasswordChangeForm setIsChanged={setIsChanged} loggedIn={true}/>
        </div>
    )
}

export default PasswordChange