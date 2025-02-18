import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk, faPlay} from "@fortawesome/free-solid-svg-icons";

interface SelectInputProps {
    label: string;
    options: string[];
    value: string | null;
    setValue: React.Dispatch<React.SetStateAction<string | null>>;
    active: boolean;
    required: boolean;
    isWrong: boolean;
    setIsWrong: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectInput: React.FC<SelectInputProps> = ({ label, options, value, setValue, required, isWrong, setIsWrong, active }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);

    const handleSelect = (value: string) => {
        setValue(value);
        setIsOpen(false);
        setIsWrong(false);
    };

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
        <div className="relative w-64 m:w-72" ref={componentRef} tabIndex={0} role="button"
             onKeyDown={(event) => {if (event.key === "Enter" && !isOpen && active) setIsOpen(true)}}>
            <p className={`absolute transition-all duration-200 rounded-md pointer-events-none
            ${isOpen || value ? `text-xs m:text-sm left-4 -top-[9px] m:-top-[11px] bg-white px-1` : "text-lg m:text-xl left-2 top-2.5"}
            ${!isWrong ? "text-gray-500" : "text-coolRed"}`}>
                {label}
            </p>
            <div className={`w-full p-2 pr-6 text-lg m:text-xl rounded-md cursor-pointer bg-white border-2 text-black truncate
            ${!isWrong ? isOpen ? "border-darkLime" : "border-gray-300" : "border-coolRed"}`}
                 onClick={() => active && setIsOpen(!isOpen)}>
                {value || "\u200B"}
            </div>
            {isOpen && (
                <ul className="absolute w-full text-lg m:text-xl bg-white border border-darkLime rounded-md shadow
                max-h-[222px] overflow-y-auto overflow-x-hidden z-10 animate-unroll">
                    {options.map((option) => (
                        <li key={option} className="p-2 hover:bg-gray-200 cursor-pointer"
                            tabIndex={0} role="button"
                            onClick={() => handleSelect(option)}
                            onKeyDown={(event) => {if (event.key === "Enter") handleSelect(option)}}>
                            {option}
                        </li>
                    ))}
                </ul>
            )}
            <FontAwesomeIcon className="absolute right-2.5 m:right-3 top-3.5 m:top-[13px] text-xl m:text-2xl transition-all duration-200 pointer-events-none"
                             style={{transform: isOpen ? "rotate(90deg)" : "rotate(-90deg)", color: "darkgray"}} icon={faPlay} />
            {required && <FontAwesomeIcon className="absolute -right-3 m:-right-3.5 top-[18px] text-[10px] m:text-xs pointer-events-none" icon={faAsterisk} />}
        </div>
    )
}

export default SelectInput