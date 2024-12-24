import React, {useState} from "react";

interface SubmitButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, onClick, disabled }) => {

    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [debounce, setDebounce] = useState<boolean>(false);

    const handleClick = () => {
        if (debounce) return;
        setDebounce(true);
        setIsClicked(true);
        onClick();
        setTimeout(() => {
            setDebounce(false);
            setIsClicked(false);
        }, 400)
    };

    return (
        <button
            className={`flex justify-center items-center relative w-24 xs:w-28 2xl:w-36 3xl:w-44 h-9 xs:h-10 2xl:h-11 3xl:h-12
            rounded-sm shadow-xl overflow-hidden`} onClick={handleClick} disabled={disabled}>
            <span className="z-10">{label}</span>
            <div className={`absolute inset-0 w-full h-full bg-black opacity-0 rounded-sm ${isClicked ? "animate-wave" : "hidden"}`}></div>
        </button>
    )
}

export default SubmitButton