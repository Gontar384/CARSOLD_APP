import React from "react";
import AuthWindow from "./AuthWindow/AuthWindow.tsx";
import Aside from "./Aside/Aside.tsx";
import LayOut from "../../LayOut/LayOut.tsx";

const Authentication: React.FC = () => {

    document.title = "CARSOLD | Authenticate";

    return (
        <LayOut>
            <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-4 sm:gap-2 md:gap-4 xl:gap-8">
                <AuthWindow/>
                <Aside/>
            </div>
        </LayOut>
    )
}

export default Authentication