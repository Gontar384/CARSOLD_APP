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
    //sets true where index of validSections === choice, creates array of true and false
    const buttonState: boolean[] = validSections.map((_, index) => index === choice);

    useEffect(() => {
        if (section && validSections.includes(section as never)) {
            const choiceIndex = validSections.indexOf(section as "myOffers" | "followed" | "messages" | "settings" | "info");
            setChoice(choiceIndex);
        }
    }, [section, navigate]);  //sets index to choice

    const handleNavigation = (destination: "myOffers" | "followed" | "messages" | "settings" | "info") => {
        navigate(`/details/${destination}`);
    }

    const LargeScreenLayout = () => (
        <div className="flex flex-row justify-evenly w-full">
            <ChoiceButton label={"My Offers"} onClick={() => handleNavigation("myOffers")} active={buttonState[0]}/>
            <ChoiceButton label={"Followed"} onClick={() => handleNavigation("followed")} active={buttonState[1]}/>
            <ChoiceButton label={"Messages"} onClick={() => handleNavigation("messages")} active={buttonState[2]}/>
            <ChoiceButton label={"Settings"} onClick={() => handleNavigation("settings")} active={buttonState[3]}/>
            <ChoiceButton label={"Info"} onClick={() => handleNavigation("info")} active={buttonState[4]}/>
        </div>
    );

    const SmallScreenLayout = () => (
        <div className="flex flex-col w-full gap-3 m:gap-4 items-center">
            <div className={`flex flex-row justify-evenly w-full max-w-[600px]`}>
                <ChoiceButton label={"My Offers"} onClick={() => handleNavigation("myOffers")} active={buttonState[0]}/>
                <ChoiceButton label={"Followed"} onClick={() => handleNavigation("followed")} active={buttonState[1]}/>
                <ChoiceButton label={"Messages"} onClick={() => handleNavigation("messages")} active={buttonState[2]}/>
            </div>
            <div className={`flex flex-row justify-evenly w-[67%] max-w-[400px]`}>
                <ChoiceButton label={"Settings"} onClick={() => handleNavigation("settings")} active={buttonState[3]}/>
                <ChoiceButton label={"Info"} onClick={() => handleNavigation("info")} active={buttonState[4]}/>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-[1200px]">
            {bigWidth ? <LargeScreenLayout/> : <SmallScreenLayout/>}
        </div>
    )
}

export default ChoiceHeaders