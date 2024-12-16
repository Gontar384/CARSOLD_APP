import React from "react";
import ChoiceButton from "./Atomic/ChoiceButton.tsx";
import {useNavigate} from "react-router-dom";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const ChoiceHeaders: React.FC = () => {

    const {isWide} = useUtil();
    const navigate = useNavigate();

    const handleNavigation = (destination: "myOffers" | "followed" | "messages" | "settings" | "info") => {
        navigate(`/details/${destination}`);
    }

    return (
        <div className={`flex flex-col ${isWide ? "justify-start gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14"
                : "gap-2"}`}>
            <div className={`flex ${isWide ? "flex-col gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14"
                : "flex-row justify-evenly"}`}>
                <ChoiceButton label={"My Offers"} serial={0} onClick={() => handleNavigation("myOffers")}/>
                <ChoiceButton label={"Followed"} serial={1} onClick={() => handleNavigation("followed")}/>
                <ChoiceButton label={"Messages"} serial={2} onClick={() => handleNavigation("messages")}/>
            </div>
            <div className={`flex ${isWide ? "flex-col gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 3xl:gap-14"
                : "flex-row justify-evenly mx-[50px] xs:mx-[72px]"}`}>
                <ChoiceButton label={"Settings"} serial={3} onClick={() => handleNavigation("settings")}/>
                <ChoiceButton label={"Info"} serial={4} onClick={() => handleNavigation("info")}/>
            </div>
        </div>
    )
}

export default ChoiceHeaders