import React from "react";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";

interface HeaderButtonProps {
    onClick: () => void;
    label: string;
    isGoogle?: boolean;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({onClick, isGoogle, label}) => {

    const { buttonColor, handleStart, handleEnd } = useButton();
    const {isMobile} = useUtil();

    return (
        <button className={`flex flex-row items-center justify-center w-full h-8 xs:h-9 2xl:h-11 3xl:h-[52px] shadow rounded-sm  
        ${buttonColor ? "bg-white" : "bg-lime"}`}
                onClick={onClick}
                onTouchStart={isMobile ? handleStart : undefined}
                onTouchEnd={isMobile ? handleEnd : undefined}
                onMouseEnter={!isMobile ? handleStart : undefined}
                onMouseLeave={!isMobile ? handleEnd : undefined}>
            {isGoogle ? <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                             alt='Google logo' className="w-5 h-5 xs:w-6 xs:h-6 2xl:w-8 2xl:h-8 3xl:w-9 3xl:h-9 mr-1"/> : null}
            {label}
        </button>
    )
}

export default HeaderButton