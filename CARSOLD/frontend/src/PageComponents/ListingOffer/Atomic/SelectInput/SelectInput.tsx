import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk, faPlay, faSquareCheck} from "@fortawesome/free-solid-svg-icons";

interface SelectInputProps {
    label: string;
    options: { value: string; label: string }[];
    setValue: (value: string) => void;
    required: boolean;
    isRight: boolean;
    isWrong: boolean;
    setIsWrong: (isWrong: boolean) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({ options, setValue, label, required, isWrong, setIsWrong, isRight }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement | null>(null);

    const handleSelect = (value: string) => {
        setSelected(value);
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
             onKeyDown={(event) => {if (event.key === "Enter" && !isOpen) setIsOpen(true)}}>
            {isRight && <FontAwesomeIcon className="absolute -left-[17px] m:-left-5 top-4 m:top-[15px] text-base m:text-lg" icon={faSquareCheck}/>}
            <p className={`absolute transition-all duration-200 rounded-md pointer-events-none
            ${isOpen || selected ? `text-xs m:text-sm left-4 -top-[9px] m:-top-[11px] bg-white px-1` : "text-lg m:text-xl left-2 top-2.5"}
            ${!isWrong ? "text-gray-500" : "text-coolRed"}`}>
                {label}
            </p>
            <div className={`w-full p-2 text-lg m:text-xl rounded-md cursor-pointer bg-white border-2 
            ${selected ? "text-black" : !isWrong ? "text-gray-500" : "text-coolRed"}
            ${!isWrong ? isOpen ? "border-darkLime" : "border-gray-300" : "border-coolRed"}`}
                 onClick={() => setIsOpen(!isOpen)}>
                {selected ? options.find((o) => o.value === selected)?.label : "\u200B"}
            </div>
            {isOpen && (
                <ul className="absolute w-full text-lg m:text-xl bg-white border border-darkLime rounded-md shadow
                 max-h-[134px] overflow-y-auto z-10">
                    {options.map((option) => (
                        <li key={option.value} className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
                            tabIndex={0} role="button"
                            onClick={() => handleSelect(option.value)}
                            onKeyDown={(event) => {if (event.key === "Enter") handleSelect(option.value)}}>
                            {option.label}
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