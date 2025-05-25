import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const Aside: React.FC = () => {
    const {t} = useLanguage();
    const {isMobile} = useUtil();
    const features = [t("aside1"), t("aside2"), t("aside3"), t("aside4"), t("aside5"), t("aside6"), t("aside7"),];

    return (
        <div className={`flex flex-col w-full h-full max-w-[750px] lg:max-w-[900px] text-xl m:text-2xl p-3 rounded-sm bg-lowLime
        bg-[url('https://storage.googleapis.com/carsold_app_images_test/config/AsideBackground.jpg')] bg-center bg-cover
        ${isMobile ? "border-y" : "border"} border-gray-300`}>
            <p className="text-center text-2xl m:text-3xl pb-3 font-bold">{t("aside8")}</p>
            {features.map((feature, index) => (
                <p key={index}>
                    <FontAwesomeIcon icon={faCheck}/> {feature}
                </p>
            ))}
            <p className="mb-80"></p>
        </div>
    )
}

export default Aside