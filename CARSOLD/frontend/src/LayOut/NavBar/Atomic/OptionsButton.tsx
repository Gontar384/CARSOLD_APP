import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const OptionsButton: React.FC = () => {

    const [iconAnimation, setIconAnimation] = useState<"animate-flip" | "animate-flipRev" | null>(null);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button

    const { lowerBar, setLowerBar, midBar, setMidBar, mobileWidth } = useUtil();

    const handleLowerBar = () => {
        if (isDisabled) return;
        setIconAnimation((prev) =>
            prev === "animate-flip" ? "animate-flipRev" : "animate-flip");
        if (!lowerBar) {
            setLowerBar(true);
        } else {
            setLowerBar(false)
        }
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 300)
    }   //activates and hides lower bar

    const handleMidBar = () => {
        if (isDisabled) return;
        setIconAnimation((prev) =>
            prev === "animate-flip" ? "animate-flipRev" : "animate-flip");
        if (!midBar) {
            setMidBar(true);
        } else {
            setMidBar(false)
        }
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 300)
    }   //activates and hides mid-bar

    return (
        <button onClick={mobileWidth ? handleLowerBar : handleMidBar} className="text-lg m:text-[22px] ml-4">
            <FontAwesomeIcon icon={faBars} className={`${iconAnimation}`}/>
        </button>
    )
}

export default OptionsButton