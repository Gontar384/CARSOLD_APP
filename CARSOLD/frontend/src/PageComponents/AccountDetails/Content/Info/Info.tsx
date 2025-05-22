import React from "react";
import Version from "./Atomic/Version.tsx";
import Contact from "./Atomic/Contact.tsx";
import Socials from "./Atomic/Socials/Socials.tsx";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

const Info: React.FC = () => {
    const {t} = useLanguage();
    document.title = `CARSOLD | ${t("tabTitle10")}`;

    return (
        <div className="flex flex-col items-center w-[95%] h-full text-center text-xl m:text-2xl rounded-sm">
            <Version v={1.0}/>
            <Contact email="carsold384@gmail.com"/>
            <Socials/>
        </div>
    )
}

export default Info