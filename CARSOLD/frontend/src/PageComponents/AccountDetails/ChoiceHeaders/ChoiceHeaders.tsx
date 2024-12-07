import React from "react";
import {useUtil} from "../../../GlobalProviders/UtilProvider.tsx";
import ChoiceButton from "./Atomic/ChoiceButton.tsx";
import {useNavigate} from "react-router-dom";

const ChoiceHeaders: React.FC = () => {

    const {isWide} = useUtil();
    const navigate = useNavigate();

    const handleNavigation = (destination: "myOffers" | "followed" | "messages" | "settings" | "info") => {
        navigate(`/myAccount/${destination}`);
    }

    return (
        <div className={`flex flex-col ${isWide ? "justify-start gap-9 lg:gap-[48px] xl:gap-[58px] 2xl:gap-[64px] 3xl:gap-[68px]"
                : "gap-2"}`}>
            <div className={`flex ${isWide ? "flex-col gap-9 lg:gap-[48px] xl:gap-[58px] 2xl:gap-[64px] 3xl:gap-[68px]"
                : "flex-row justify-evenly"}`}>
                <ChoiceButton label={"My Offers"} serial={0} onClick={() => handleNavigation("myOffers")}/>
                <ChoiceButton label={"Followed"} serial={1} onClick={() => handleNavigation("followed")}/>
                <ChoiceButton label={"Messages"} serial={2} onClick={() => handleNavigation("messages")}/>
            </div>
            <div className={`flex ${isWide ? "flex-col gap-9 lg:gap-[48px] xl:gap-[58px] 2xl:gap-[64px] 3xl:gap-[68px]"
                : "flex-row justify-evenly mx-[50px] xs:mx-[72px]"}`}>
                <ChoiceButton label={"Settings"} serial={3} onClick={() => handleNavigation("settings")}/>
                <ChoiceButton label={"Info"} serial={4} onClick={() => handleNavigation("info")}/>
            </div>
        </div>
    )
}

export default ChoiceHeaders