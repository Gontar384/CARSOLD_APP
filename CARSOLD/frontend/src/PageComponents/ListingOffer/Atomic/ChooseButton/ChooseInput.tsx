import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";

interface ChooseButtonProps {
    label: string;
    firstOption: string;
    secondOption: string;
    value: boolean | null;
    setValue: React.Dispatch<React.SetStateAction<boolean | null>>;
    required: boolean;
    isWrong: boolean;
    setIsWrong: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChooseInput: React.FC<ChooseButtonProps> = ({ label, firstOption, secondOption, value, setValue, required, isWrong, setIsWrong }) => {

    const handleButtonClick = (option: boolean) => {
        setValue(option);
        if (isWrong) setIsWrong(false);
    }

    return (
        <div className="relative">
            <p className={`text-lg m:text-xl text-center ${!isWrong ? "text-black" : "text-coolRed"}`}>{label}</p>
            <div className="flex flex-row">
                <button className={`text-lg m:text-xl w-32 m:w-36 py-2 rounded-l-md border hover:bg-lime 
                ${!isWrong ? value ? "border-darkLime" : "border-gray-300" : "border-coolRed"}
                ${value === null ? "bg-white" : value ? "bg-lime" : "bg-white"}`}
                        onClick={() => handleButtonClick(true)}>{firstOption}
                </button>
                <button className={`text-lg m:text-xl w-32 m:w-36 py-2 rounded-r-md border hover:bg-lime 
                ${!isWrong ? !value ? "border-darkLime" : "border-gray-300" : "border-coolRed"}
                ${value === null ? "bg-white" : !value ? "bg-lime" : "bg-white"}`}
                        onClick={() => handleButtonClick(false)}>{secondOption}
                </button>
            </div>
            {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[46px] text-[10px] m:text-xs pointer-events-none" icon={faAsterisk} />}
        </div>
    )
}

export default ChooseInput