import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const OptionsButton: React.FC = () => {

    const [iconAnimation, setIconAnimation] = useState<"animate-flip" | "animate-flipRev" | null>(null);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button

    const { lowerBar, setLowerBar } = useUtil();

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

    return (
        <button onClick={handleLowerBar} className="text-base xs:text-xl">
            <FontAwesomeIcon icon={faBars} className={`${iconAnimation}`}/>
        </button>
    )
}

export default OptionsButton