import React, {useEffect, useState} from "react";
import ChoiceButton from "./Atomic/ChoiceButton.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const ChoiceHeaders: React.FC = () => {

    const {bigWidth} = useUtil();
    const navigate = useNavigate();

    const {section} = useParams();
    const [choice, setChoice] = useState<number | null>(null);

    const validSections: Array<"myOffers" | "followed" | "messages" | "settings" | "info"> = [
        "myOffers", "followed", "messages", "settings", "info"
    ];

    useEffect(() => {
        if (section && validSections.includes(section as never)) {
            const choiceIndex = validSections.indexOf(section as "myOffers" | "followed" | "messages" | "settings" | "info");
            setChoice(choiceIndex);
        }
    }, [section, navigate]);  //sets index to choice

    //sets true where index of validSections === choice, creates array of true and false
    const buttonState: boolean[] = validSections.map((_, index) => index === choice);

    const handleNavigation = (destination: "myOffers" | "followed" | "messages" | "settings" | "info") => {
        navigate(`/details/${destination}`);
    }

    return (
        <div className={`flex w-full ${bigWidth ? "flex-row justify-evenly max-w-[1200px]" : "flex-col items-center max-w-[400px] m:max-w-[600px] gap-3 m:gap-4 "}`}>
            <div className={`flex flex-row justify-evenly ${bigWidth ? " w-[60%]" : "w-full"}`}>
                <ChoiceButton label={"My Offers"} onClick={() => handleNavigation("myOffers")} active={buttonState[0]}/>
                <ChoiceButton label={"Followed"} onClick={() => handleNavigation("followed")} active={buttonState[1]}/>
                <ChoiceButton label={"Messages"} onClick={() => handleNavigation("messages")} active={buttonState[2]}/>
            </div>
            <div className={`flex flex-row justify-evenly ${bigWidth ? "w-[40%]" : "w-[67%]"}`}>
                <ChoiceButton label={"Settings"} onClick={() => handleNavigation("settings")} active={buttonState[3]}/>
                <ChoiceButton label={"Info"} onClick={() => handleNavigation("info")} active={buttonState[4]}/>
            </div>
        </div>
    )
}

export default ChoiceHeaders