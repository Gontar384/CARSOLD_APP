import React from "react";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const Footer: React.FC = () => {
    const {lowerBar, mobileWidth} = useUtil();
    const {t} = useLanguage();

    return (
        <footer className={`flex flex-col justify-center items-center w-full bg-lowLime shadow-top truncate
        text-sm m:text-base py-2 m:py-3 ${lowerBar && mobileWidth ? "mb-14 animate-slideUp" : ""} `}>
            <div className="flex flex-row gap-[2px]">
                <p>{t("footer1")}</p>
                <p className="font-bold">{import.meta.env.VITE_CONTACT_EMAIL}</p>
            </div>
            <p className="mt-1">{t("footer2")} &copy;</p>
        </footer>
    )
}

export default Footer