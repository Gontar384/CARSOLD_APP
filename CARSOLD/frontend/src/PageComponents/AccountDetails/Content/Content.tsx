import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MyOffers from "./MyOffers/MyOffers.tsx";
import Followed from "./Followed/Followed.tsx";
import Messages from "./Messages/Messages.tsx";
import Settings from "./Settings/Settings.tsx";
import Info from "./Info/Info.tsx";
import ContentLoader from "../../../SharedComponents/Additional/Loading/ContentLoader.tsx";

const Content: React.FC = () => {

    const {section} = useParams();
    const navigate = useNavigate();

    const [choice, setChoice] = useState<"myOffers" | "followed" | "messages" | "settings" | "info">("myOffers");
    const [isLoading, setIsLoading] = useState<boolean>(true);  //prevents blinking

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
        return <ContentLoader/>
    }

    return (
        <div className="flex flex-col w-full rounded-sm justify-center items-center
        max-w-[1500px] min-h-[550px] bg-lowLime border border-black border-opacity-40">
            {choice === "myOffers" ? <MyOffers/>
            : choice === "followed" ? <Followed/>
            : choice === "messages" ? <Messages/>
            : choice === "settings" ? <Settings/>
            : choice === "info" ? <Info/> : null}
        </div>
    )
}

export default Content