import React, {useEffect, useRef} from "react";
import ConfirmDeleteButton from "./Atomic/ConfirmDeleteButton.tsx";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

interface ConfirmDeleteWindowProps {
    decision: boolean;
    setDecision: React.Dispatch<React.SetStateAction<boolean>>;
    onClick: () => void;
    deleteType: "user" | "offer";
}

const ConfirmDeleteWindow: React.FC<ConfirmDeleteWindowProps> = ({ decision, setDecision, onClick, deleteType }) => {
    const componentRef = useRef<HTMLDivElement | null>(null);
    const {t} = useLanguage();

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
            <div className="flex flex-col items-center w-11/12 max-w-[500px]
                 border-2 border-black bg-gray-200 rounded" ref={componentRef}>
                <p className="mt-5 m:mt-6 font-bold text-base m:text-lg">
                    {deleteType === "offer" ? t("confirmDeleteWindow4") : t("confirmDeleteWindow5")}
                </p>
                <p className="mt-2 m:mt-3 text-xl m:text-2xl">{t("confirmDeleteWindow1")}</p>
                <div className="flex flex-row justify-center gap-12 m:gap-14 w-full mt-5 m:mt-6 mb-7 m:mb-8 text-white text-xl m:text-2xl">
                    <ConfirmDeleteButton onClick={onClick} option={t("confirmDeleteWindow2")}/>
                    <ConfirmDeleteButton onClick={() => setDecision(false)} option={t("confirmDeleteWindow3")}/>
                </div>
            </div>
        </div>
    )
};

export default ConfirmDeleteWindow