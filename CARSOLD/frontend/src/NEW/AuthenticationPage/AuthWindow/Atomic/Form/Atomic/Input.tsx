import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import Additional from "./Additional.tsx";

interface InputProps<T> {
    placeholder: string;
    inputType: "text" | "password";
    setInputType?: React.Dispatch<React.SetStateAction<"text" | "password">>;
    value: T extends object ? T[keyof T] : T;
    field?: keyof T;
    setValue?: React.Dispatch<React.SetStateAction<T>>;
    icon?: IconProp;
    isActive?: boolean;
    info?: string;
    hasEye?: boolean;
}

const Input = <T extends string | number | object>({placeholder, inputType, setInputType, value, setValue,
                                                       field, icon, isActive, info, hasEye}: InputProps<T>) => {

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
        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
            <div className="w-full">
                <input className="w-full p-1 pr-12 rounded-sm 3xl:h-12 shadow-lg transition duration-500 ease-in-out
                focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:shadow-blue-500/50"
                       placeholder={placeholder} type={inputType} value={value} onChange={handleChange}/>
                {icon && <FontAwesomeIcon icon={icon}
                                          className="text-2xl xs:text-[27px] 2xl:text-[30px] 3xl:text-[36px]
                                           absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
                <p className={isActive ? "text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[41px] " +
                    "2xl:top-[43px] 3xl:top-[50px]" : "hidden"}>{info}</p>
            </div>
            {hasEye ? <Additional setInputType={setInputType}/> : null}
        </div>
    )
}

export default Input