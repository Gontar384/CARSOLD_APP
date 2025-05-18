import React from "react";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";
import {faLanguage} from "@fortawesome/free-solid-svg-icons/faLanguage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const LanguageDropdown: React.FC = () => {
    const {language} = useLanguage();

    return (
        <div className="flex flex-col justify-center items-center mx-1 mt-0.5">
            <FontAwesomeIcon icon={faLanguage} className="text-lg m:text-xl"/>
            <p className="text-[10px] m:text-xs">{language === "pl" ? "PL" : "ENG"}</p>
        </div>
    )
};

export default LanguageDropdown