import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {useLowerBar} from "./LowerBar/LowerBar.tsx";

const OptionsButton: React.FC = () => {

    const { handleLowerBar, iconAnimation }  = useLowerBar();

    return (
        <button onClick={handleLowerBar} className="text-base xs:text-xl">
            <FontAwesomeIcon icon={faBars} className={`${iconAnimation}`}/>
        </button>
    )
}

export default OptionsButton