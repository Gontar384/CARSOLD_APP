import React, {useState} from "react";

const SwitchButton: React.FC = () => {

    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideOn" | "animate-slideOff" | null>(null);

    const handleActivateButton = () => {
        setButtonAnimation(prev => prev === null ? "animate-slideOn" : prev === "animate-slideOn" ? "animate-slideOff" : "animate-slideOn");
    }

    const [test, setTest] = useState<boolean>(true);

    return (
        <button className={`flex items-center justify-center w-9 h-5 scale-[110%] lg:scale-[120%]
        xl:scale-[130%] 2xl:scale-[145%] 3xl:scale-[155%] border border-black border-opacity-40
        rounded-full transition-all duration-300 ${buttonAnimation === "animate-slideOn" ? "bg-lime" : "bg-gray-300"}`}
                onClick={handleActivateButton}>
            <div className="w-[calc(100%-3px)] h-[calc(100%-3px)] rounded-full">
                <div className={`h-full ${test ? "transform translate-x-[104%]" : ""} aspect-square bg-white border
                border-black border-opacity-5 rounded-full ${buttonAnimation}`}></div>
            </div>
        </button>
    )
}

export default SwitchButton