import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useButton} from "../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const AddButton: React.FC = () => {

    const { buttonColor, handleStart, handleEnd } = useButton();
    const {isMobile} = useUtil();

    return (
        <button className={'flex flex-row items-center p-[1px] gap-1 border-2 border-solid border-black ' +
            `cursor-pointer rounded ${buttonColor ? "bg-white" : "bg-lime"}`}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}>
            <FontAwesomeIcon icon={faPlus} className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"/>
            <p className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl whitespace-nowrap">
                Add Offer</p>
        </button>
    )
}

export default AddButton