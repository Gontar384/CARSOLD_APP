import React, {useEffect} from "react";
import AuthWindow from "./AuthWindow/AuthWindow.tsx";
import Aside from "./Aside/Aside.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const Authentication: React.FC = () => {
    const {bigWidth} = useUtil();
    const {t} = useLanguage();

    useEffect(() => {
        document.title = `CARSOLD | ${t("tabTitle4")}`;
    }, [t]);

    return (
        <LayOut>
            <div className={`flex gap-12 m:gap-14 lg:gap-16 ${bigWidth ? "flex-row items-start justify-center" : "flex-col items-center"}`}>
                <h1 className="hidden">Authentication</h1>
                <AuthWindow/>
                <Aside/>
            </div>
        </LayOut>
    )
}

export default Authentication