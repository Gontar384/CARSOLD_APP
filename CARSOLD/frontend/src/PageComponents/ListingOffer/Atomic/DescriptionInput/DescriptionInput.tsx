import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";

interface DescriptionInputProps {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    error: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ value, setValue, error, setError}) => {

    const MAX_LENGTH = 2000;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (newValue.length > MAX_LENGTH) {
            setError(true);
        } else if (error && newValue.length <= MAX_LENGTH) {
            setError(false);
        }
    }
    
    return (
        <div className="flex flex-col w-11/12 items-center">
            <p className={`flex flex-row items-center gap-1 m:gap-1.5 w-full max-w-[550px] text-lg m:text-xl 
            ${!error ? "text-black" : "text-coolRed"}`}>
                Description
                <FontAwesomeIcon className="text-[10px] m:text-xs" icon={faAsterisk}/>
            </p>
            <div className="w-full h-64 m:h-72 max-w-[550px] mb-10">
                <textarea className={`w-full h-full text-sm m:text-lg p-1 bg-white focus:outline-0 resize-none rounded-md border-2
                ${!error ? "border-gray-300 focus:border-darkLime" : "border-coolRed"}`}
                          value={value} onChange={handleChange} placeholder="Describe your car and put some important info here..."/>
                <div className="flex flex-row justify-between text-xs m:text-sm text-gray-700">
                    <p>At least 30 characters.</p>
                    <p>{value.length}/{MAX_LENGTH}</p>
                </div>
            </div>
        </div>
    )
}

export default DescriptionInput