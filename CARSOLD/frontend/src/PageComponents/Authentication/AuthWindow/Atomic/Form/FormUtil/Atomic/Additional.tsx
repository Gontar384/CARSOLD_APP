import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useLanguage} from "../../../../../../../GlobalProviders/Language/useLanguage.ts";

interface AdditionalProps {
    setInputType?: React.Dispatch<React.SetStateAction<"password" | "text">>
    whichForm?: "login" | "register" | "none";
    termsCheck?: boolean;
    setTermsCheck?: React.Dispatch<React.SetStateAction<boolean>>;
    mark?: boolean;
}

const Additional: React.FC<AdditionalProps> = ({setInputType, whichForm, termsCheck, setTermsCheck, mark}) => {
    const [eyeIcon, setEyeIcon] = useState<IconDefinition>(faEye);
    const {t} = useLanguage();

    const toggleInput = () => {
        const activeEl = document.activeElement;
        const input = (activeEl instanceof HTMLInputElement) ? activeEl : null;
        const selectionStart = input?.selectionStart ?? null;
        const selectionEnd = input?.selectionEnd ?? null;

        setInputType?.((prev) => prev === "password" ? "text" : "password");
        setEyeIcon(prev => prev === faEye ? faEyeSlash : faEye);

        setTimeout(() => {
            if (input && selectionStart !== null && selectionEnd !== null && typeof input.setSelectionRange === "function") {
                input.setSelectionRange(selectionStart, selectionEnd);
                input.focus();
            }
        }, 0);
    }

    return (
        <div className={`flex flex-row ${whichForm === "none" ? "justify-end" : "justify-between"} items-center mt-6 m:mt-7`}>
            {whichForm === "login" ? (
                <Link to={("/password-recovery")} className="text-sm m:text-base underline">
                    {t("input1")}
                </Link>
            ) : whichForm === "register" ? (
                <div className={`${mark ? "text-coolRed" : "text-black"} text-sm m:text-base`}>
                    <input id="myCheckbox" type="checkbox" className="w-[10px] h-[10px] m:w-[11px] m:h-[11px] mr-2 m:mr-3
                    bg-white border border-solid border-black rounded-full appearance-none checked:bg-black checked:border-white"
                           checked={termsCheck} onChange={(e) => {setTermsCheck?.(e.target.checked)}}
                           onKeyDown={(e) => {if (e.key === 'Enter') {setTermsCheck?.(!termsCheck)}}}/>
                    <label htmlFor="myCheckbox">{t("input2")}</label>
                    <Link to={"/termsOfUse"} className="underline ml-1 m:ml-1.5">
                        {t("input3")}
                    </Link>
                </div>
            ) : null}
            <button className="w-6 h-6 m:w-7 m:h-7" onClick={toggleInput} onMouseDown={(e) => {e.preventDefault()}} >
                <FontAwesomeIcon icon={eyeIcon} className={`w-full h-full ${eyeIcon === faEyeSlash ? "scale-110" : ""}`}/>
            </button>
        </div>
    )
}

export default Additional