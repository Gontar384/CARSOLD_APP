import React, {useState} from "react";

const SwitchButton: React.FC = () => {

    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideOn" | "animate-slideOff" | null>(null);

    const handleActivateButton = () => {
        setButtonAnimation(prev => prev === null ? "animate-slideOn" : prev === "animate-slideOn" ? "animate-slideOff" : "animate-slideOn");
    }

    return (
        <div className="w-12 h-6  rounded-full border border-black border-opacity-50">
            <button className="w-full h-full bg-white rounded-full"
            onClick={handleActivateButton}>
                <div className={`w-5 h-5 ml-[1px] rounded-full border border-black border-opacity-5 bg-lime ${buttonAnimation}`}></div>
            </button>
        </div>
    )
}

export default SwitchButton