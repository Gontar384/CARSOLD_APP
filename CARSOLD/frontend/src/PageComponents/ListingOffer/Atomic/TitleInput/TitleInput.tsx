import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk, faSquareCheck} from "@fortawesome/free-solid-svg-icons";

interface TitleInputProps {
    label: string;
    value: string;
    setValue: (value: string) => void;
    required: boolean;
    isRight: boolean;
    isWrong: boolean;
    setIsWrong: (isWrong: boolean) => void;
    maxLength: number;
}

const TitleInput: React.FC<TitleInputProps> = ({ label, value, setValue, required, isWrong, setIsWrong, isRight, maxLength }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (value.length > maxLength) setIsWrong(true);
    }, [maxLength, setIsWrong, value]);

    return (
        <div className="relative w-64 m:w-72"
        onChange={isWrong ? () => setIsWrong(false) : undefined}>
            {isRight && <FontAwesomeIcon className="absolute -left-[17px] m:-left-5 top-4 m:top-[15px] text-base m:text-lg" icon={faSquareCheck}/>}
            <label className={`absolute transition-all duration-200 rounded-md pointer-events-none
            ${isOpen || value ? `text-xs m:text-sm left-4 -top-[9px] m:-top-[11px] bg-white px-1` : "text-lg m:text-xl left-2 top-2.5"}
            ${!isWrong ? "text-gray-500" : "text-coolRed"}`}>
                {label}
            </label>
            <input className={`w-full p-2 text-lg m:text-xl border-2 rounded-md focus:outline-none focus:shadow  
            ${!isWrong ? "border-gray-300 focus:border-darkLime" : "border-coolRed"}`}
                value={value} type="text" onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsOpen(true)} onBlur={() => setIsOpen(value !== "")}/>
            <p className="absolute text-gray-700 -bottom-[17px] m:-bottom-5 right-0 text-xs m:text-sm">{value.length}/{maxLength}</p>
            {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[18px] text-[10px] m:text-xs" icon={faAsterisk}/>}
        </div>
    )
}

export default TitleInput