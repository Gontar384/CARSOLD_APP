import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MyOffers from "./MyOffers/MyOffers.tsx";
import Followed from "./Followed/Followed.tsx";
import Messages from "./Messages/Messages.tsx";
import Settings from "./Settings/Settings.tsx";
import Info from "./Info/Info.tsx";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const Content: React.FC = () => {

    const {section} = useParams();
    const navigate = useNavigate();
    const {mobileWidth} = useUtil();

    const [choice, setChoice] = useState<"myOffers" | "followed" | "messages" | "settings" | "info">("myOffers");
    const [isLoading, setIsLoading] = useState<boolean>(true);   //prevent blinking

    useEffect(() => {
        const validSections: Array<"myOffers" | "followed" | "messages" | "settings" | "info"> = [
            "myOffers", "followed", "messages", "settings", "info"];
        if (section && validSections.includes(section as never)) {
            setChoice(section as "myOffers" | "followed" | "messages" | "settings" | "info");
            setIsLoading(false);
        } else {
            navigate("/details/myOffers", {replace: true});
        }
    }, [section, navigate])   //navigates when section changes

    if (isLoading) {
        return null;
    }

    return (
        <div className={`flex flex-col w-full rounded-sm justify-center items-center border max-w-[1200px]border-black border-opacity-40
         ${!mobileWidth ? "" : "justify-center items-center min-h-72 xs:min-h-80 max-h-[720px]"}`}>
            {choice === "myOffers" ? <MyOffers/>
            : choice === "followed" ? <Followed/>
            : choice === "messages" ? <Messages/>
            : choice === "settings" ? <Settings/>
            : choice === "info" ? <Info/> : null}
        </div>
    )
}

export default Content