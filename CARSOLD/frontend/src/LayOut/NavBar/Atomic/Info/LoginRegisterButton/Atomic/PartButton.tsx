import React from "react";
import {useButton} from "../../../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";
import {Link} from "react-router-dom";

interface PartButtonProps {
    title: "Login" | "Register";
    path: "login" | "register"
}

const PartButton: React.FC<PartButtonProps> = ({title, path}) => {

    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();

    return (
        <Link to={`/authenticate/${path}`} className={`${buttonColor ? "text-white" : "text-black"}`}
              onMouseEnter={!isMobile ? handleStart : undefined}
              onMouseLeave={!isMobile ? handleEnd : undefined}
              onTouchStart={isMobile ? handleStart : undefined}
              onTouchEnd={isMobile ? handleEnd : undefined}>
            {title}
        </Link>
    )
}

export default PartButton