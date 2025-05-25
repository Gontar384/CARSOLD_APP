import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useButton} from "../../../CustomHooks/useButton.ts";
import {Link} from "react-router-dom";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";

const AddButton: React.FC = () => {
    const {buttonColor, bindHoverHandlers} = useButton();
    const {t} = useLanguage();

    return (
        <Link className={`flex flex-row items-center justify-center w-[165px] gap-1 border-2 border-solid border-black
        cursor-pointer rounded ${buttonColor ? "bg-white" : "bg-lime"}`} to={"/addingOffer"} {...bindHoverHandlers()}>
            <FontAwesomeIcon icon={faPlus} className="text-2xl"/>
            <p className="text-2xl whitespace-nowrap">
                {t("addButton")}
            </p>
        </Link>
    )
}

export default AddButton