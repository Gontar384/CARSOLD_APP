import React, {useState} from "react";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const CookieBanner: React.FC = () => {

    const [visible, setVisible] = useState<boolean>(true);
    const {lowerBar, mobileWidth} = useUtil();
    const {t} = useLanguage();

    const handleDismiss = () => {
        setVisible(false);
        localStorage.setItem('cookie-banner', 'accepted');
    };

    if (visible && !localStorage.getItem('cookie-banner')) {
        return (
            <div className={`fixed bottom-0 left-0 right-0 p-4 bg-gray-600 text-sm m:text-base text-white text-center z-50
             ${lowerBar && mobileWidth ? "bottom-14 transition-all duration-300 ease-out" : "bottom-0"} `}>
                <p>{t("cookieInfo")}</p>
                <button onClick={handleDismiss} className="mt-2 px-4 py-2 bg-lime text-black rounded-sm">
                    {t("cookieConfirm")}
                </button>
            </div>
        );
    }
};

export default CookieBanner;