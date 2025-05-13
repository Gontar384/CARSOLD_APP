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
    info?: string;
    hasEye?: boolean;
    whichForm?: "login" | "register" | "none";
    termsCheck?: boolean;
    setTermsCheck?: React.Dispatch<React.SetStateAction<boolean>>;
    mark?: boolean;
}

const Input = <T extends string | number | object>({placeholder, inputType, setInputType, value, setValue, field, icon,
                                                        info, hasEye, whichForm, termsCheck, setTermsCheck, mark}: InputProps<T>) => {

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
        <div className={`w-10/12 max-w-[270px] m:w-9/12 m:max-w-max mb-6 m:mb-7`}>
            <div className="w-full relative">
                <input className="w-full p-1 pr-12 text-xl m:text-2xl rounded-sm shadow-lg transition duration-500 ease-in-out
                focus:outline-none focus:ring-2 m:focus:ring-[3px] focus:ring-blue-500/30 focus:shadow-blue-500/50"
                       placeholder={placeholder} type={inputType} value={value} onChange={handleChange}/>
                {icon && <FontAwesomeIcon icon={icon} className="text-[27px] m:text-[30px] absolute right-2 top-[5px] opacity-90"/>}
                <p className="text-xs m:text-sm absolute top-10 m:top-11 whitespace-nowrap">{info}</p>
            </div>
            {hasEye ? <Additional setInputType={setInputType} whichForm={whichForm} termsCheck={termsCheck} setTermsCheck={setTermsCheck} mark={mark}/> : null}
        </div>
    )
}

export default Input