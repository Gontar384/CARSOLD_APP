import React from "react";

interface BaseInfoProps {
    title: string;
    price: string;
    currency: string;
    createdOn: string;
}

const BaseInfo: React.FC<BaseInfoProps> = ({ title, price, currency, createdOn }) => {

    return (
      <>
          <div className="flex flex-col my-4 m:my-6 p-4 m:p-5 gap-2 m:gap-3">
              <p className="text-3xl m:text-4xl">{title}</p>
              <p className="text-2xl m:text-3xl text-coolRed font-bold">{price + " " + currency}</p>
              <p className="text-base m:text-lg">{"Added on " + createdOn.replace(/\//g, "-")}</p>
          </div>
      </>
  )
};

export default BaseInfo