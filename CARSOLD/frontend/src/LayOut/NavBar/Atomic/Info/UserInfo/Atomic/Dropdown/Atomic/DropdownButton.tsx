import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {Link, useNavigate} from "react-router-dom";
import {useButton} from "../../../../../../../../CustomHooks/useButton.ts";

interface DropdownButtonProps {
    label: string;
    path: string;
    count?: number;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ label, path, count }) => {
    const navigate = useNavigate();
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <Link className={`flex items-center justify-center w-full h-9 ${buttonColor ? "bg-white" : "bg-lime"}`}
              to={path} onKeyDown={(event) => {if (event.key === "Enter") navigate(path)}} {...bindHoverHandlers()}>
            <span className="text-xl">{label}</span>
            {count && count > 0 ? <div className="relative ml-1 flex">
                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}} className={`${count > 99 ? "text-[28px]" : "text-[24px]"}`}/>
                <p className={`${count > 99 ? "top-1 right-0.5" : "inset-0.5"} m-auto text-center text-sm text-white absolute`}>
                    {count}
                </p>
            </div> : null}
        </Link>
    )
}

export default DropdownButton