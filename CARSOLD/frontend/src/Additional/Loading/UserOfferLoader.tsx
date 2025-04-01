import React from "react";

interface UserOffersLoaderProps {
    type: "myOffers" | "followed";
}

const UserOfferLoader: React.FC<UserOffersLoaderProps> = ({ type }) => {
    return (
        <div className={`w-[90%] m:w-[95%] max-w-[700px] bg-black opacity-20 animate-pulse
        ${type === "myOffers" ? "h-[161px] m:h-[194px]" : "h-[133px] m:h-[163px]"} mt-8 m:mt-10`}>
        </div>
    )
};

export default UserOfferLoader
