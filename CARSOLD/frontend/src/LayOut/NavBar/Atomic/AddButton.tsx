import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useButton} from "../../../CustomHooks/useButton.ts";
import {Link} from "react-router-dom";

const AddButton: React.FC = () => {
    const {buttonColor, bindHoverHandlers} = useButton();

    return (
        <Link className={`flex flex-row items-center px-[2px] gap-1 border-2 border-solid 
          border-black cursor-pointer rounded ${buttonColor ? "bg-white" : "bg-lime"}`}
                to={"/addingOffer"} {...bindHoverHandlers()}>
            <FontAwesomeIcon icon={faPlus} className="text-2xl"/>
            <p className="text-2xl whitespace-nowrap">
                Add offer
            </p>
        </Link>
    )
}

export default AddButton