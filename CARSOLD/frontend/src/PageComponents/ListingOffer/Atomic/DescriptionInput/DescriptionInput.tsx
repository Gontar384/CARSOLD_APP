import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";

interface DescriptionInputProps {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    required: boolean;
    isWrong: boolean;
    setIsWrong: React.Dispatch<React.SetStateAction<boolean>>;
    maxLength: number;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ label, value, setValue, maxLength, required, isWrong, setIsWrong}) => {

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (newValue.length > maxLength) {
            setIsWrong(true);
        } else if (isWrong && newValue.length <= maxLength) {
            setIsWrong(false);
        }
    }
    
    return (
        <div className="flex flex-col w-11/12 items-center">
            <p className={`flex w-full max-w-[500px] text-lg m:text-xl ${!isWrong ? "text-black" : "text-coolRed"}`}>{label}</p>
            <div className="w-full h-64 m:h-72 max-w-[500px] relative">
                <textarea className={`w-full h-full text-sm m:text-lg p-1 bg-white focus:outline-0 resize-none rounded-md border-2
                ${!isWrong ? "border-gray-300 focus:border-darkLime" : "border-coolRed"}`}
                          value={value} onChange={handleChange}/>
                <p className="absolute -bottom-5 right-0 text-xs m:text-sm text-gray-700">{value.length}/{maxLength}</p>
                {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[120px] m:top-[136px] text-[10px] m:text-xs" icon={faAsterisk}/>}
            </div>
        </div>
    )
}

export default DescriptionInput