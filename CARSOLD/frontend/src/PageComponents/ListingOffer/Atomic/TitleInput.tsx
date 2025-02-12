import React, {useState} from "react";

interface TitleInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required: boolean;
    filled: boolean;
}

const TitleInput: React.FC<TitleInputProps> = ({label, value, onChange, required, filled}) => {

    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative">
            <label className={`absolute transition-all duration-200 ${filled ? "text-gray-500" : "text-coolRed"} rounded-md pointer-events-none
                    ${isFocused || value ? `text-xs m:text-sm -top-[9px] m:-top-[11px] left-4 bg-white px-1` : "text-lg m:text-xl left-2 top-2"}`}>
                {label}
            </label>
            <input className={`p-2 text-lg m:text-xl border ${filled ? "border-gray-300 focus:border-darkLime" : "border-coolRed"} 
            rounded-md focus:outline-none focus:shadow`}
                value={value} type="text" onChange={(e) => onChange(e.target.value)}
                onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(value !== "")}/>
            {required && <p className="absolute -right-3 top-3 text-xl m:text-2xl">*</p>}
        </div>
    )
}

export default TitleInput