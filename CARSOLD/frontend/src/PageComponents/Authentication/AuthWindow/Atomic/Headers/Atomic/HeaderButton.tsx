import React from "react";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";

interface HeaderButtonProps {
    onClick: () => void;
    label: string;
    isGoogle?: boolean;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({onClick, isGoogle, label}) => {

    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();

    return (
        <button className={`flex flex-row items-center justify-center w-full h-10 m:h-11 text-xl m:text-2xl   
        ${buttonColor ? "bg-white" : "bg-lime"} shadow rounded-sm`}
                onClick={onClick}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}>
            {isGoogle ? <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                             alt='Google logo' className="w-6 h-6 m:w-7 m:h-7 mr-1"/> : null}
            {label}
        </button>
    )
}

export default HeaderButton