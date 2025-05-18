import React from "react";
import PartButton from "./Atomic/PartButton.tsx";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

const LoginRegisterButton: React.FC = () => {
    const {t} = useLanguage();

    return (
        <div className="flex flex-row gap-2 text-2xl whitespace-nowrap cursor-pointer">
            <PartButton title={t("loginRegisterButton1")} path={"login"}/>
            <p>|</p>
            <PartButton title={t("loginRegisterButton2")} path={"register"}/>
        </div>
    )
}

export default LoginRegisterButton