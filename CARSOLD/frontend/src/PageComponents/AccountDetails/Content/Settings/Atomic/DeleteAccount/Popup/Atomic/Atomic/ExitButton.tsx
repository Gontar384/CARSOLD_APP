import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../../../../../../CustomHooks/useButton.ts";

interface ExitButtonProps {
    onClick: () => void;
}

const ExitButton: React.FC<ExitButtonProps> = ({onClick}) => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <button className="flex justify-center items-center absolute top-0 right-1"
                onClick={onClick} {...bindHoverHandlers()}>
            <FontAwesomeIcon className="text-2xl m:text-3xl" icon={faXmark} style={{color: buttonColor ? "white" : "black"}}/>
        </button>
    )
}

export default ExitButton