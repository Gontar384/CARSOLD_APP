import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import Additional from "./Atomic/Additional.tsx";

interface InputProps<T> {
    placeholder: string;
    inputType: "text" | "password";
    setInputType?: React.Dispatch<React.SetStateAction<"text" | "password">>;
    value: T extends object ? T[keyof T] : T;
    field?: keyof T;
    setValue?: React.Dispatch<React.SetStateAction<T>>;
    icon?: IconProp | null;
    isActive?: boolean;
    info?: string;
    hasEye?: boolean;
    whichForm?: "login" | "register" | "none";
    termsCheck?: boolean;
    setTermsCheck?: React.Dispatch<React.SetStateAction<boolean>>;
    mark?: boolean;
    isShrink?: boolean;
}

const Input = <T extends string | number | object>({placeholder, inputType, setInputType, value, setValue, field, icon,
                                                       isActive, info, hasEye, whichForm, termsCheck, setTermsCheck, mark, isShrink}: InputProps<T>) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.trim();

        if (setValue) {
            if (field) {
                setValue((prev: T) => ({
                    ...(prev as object),
                    [field]: newValue,
                }) as T);
            } else {
                setValue(newValue as T);
            }
        }
    };   //let update individual values and specific fields of objects

    return (
        <div className={`${!isShrink ? "w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12" : "w-full"}`}>
            <div className="w-full relative">
                <input className="w-full p-1 pr-12 rounded-sm 3xl:h-12 shadow-lg transition duration-500 ease-in-out
                focus:outline-none focus:ring-2 xs:focus:ring-[3px] 2xl:focus:ring-4 focus:ring-blue-500/30 focus:shadow-blue-500/50"
                       placeholder={placeholder} type={inputType} value={value} onChange={handleChange}/>
                {icon && <FontAwesomeIcon icon={icon}
                                          className="text-2xl xs:text-[27px] 2xl:text-[30px] 3xl:text-[36px]
                                           absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
                {isActive &&
                <p className="text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[42px]
                2xl:top-[44px] 3xl:top-[54px] whitespace-nowrap">{info}</p>}
            </div>
            {hasEye ? <Additional setInputType={setInputType} whichForm={whichForm} termsCheck={termsCheck} setTermsCheck={setTermsCheck} mark={mark}/> : null}
        </div>
    )
}

export default Input