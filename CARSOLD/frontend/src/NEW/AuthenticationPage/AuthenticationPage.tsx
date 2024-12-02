import LayOut from "../LayOut/LayOut.tsx";
import React from "react";
import AuthWindow from "./AuthWindow/AuthWindow.tsx";
import Aside from "./Aside/Aside.tsx";

const AuthenticationPage: React.FC = () => {
    return (
        <LayOut>
            <div className="flex-grow flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4 sm:gap-2
             md:gap-4 xl:gap-8 mt-12 xs:mt-14 sm:mt-16 lg:mt-[72px] xl:mt-20 2xl:mt-24 3xl:mt-28 xl:mb-14">
                <AuthWindow/>
                <Aside/>
            </div>
        </LayOut>
    )
}

export default AuthenticationPage