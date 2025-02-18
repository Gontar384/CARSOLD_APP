import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";

interface DescriptionInputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    isWrong: boolean;
    setIsWrong: React.Dispatch<React.SetStateAction<boolean>>;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ value, setValue, isWrong, setIsWrong}) => {

    const MAX_LENGTH: number = 2000;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (newValue.length > MAX_LENGTH) {
            setIsWrong(true);
        } else if (isWrong && newValue.length <= MAX_LENGTH) {
            setIsWrong(false);
        }
    }
    
    return (
        <div className="flex flex-col w-11/12 items-center">
            <p className={`flex flex-row items-center gap-1 m:gap-1.5 w-full max-w-[500px] text-lg m:text-xl 
            ${!isWrong ? "text-black" : "text-coolRed"}`}>
                Description
                <FontAwesomeIcon className="text-[10px] m:text-xs" icon={faAsterisk}/>
            </p>
            <div className="w-full h-64 m:h-72 max-w-[500px]">
                <textarea className={`w-full h-full text-sm m:text-lg p-1 bg-white focus:outline-0 resize-none rounded-md border-2
                ${!isWrong ? "border-gray-300 focus:border-darkLime" : "border-coolRed"}`}
                          value={value} onChange={handleChange} placeholder="Describe your car and put some important info here..."/>
                <div className="flex flex-row justify-between text-xs m:text-sm text-gray-700">
                    <p>At least 30 characters.</p>
                    <p>{value.length}/MAX_LENGTH</p>
                </div>
            </div>
        </div>
    )
}

export default DescriptionInput