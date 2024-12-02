import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

interface InputProps {
    placeholder: string;
    type: "text" | "password";
    value: string;
    icon?: IconProp;
    isActive?: boolean;
    info?: string;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
    setObject?: <T>(field: keyof T, value: any) => void;
    field?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, type, value, icon, isActive, info, setValue, setObject, field }) => {
    return (
        <div className="w-10/12 max-w-[255px] xs:max-w-[420px] xs:w-9/12 relative">
            <input className="w-full p-1 pr-12 rounded-sm 3xl:h-12" placeholder={placeholder} type={type}
                   value={value}
                   onChange={(e) => {
                       if (field && setObject) { setObject(field, e.target.value.trim()) }
                       else if (setValue) { setValue(e.target.value.trim()) }
                   }}/>
            {icon && <FontAwesomeIcon icon={icon}
                                           className="text-2xl xs:text-[27px] 2xl:text-[30px] 3xl:text-[36px]
                                           absolute right-2 3xl:right-3 top-[4px] xs:top-[5px] 3xl:top-[6px] opacity-90"/>}
            <p className={isActive ? "text-[10px] xs:text-xs 2xl:text-base 3xl:text-lg absolute top-8 xs:top-[41px] " +
                "2xl:top-[43px] 3xl:top-[50px]" : "hidden"}>{info}</p>
        </div>
    )
}

export default Input