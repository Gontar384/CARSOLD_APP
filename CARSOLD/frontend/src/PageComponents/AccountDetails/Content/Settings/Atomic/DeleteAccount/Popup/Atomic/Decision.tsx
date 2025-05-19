import React from "react";
import ConfirmButton from "./Atomic/ConfirmButton.tsx";
import {useLanguage} from "../../../../../../../../GlobalProviders/Language/useLanguage.ts";

interface DecisionProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
}

const Decision: React.FC<DecisionProps> = ({setPopup, setConfirmed}) => {
    const {t} = useLanguage();

    return (
        <div className="flex flex-col items-center w-full h-full mb-8 m:mb-10">
            <p className="w-10/12 text-center mt-8 m:mt-10">
                {t("deleteAccount2")}
            </p>
            <div className="flex flex-row items-center justify-center mt-5 m:mt-7 gap-10 m:gap-12">
                <ConfirmButton label={t("deleteAccount3")} type="choice" onClick={() => setConfirmed(true)}/>
                <ConfirmButton label={t("deleteAccount4")} type="choice" onClick={() => setPopup(false)}/>
            </div>
        </div>
    )
}

export default Decision