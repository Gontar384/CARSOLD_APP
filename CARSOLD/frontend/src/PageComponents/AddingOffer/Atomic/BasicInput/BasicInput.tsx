import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

interface TitleInputProps {
    label: string;
    type: "text" | "number" | "date";
    symbol?: string;
    setSymbol?: React.Dispatch<React.SetStateAction<string>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    required?: boolean;
    error?: boolean;
    message?: string;
    maxLength?: number;
    firstOtherSymbol?: string;
    secondOtherSymbol?: string;
    setToggled?: React.Dispatch<React.SetStateAction<boolean>>;
}

const BasicInput: React.FC<TitleInputProps> = ({label, type, symbol, setSymbol, value, setValue, required, error, message, maxLength, firstOtherSymbol, secondOtherSymbol, setToggled}) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const {isMobile} = useUtil();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        if (type === "number") {
            newValue = newValue.replace(/[^0-9]/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        setValue(newValue);
    };

    return (
        <div className="relative w-[280px] m:w-[300px]" onBlur={() => setToggled?.(true)}>
            <label className={`absolute transition-all duration-200 rounded-md pointer-events-none
            ${isFocused || value || type === "date" ? `text-xs m:text-sm left-4 -top-[9px] m:-top-[11px] bg-white px-1` : "text-lg m:text-xl left-2 top-2.5"}
            ${!error ? "text-gray-500" : "text-coolRed"}`}>
                {label}
            </label>
            <input className={`w-full p-2 ${symbol && "pr-12 m:pr-14"} text-lg m:text-xl border-2 rounded-md focus:outline-none focus:shadow
            ${!error ? "border-gray-300 focus:border-darkLime" : "border-coolRed text-coolRed"}`}
                   value={value} type={type === "date" ? "date" : "text"}
                   onChange={handleChange}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setIsFocused(value !== "")}/>
            {symbol && <p className="absolute right-2 top-2.5 text-lg m:text-xl text-gray-500">{symbol}</p>}
            {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[18px] text-[10px] m:text-xs" icon={faAsterisk}/>}
            {message || maxLength || firstOtherSymbol ?
                <div className="flex flex-row justify-between text-xs m:text-sm mt-1">
                    {message &&
                        <p className={`${!error ? "text-gray-700" : "text-coolRed"}`}>
                            {message}
                        </p>}
                    {maxLength &&
                        <p className="text-gray-700">
                            {value.length}/{maxLength}
                        </p>}
                    {firstOtherSymbol && secondOtherSymbol && symbol && setSymbol &&
                        <div className="flex gap-1 text-base m:text-lg text-gray-700">
                            <button className={`flex justify-center w-14 m:w-16 bg-lime border border-gray-300 rounded ${!isMobile && "hover:brightness-105"}`}
                                onClick={() => setSymbol(firstOtherSymbol)}>
                                {firstOtherSymbol}
                            </button>
                            <button className={`flex justify-center w-14 m:w-16 bg-lime border border-gray-300 rounded ${!isMobile && "hover:brightness-105"}`}
                                onClick={() => setSymbol(secondOtherSymbol)}>
                                {secondOtherSymbol}
                            </button>
                        </div>}
                </div> : null}
        </div>
    )
}

export default BasicInput