import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

interface AdditionalProps {
    setInputType?: React.Dispatch<React.SetStateAction<"password" | "text">>
    whichForm?: "login" | "register" | "none";
    termsCheck?: boolean;
    setTermsCheck?: React.Dispatch<React.SetStateAction<boolean>>;
    mark?: boolean;
}

const Additional: React.FC<AdditionalProps> = ({setInputType, whichForm, termsCheck, setTermsCheck, mark}) => {

    const [eyeIcon, setEyeIcon] = useState<IconDefinition>(faEye);

    const toggleInput = () => {
        setInputType?.((prev) => prev === "password" ? "text" : "password");
        setEyeIcon(eyeIcon === faEye ? faEyeSlash : faEye);
    }

    return (
        <div className={`flex flex-row ${whichForm === "none" ? "justify-end" : "justify-between"} items-center mt-6 m:mt-7`}>
            {whichForm === "login" ? (
                <Link to={("/password-recovery")} className="text-sm m:text-base underline">
                    Forgot password?
                </Link>
            ) : whichForm === "register" ? (
                <div className={`${mark ? "text-coolRed" : "text-black"} text-sm m:text-base`}>
                    <input id="myCheckbox" type="checkbox" className="w-[10px] h-[10px] m:w-[11px] m:h-[11px] mr-2 m:mr-3
                    bg-white border border-solid border-black rounded-full appearance-none checked:bg-black checked:border-white"
                           checked={termsCheck} onChange={(e) => {setTermsCheck?.(e.target.checked)}}
                           onKeyDown={(e) => {if (e.key === 'Enter') {setTermsCheck?.(!termsCheck)}}}/>
                    <label htmlFor="myCheckbox">Accept</label>
                    <Link to={"/termsOfUse"} className="underline ml-1">
                        terms of use.
                    </Link>
                </div>
            ) : null}
            <button onClick={toggleInput} className="w-6 h-6 m:w-7 m:h-7">
                <FontAwesomeIcon icon={eyeIcon} className={`w-full h-full ${eyeIcon === faEyeSlash ? "scale-110" : ""}`}/>
            </button>
        </div>
    )
}

export default Additional