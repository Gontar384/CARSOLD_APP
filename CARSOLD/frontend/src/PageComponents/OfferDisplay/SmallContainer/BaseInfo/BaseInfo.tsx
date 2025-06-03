import React from "react";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

interface BaseInfoProps {
    title: string;
    price: string;
    currency: string;
    createdOn: string;
}

const BaseInfo: React.FC<BaseInfoProps> = ({ title, price, currency, createdOn }) => {
    const {t} = useLanguage();

    return (
      <>
          <div className="flex flex-col w-full m:w-[95%] mt-4 m:mt-6 mb-3 m:mb-4 p-4 m:p-5 gap-2 m:gap-3 bg-white
          border-y-2 m:border-2 border-black border-opacity-40 m:rounded">
              <p className="text-3xl m:text-4xl break-words">{title}</p>
              <p className="text-2xl m:text-3xl text-coolRed font-bold">{price + " " + currency}</p>
              <p className="text-base m:text-lg">{t("offerDisplay6") + createdOn.replace(/\//g, "-")}</p>
          </div>
      </>
  )
};

export default BaseInfo