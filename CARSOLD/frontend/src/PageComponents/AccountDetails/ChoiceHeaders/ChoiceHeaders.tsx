import React, {useEffect, useState} from "react";
import ChoiceButton from "./Atomic/ChoiceButton.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";
import {useUserInfo} from "../../../CustomHooks/useUserInfo.ts";
import {useMessages} from "../../../GlobalProviders/Messages/useMessages.ts";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";

const ChoiceHeaders: React.FC = () => {

    const {bigWidth} = useUtil();
    const navigate = useNavigate();
    const {section} = useParams();
    const [choice, setChoice] = useState<number | null>(null);
    const validSections: Array<"myOffers" | "followed" | "messages" | "settings" | "info" | "admin"> = [
        "myOffers", "followed", "messages", "settings", "info", "admin"
    ];
    //sets true where index of validSections === choice, creates array of true and false
    const buttonState: boolean[] = validSections.map((_, index) => index === choice);
    const {handleCheckAdmin} = useUserInfo();
    const [admin, setAdmin] = useState<boolean>(false);
    const {unseenMessagesCount} = useMessages();
    const {t} = useLanguage();

    useEffect(() => {
        const manageCheckAdmin = async () => {
            const isAdmin = await handleCheckAdmin();
            setAdmin(isAdmin);
        };
        manageCheckAdmin();
    }, []); //checks if user is admin

    useEffect(() => {
        if (section && validSections.includes(section as never)) {
            const choiceIndex = validSections.indexOf(section as "myOffers" | "followed" | "messages" | "settings" | "info" | "admin");
            setChoice(choiceIndex);
        }
    }, [section, navigate]);  //sets index to choice

    const handleNavigation = (destination: "myOffers" | "followed" | "messages" | "settings" | "info" | "admin") => {
        navigate(`/details/${destination}`);
    }

    const LargeScreenLayout = () => (
        <div className="flex flex-row justify-evenly w-full">
            <ChoiceButton label={t("choiceButton1")} onClick={() => handleNavigation("myOffers")} active={buttonState[0]}/>
            <ChoiceButton label={t("choiceButton2")} onClick={() => handleNavigation("followed")} active={buttonState[1]}/>
            <ChoiceButton label={t("choiceButton3")} onClick={() => handleNavigation("messages")} active={buttonState[2]} count={unseenMessagesCount}/>
            <ChoiceButton label={t("choiceButton4")} onClick={() => handleNavigation("settings")} active={buttonState[3]}/>
            <ChoiceButton label={t("choiceButton5")} onClick={() => handleNavigation("info")} active={buttonState[4]}/>
            {admin && <ChoiceButton label={"Admin"} onClick={() => handleNavigation("admin")} active={buttonState[5]}/>}
        </div>
    );

    const SmallScreenLayout = () => (
        <div className="flex flex-col w-full gap-3 m:gap-4 items-center">
            <div className={`flex flex-row justify-evenly w-full max-w-[600px]`}>
                <ChoiceButton label={t("choiceButton1")} onClick={() => handleNavigation("myOffers")} active={buttonState[0]}/>
                <ChoiceButton label={t("choiceButton2")} onClick={() => handleNavigation("followed")} active={buttonState[1]}/>
                <ChoiceButton label={t("choiceButton3")} onClick={() => handleNavigation("messages")} active={buttonState[2]} count={unseenMessagesCount}/>
            </div>
            <div className={`flex flex-row justify-evenly ${admin ? "w-full max-w-[600px]" : "w-[67%] max-w-[400px]"}`}>
                <ChoiceButton label={t("choiceButton4")} onClick={() => handleNavigation("settings")} active={buttonState[3]}/>
                <ChoiceButton label={t("choiceButton5")} onClick={() => handleNavigation("info")} active={buttonState[4]}/>
                {admin && <ChoiceButton label={"Admin"} onClick={() => handleNavigation("admin")} active={buttonState[5]}/>}
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