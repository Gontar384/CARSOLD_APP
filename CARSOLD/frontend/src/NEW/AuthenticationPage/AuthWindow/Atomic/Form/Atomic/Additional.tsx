import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash, IconDefinition} from "@fortawesome/free-solid-svg-icons";

interface AdditionalProps {
    setInputType?: React.Dispatch<React.SetStateAction<"password" | "text">>
}

const Additional: React.FC<AdditionalProps> = ({ setInputType }) => {

    const [eyeIcon, setEyeIcon] = useState<IconDefinition>(faEye);

    const toggleInput = () => {
        setInputType?.((prev) => prev === "password" ? "text" : "password");
        setEyeIcon(eyeIcon === faEye ? faEyeSlash : faEye);
    }   //changes password input

    return (
        <button className="absolute right-0 mt-2 xs:mt-3 2xl:mt-4 3xl:mt-5 cursor-pointer" onClick={toggleInput}>
            <FontAwesomeIcon icon={eyeIcon} className={`${eyeIcon === faEyeSlash ? "-mr-[1px] xs:-mr-[2px]" : ""} 
                                            text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl`}/>
        </button>
    )
}

export default Additional