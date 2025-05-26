import React, {SetStateAction, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

interface OptionsButtonProps {
    excludedButtonRef: React.RefObject<HTMLButtonElement | null>;
    iconAnimation: "animate-flip" | "animate-flipRev" | null;
    setIconAnimation: React.Dispatch<SetStateAction<"animate-flip" | "animate-flipRev" | null>>;
}

const OptionsButton: React.FC<OptionsButtonProps> = ({excludedButtonRef, iconAnimation, setIconAnimation}) => {

    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {lowerBar, setLowerBar, midBar, setMidBar, mobileWidth, midWidth} = useUtil();

    const handleBar = (bar: boolean, setBar: React.Dispatch<SetStateAction<boolean>>) => {
        if (isDisabled) return;

        setIconAnimation(mobileWidth && lowerBar || midWidth && midBar ? "animate-flipRev" : "animate-flip");

        if (!bar) setBar(true);
        else setBar(false)

        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 300)
    }

    return (
        <button className="text-lg m:text-xl px-2.5 py-1.5 ml-1.5" ref={excludedButtonRef}
                onClick={mobileWidth ? () => handleBar(lowerBar, setLowerBar) : () => handleBar(midBar, setMidBar)}>
            <FontAwesomeIcon icon={faBars} className={`${iconAnimation}`}/>
        </button>
    )
}

export default OptionsButton