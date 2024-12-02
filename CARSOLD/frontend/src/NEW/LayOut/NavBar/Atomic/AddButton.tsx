import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React from "react";

const AddButton: React.FC = () => {
    return (
        <div className="flex flex-row items-center p-[1px] gap-1 border-2 border-solid border-black
        cursor-pointer hover:bg-white hover:rounded-sm">
            <FontAwesomeIcon icon={faPlus} className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"/>
            <p className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl whitespace-nowrap">
                Add Offer</p>
        </div>
    )
}

export default AddButton