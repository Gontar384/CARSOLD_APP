import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

interface DescriptionInputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    error: boolean;
    message: string;
    setToggled?: React.Dispatch<React.SetStateAction<boolean>>;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ value, setValue, error, message, setToggled}) => {
    const {t} = useLanguage();
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
    }
    
    return (
        <div className="flex flex-col w-11/12 gap-1 m:gap-2" onBlur={() => setToggled?.(true)}>
            <p className={`flex flex-row items-center gap-1 m:gap-1.5 w-full max-w-[650px] text-lg m:text-xl 
            ${!error ? "text-black" : "text-coolRed"}`}>
                {t("offerForm83")}
                <FontAwesomeIcon className="text-[10px] m:text-xs" icon={faAsterisk}/>
            </p>
            <div className="w-full h-64 m:h-80 max-w-[650px] mb-10">
                <textarea className={`w-full h-full text-sm m:text-lg p-1 bg-white focus:outline-0 resize-none rounded-md border-2
                ${!error ? "border-gray-300 focus:border-darkLime" : "border-coolRed text-coolRed"}`}
                          value={value} onChange={handleChange} placeholder={t("offerForm107")}/>
                <div className="flex flex-row justify-between text-xs m:text-sm">
                    <p className={`${!error ? "text-gray-700" : "text-coolRed"}`}>{message}</p>
                    <p className="text-gray-700">{value.length}/2000</p>
                </div>
            </div>
        </div>
    )
}

export default DescriptionInput