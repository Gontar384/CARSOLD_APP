import React from "react";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";
import {faLanguage} from "@fortawesome/free-solid-svg-icons/faLanguage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useButton} from "../../../CustomHooks/useButton.ts";

const LanguageButton: React.FC = () => {
    const {language, changeLanguage} = useLanguage();
    const {bindHoverHandlers, buttonColor} = useButton();
    const {t} = useLanguage();

    return (
        <button className={`flex flex-col justify-center items-center w-9 m:w-10 p-1 ${buttonColor ? "text-white" : "text-black"}`}
                {...bindHoverHandlers()} onClick={() => changeLanguage(language === "POL" ? "ENG" : "POL")}
                title={t("languageButton")}>
            <FontAwesomeIcon icon={faLanguage} className="text-lg m:text-xl"/>
            <p className="text-[10px] m:text-xs font-semibold">{language}</p>
        </button>
    )
};

export default LanguageButton