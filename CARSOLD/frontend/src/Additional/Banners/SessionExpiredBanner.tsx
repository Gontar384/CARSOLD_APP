import React from "react";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const SessionExpiredBanner: React.FC = () => {
    const {t} = useLanguage();

    return (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50">
            <div className="p-6 bg-white text-center rounded-sm shadow-lg">
                <p className="text-lg m:text-xl font-semibold">{t("sessionExpired1")}</p>
                <p className="mt-2 text-sm m:text-base">{t("sessionExpired2")}</p>
            </div>
        </div>
    );
}

export default SessionExpiredBanner;