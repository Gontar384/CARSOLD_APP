import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";

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
    }   //changes password input

    const navigate = useNavigate();

    return (
        <div className={`flex flex-row ${whichForm === "none" ? "justify-end" : "justify-between"} items-center mt-2 xs:mt-3 2xl:mt-4 3xl:mt-5`}>
            {whichForm === "login" ? (
                <button onClick={() => navigate('/password-recovery')}
                        className="text-xs xs:text-[14px] 2xl:text-[18px] 3xl:text-[21px] underline">Forgot password?
                </button>
            ) : whichForm === "register" ? (
                <div className={`${mark ? "text-coolRed" : "text-black"}
                 text-xs xs:text-[14px] 2xl:text-[18px] 3xl:text-[21px]`}>
                    <input id="myCheckbox" type="checkbox" className="w-[8px] h-[8px] xs:w-[10px] xs:h-[10px] 2xl:w-[13px]
                     2xl:h-[13px] 3xl:w-[15px] 3xl:h-[15px] mr-3 bg-white border border-solid border-black rounded-full
                      appearance-none checked:bg-black checked:border-white"
                           checked={termsCheck} onChange={(e) => {setTermsCheck?.(e.target.checked)}}
                           onKeyDown={(e) => {if (e.key === 'Enter') {setTermsCheck?.(!termsCheck)}}}/>
                    <label htmlFor="myCheckbox">Accept</label>
                    <button onClick={() => navigate('/termsOfUse')}
                            className="underline ml-1">terms of use.
                    </button>
                </div>
            ) : null}
            <button onClick={toggleInput} className="w-5 h-5 xs:w-6 xs:h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8">
                <FontAwesomeIcon icon={eyeIcon} className={`w-full h-full ${eyeIcon === faEyeSlash ? "scale-110" : ""}`}/>
            </button>
        </div>
    )
}

export default Additional