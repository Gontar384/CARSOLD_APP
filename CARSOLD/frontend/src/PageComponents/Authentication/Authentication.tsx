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
            <div className={`flex gap-16 ${bigWidth ? "flex-row items-start justify-center" : "flex-col items-center"}`}>
                <AuthWindow/>
                <Aside/>
            </div>
        </LayOut>
    )
}

export default Authentication