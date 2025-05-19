import React from "react";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";

interface ConfirmDeleteButtonProps {
    onClick: () => void;
    option: string;
}

const ConfirmDeleteButton: React.FC<ConfirmDeleteButtonProps> = ({ onClick, option }) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className={`w-[72px] m:w-20 border-2 border-white shadow rounded bg-gray-800 ${buttonColor && "brightness-150"}`}
        onClick={onClick} {...bindHoverHandlers()}>
            {option}
        </button>
    )
};

export default ConfirmDeleteButton
