import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";

interface ChooseButtonProps {
    label: string;
    firstOption: string;
    secondOption: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    required?: boolean;
    error: boolean;
    message?: string;
}

const ChooseInput: React.FC<ChooseButtonProps> = ({ label, firstOption, secondOption, value, setValue, required, error, message }) => {
    const handleButtonClick = (option: string) => {
        setValue(option);
    };

    return (
        <div className="relative w-fit">
            <p className={`text-lg m:text-xl text-center mb-1 ${!error ? "text-black" : "text-coolRed"}`}>{label}</p>
            <div className="flex flex-row text-lg m:text-xl">
                <button className={`w-[140px] m:w-[150px] py-2 rounded-l-md border
                ${error ? "border-coolRed bg-white text-coolRed" 
                    : value === firstOption ? "border-darkLime bg-lime" : "border-gray-300 bg-white"}`}
                        onClick={() => handleButtonClick(firstOption)}>{firstOption}
                </button>
                <button className={`w-[140px] m:w-[150px] py-2 rounded-r-md border
                ${error ? "border-coolRed bg-white text-coolRed" 
                    : value === secondOption ? "border-darkLime bg-lime" : "border-gray-300 bg-white" }`}
                        onClick={() => handleButtonClick(secondOption)}>{secondOption}
                </button>
            </div>
            {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[46px] text-[10px] m:text-xs pointer-events-none" icon={faAsterisk} />}
            {message && <p className={`text-xs m:text-sm ${!error ? "text-gray-700" : "text-coolRed"} mt-1`}>{message}</p>}
        </div>
    )
}

export default ChooseInput