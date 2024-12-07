import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useButton} from "../../CustomHooks/UseButton.ts";

const AddButton: React.FC = () => {

    const { buttonColor, handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave } = useButton();

    return (
        <button className={'flex flex-row items-center p-[1px] gap-1 border-2 border-solid border-black ' +
            `cursor-pointer rounded ${buttonColor[0] === "black" ? "bg-lime" : "bg-white"}`}
                onTouchStart={() => handleTouchStart(0)} onTouchEnd={() => handleTouchEnd(0)}
                onMouseEnter={() => handleMouseEnter(0)} onMouseLeave={() => handleMouseLeave(0)}>
            <FontAwesomeIcon icon={faPlus} className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"/>
            <p className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl whitespace-nowrap">
                Add Offer</p>
        </button>
    )
}

export default AddButton