import React from "react";
import AuthWindow from "./AuthWindow/AuthWindow.tsx";
import Aside from "./Aside/Aside.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const Authentication: React.FC = () => {

    document.title = "CARSOLD | Authenticate";
    const {bigWidth} = useUtil();

    return (
        <LayOut>
            <div className={`flex ${bigWidth ? "flex-row items-start" : "flex-col items-center"} justify-center gap-16`}>
                <AuthWindow/>
                <Aside/>
            </div>
        </LayOut>
    )
}

export default Authentication