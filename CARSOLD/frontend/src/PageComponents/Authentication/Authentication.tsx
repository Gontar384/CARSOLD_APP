import React from "react";
import AuthWindow from "./AuthWindow/AuthWindow.tsx";
import Aside from "./Aside/Aside.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const Authentication: React.FC = () => {
    const {bigWidth} = useUtil();
    const {t} = useLanguage();
    document.title = `CARSOLD | ${t("tabTitle4")}`;

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