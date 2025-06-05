import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";

const Aside: React.FC = () => {
    const {t} = useLanguage();
    const features = [t("aside1"), t("aside2"), t("aside3"), t("aside4"), t("aside5"), t("aside6"), t("aside7"),];

    return (
        <aside className="flex flex-col w-full h-full max-w-[750px] lg:max-w-[900px] p-3 sm:rounded bg-lowLime
        bg-[url('https://storage.googleapis.com/carsold-app-imgs-test/config/AsideBackground.jpg')] bg-center bg-cover
        border-y sm:border border-gray-300">
            <h2 className="text-center text-2xl m:text-3xl mb-3 mt-2 font-bold">{t("aside8")}</h2>
            <ul className="list-none">
                {features.map((feature, index) => (
                    <li key={index} className="text-xl m:text-2xl">
                        <FontAwesomeIcon icon={faCheck}/> {feature}
                    </li>
                ))}
            </ul>
            <p className="mb-80"></p>
        </aside>
    )
}

export default Aside