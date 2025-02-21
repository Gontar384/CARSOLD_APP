import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";

interface TitleInputProps {
    label: string;
    type: "text" | "number" | "date";
    symbol?: string;
    setSymbol?: React.Dispatch<React.SetStateAction<string>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    required?: boolean;
    error: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
    message?: string;
    maxLength?: number;
    firstOtherSymbol?: string;
    secondOtherSymbol?: string;
}

const BasicInput: React.FC<TitleInputProps> = ({label, type, symbol, setSymbol, value, setValue, required, error, setError, message, maxLength, firstOtherSymbol, secondOtherSymbol}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        if (type === "number") {
            newValue = newValue.replace(/[^0-9]/g, "");
        }

        if (maxLength && newValue.length > maxLength) {
            setError(true);
        } else {
            setError(false);
        }

        setValue(newValue);
    };

    return (
        <div className="relative w-64 m:w-72">
            <label className={`absolute transition-all duration-200 rounded-md pointer-events-none
            ${isFocused || value || type === "date" ? `text-xs m:text-sm left-4 -top-[9px] m:-top-[11px] bg-white px-1` : "text-lg m:text-xl left-2 top-2.5"}
            ${!error ? "text-gray-500" : "text-coolRed"}`}>
                {label}
            </label>
            <input className={`w-full p-2 ${symbol && "pr-12 m:pr-14"} text-lg m:text-xl border-2 rounded-md focus:outline-none focus:shadow
            ${!error ? "border-gray-300 focus:border-darkLime" : "border-coolRed"}`}
                   value={value} type={type === "date" ? "date" : "text"}
                   onChange={handleChange}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setIsFocused(value !== "")}/>
            {symbol && <p className="absolute right-2 top-2.5 text-lg m:text-xl text-gray-500">{symbol}</p>}
            {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[18px] text-[10px] m:text-xs" icon={faAsterisk}/>}
            {message || maxLength || firstOtherSymbol ?
                <div className="flex flex-row justify-between text-xs m:text-sm text-gray-700 mt-1">
                    {message && <p>{message}</p>}
                    {maxLength && <p>{value.length}/{maxLength}</p>}
                    {firstOtherSymbol && secondOtherSymbol && symbol && setSymbol &&
                        <div className="flex gap-1 text-base m:text-lg">
                            <button className="flex justify-center w-14 m:w-16 bg-lime border border-gray-300 hover:brightness-90 rounded"
                                onClick={() => setSymbol(firstOtherSymbol)}>
                                {firstOtherSymbol}
                            </button>
                            <button className="flex justify-center w-14 m:w-16 bg-lime border border-gray-300 hover:brightness-90 rounded"
                                onClick={() => setSymbol(secondOtherSymbol)}>
                                {secondOtherSymbol}
                            </button>
                        </div>}
                </div> : null}
        </div>
    )
}

export default BasicInput