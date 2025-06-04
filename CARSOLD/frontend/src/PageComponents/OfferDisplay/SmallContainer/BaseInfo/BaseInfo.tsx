import React from "react";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

interface BaseInfoProps {
    title: string;
    price: string;
    currency: string;
    createdOn: string;
}

const BaseInfo: React.FC<BaseInfoProps> = ({title, price, currency, createdOn}) => {
    const {t} = useLanguage();

    return (
        <div className="flex flex-col w-full m:w-[95%] mt-8 m:mt-10 px-4 m:px-5 py-6 m:py-7 gap-3 m:gap-4 bg-white
          border-y m:border-2 border-black border-opacity-40 m:rounded">
            <p className="text-3xl m:text-4xl break-words">{title}</p>
            <p className="text-2xl m:text-3xl text-coolRed font-bold">{price + " " + currency}</p>
            <p className="text-base m:text-lg">{t("offerDisplay6") + createdOn.replace(/\//g, "-")}</p>
        </div>
    )
};

export default BaseInfo