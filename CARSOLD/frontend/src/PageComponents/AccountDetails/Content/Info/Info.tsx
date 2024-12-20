import React from "react";
import Version from "./Atomic/Version.tsx";
import Contact from "./Atomic/Contact.tsx";
import Socials from "./Atomic/Socials/Socials.tsx";

const Info: React.FC = () => {
    return (
        <div className="flex flex-col items-center w-full h-full text-center text-base xs:text-lg
        lg:text-xl xl:text-[22px] 2xl:text-[26px] 3xl:text-3xl bg-lowLime rounded-sm">
            <Version v={1.0}/>
            <Contact email="carsold384@gmail.com"/>
            <Socials/>
        </div>
    )
}

export default Info