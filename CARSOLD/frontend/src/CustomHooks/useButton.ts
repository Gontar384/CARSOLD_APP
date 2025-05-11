import {useState} from "react";
import {useUtil} from "../GlobalProviders/Util/useUtil.ts";

export const useButton = () => {
    const {isMobile} = useUtil();
    const [buttonColor, setButtonsColor] = useState<boolean>(false);

    const handleStart = () => setButtonsColor(true);
    const handleEnd = () => setButtonsColor(false);

    const bindHoverHandlers = () => ({
        ...(isMobile
            ? {
                onTouchStart: handleStart,
                onTouchEnd: handleEnd,
            }
            : {
                onMouseEnter: handleStart,
                onMouseLeave: handleEnd,
            }),
    });

    return {buttonColor, bindHoverHandlers}
}