import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MyOffers from "./MyOffers/MyOffers.tsx";
import Followed from "./Followed/Followed.tsx";
import Messages from "./Messages/Messages.tsx";
import Settings from "./Settings/Settings.tsx";
import Info from "./Info/Info.tsx";
import ContentLoader from "../../../Additional/Loading/ContentLoader.tsx";
import Admin from "./Admin/Admin.tsx";

const Content: React.FC = () => {
    const {section} = useParams();
    const navigate = useNavigate();

    const [choice, setChoice] = useState<"myOffers" | "followed" | "messages" | "settings" | "info" | "admin">("myOffers");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const validSections: Array<"myOffers" | "followed" | "messages" | "settings" | "info" | "admin"> = [
            "myOffers", "followed", "messages", "settings", "info", "admin"];

        if (section && validSections.includes(section as never)) {
            setChoice(section as "myOffers" | "followed" | "messages" | "settings" | "info" | "admin");
            setIsLoading(false);
        } else {
            navigate("/details/myOffers", {replace: true});
        }
    }, [section, navigate])   //navigates when section changes

    if (isLoading) return <ContentLoader/>

    return (
        <div className="flex flex-col items-center w-full xl:rounded max-w-[1400px] min-h-[710px] m:min-h-[870px]
        bg-lowLime border-gray-300 border-y xl:border">
            {choice === "myOffers" ? <MyOffers/>
            : choice === "followed" ? <Followed/>
            : choice === "messages" ? <Messages/>
            : choice === "settings" ? <Settings/>
            : choice === "info" ? <Info/>
            : choice === "admin" ? <Admin/> : null}
        </div>
    )
}

export default Content