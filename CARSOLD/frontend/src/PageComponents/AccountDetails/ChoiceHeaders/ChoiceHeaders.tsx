import React, {useEffect, useState} from "react";
import ChoiceButton from "./Atomic/ChoiceButton.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const ChoiceHeaders: React.FC = () => {

    const {mobileWidth} = useUtil();
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
        <div className={`flex flex-col ${!mobileWidth ? "justify-start gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14"
                : "gap-2"}`}>
            <div className={`flex ${!mobileWidth ? "flex-col gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14"
                : "flex-row justify-evenly"}`}>
                <ChoiceButton label={"My Offers"} onClick={() => handleNavigation("myOffers")} active={buttonState[0]}/>
                <ChoiceButton label={"Followed"} onClick={() => handleNavigation("followed")} active={buttonState[1]}/>
                <ChoiceButton label={"Messages"} onClick={() => handleNavigation("messages")} active={buttonState[2]}/>
            </div>
            <div className={`flex ${!mobileWidth ? "flex-col gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14"
                : "flex-row justify-evenly mx-[50px] xs:mx-[72px]"}`}>
                <ChoiceButton label={"Settings"} onClick={() => handleNavigation("settings")} active={buttonState[3]}/>
                <ChoiceButton label={"Info"} onClick={() => handleNavigation("info")} active={buttonState[4]}/>
            </div>
        </div>
    )
}

export default ChoiceHeaders