import React, {useEffect, useRef} from "react";
import ConfirmDeleteButton from "./Atomic/ConfirmDeleteButton.tsx";

interface ConfirmDeleteWindowProps {
    decision: boolean;
    setDecision: React.Dispatch<React.SetStateAction<boolean>>;
    onClick: () => void;
}

const ConfirmDeleteWindow: React.FC<ConfirmDeleteWindowProps> = ({ decision, setDecision, onClick }) => {
    const componentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (decision && componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setDecision(false);
            }
        }
        if (decision) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
    }, [decision])   //offs decision window when clicked outside

    return (
        <div className="flex justify-center items-center fixed inset-0 w-full h-full bg-black bg-opacity-40 z-50">
            <div className="flex flex-col items-center w-11/12 max-w-[500px] text-xl m:text-2xl
                    border-2 border-black bg-gray-200 rounded"
                 ref={componentRef}>
                <p className="mt-7 m:mt-8">Are you sure?</p>
                <div className="flex flex-row justify-center gap-12 m:gap-16 w-full my-7 m:my-8 text-white">
                    <ConfirmDeleteButton onClick={onClick} option="Yes"/>
                    <ConfirmDeleteButton onClick={() => setDecision(false)} option="No"/>
                </div>
            </div>
        </div>
    )
};

export default ConfirmDeleteWindow