import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk, faPlay} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

interface SelectInputProps {
    label: string;
    options: string[];
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    message?: string;
    setToggled?: React.Dispatch<React.SetStateAction<boolean>>;
    shrinked?: boolean;
    symbol?: string;
    numericOnly?: boolean;
    typingBlocked?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, setValue, disabled, required, error, message, setToggled, shrinked, symbol, numericOnly, typingBlocked }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const {isMobile} = useUtil();

    useEffect(() => {
        const newFilteredOptions = options.filter(option =>
            option.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOptions(newFilteredOptions);
    }, [value, options]); // filters options

    const handleFocus = () => {
        setFilteredOptions(options);
        setIsOpen(true);
    };

    const handleSelect = (value: string) => {
        setValue(value);
        setIsOpen(false);
        setToggled?.(true);
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;
        if (numericOnly) newValue = newValue.replace(/[^0-9]/g, '');
        setValue(newValue);
        if (value === "") setToggled?.(true);
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        const currentTarget = event.currentTarget;
        const relatedTarget = event.relatedTarget as Node | null;
        if (relatedTarget && currentTarget.contains(relatedTarget)) return;
        setToggled?.(true);
    };

    useEffect(() => {
        if (value !== "") {
            if (!options.includes(value)) {
                setValue("");
                setTimeout(() => setToggled?.(true), 0);
            }
        }
    }, [isOpen]); //clears input when value doesn't match provided array

    useEffect(() => {
        const handleTouchMove = (event: TouchEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                const input = componentRef.current?.querySelector("input");
                if (document.activeElement === input) {
                    input?.blur();
                }
            }
        };
        document.addEventListener("touchmove", handleTouchMove);

        return () => document.removeEventListener("touchmove", handleTouchMove);
    }, [isMobile]); //fixes input focus/blur bug on mobile (blurs input when swiping)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (isOpen && componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
    }, [isOpen]) //offs dropdown

    return (
        <div className={`relative ${shrinked ? "w-40 m:w-48" : "w-[280px] m:w-[300px]"}`} ref={componentRef} onBlur={handleBlur}>
            <p className={`absolute transition-all duration-200 rounded-md pointer-events-none
            ${isOpen || value ? `text-xs m:text-sm left-4 -top-[9px] m:-top-[11px] bg-white px-1` : "text-lg m:text-xl left-2 top-2.5"}
            ${!error ? "text-gray-500" : "text-coolRed"}`}>
                {label}
            </p>
            <input className={`w-full h-12 pl-2 pr-10 text-lg m:text-xl rounded-md cursor-pointer bg-white border-2 text-black focus: outline-none
            ${!error ? isOpen ? "border-darkLime" : "border-gray-300" : "border-coolRed"}`}
                   disabled={disabled} value={value} onChange={(e) => handleOnChange(e)}
                   onFocus={handleFocus} readOnly={isMobile || typingBlocked}/>
            {isOpen && filteredOptions.length > 0 && (
                <ul className="absolute w-full text-lg m:text-xl bg-white border border-darkLime rounded-md shadow
                max-h-[222px] overflow-y-auto overflow-x-hidden z-10 animate-unroll">
                    {filteredOptions.map((option) => (
                        <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer relative"
                            tabIndex={0} role="button" onClick={() => handleSelect(option)}
                            onKeyDown={(event) => {if (event.key === "Enter") handleSelect(option)}}>
                            {option}
                            {symbol && <p className="absolute right-2 top-2.5 text-lg m:text-xl text-gray-500">{symbol}</p>}
                        </li>
                    ))}
                </ul>
            )}
            <FontAwesomeIcon className="absolute right-2.5 m:right-3 top-3.5 m:top-[13px] text-xl m:text-2xl transition-all duration-200 pointer-events-none"
                style={{transform: isOpen ? "rotate(90deg)" : "rotate(-90deg)", color: "darkgray"}} icon={faPlay}/>
            {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[18px] text-[10px] m:text-xs pointer-events-none" icon={faAsterisk}/>}
            {message && <p className={`text-xs m:text-sm ${!error ? "text-gray-700" : "text-coolRed"} mt-1`}>{message}</p>}
        </div>
    )
}

export default SelectInput