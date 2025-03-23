import React from "react";

interface UserOffersLoaderProps {
    type: "myOffers" | "followed";
}

const UserOffersLoader: React.FC<UserOffersLoaderProps> = ({ type }) => {
    return (
        <div className={`w-[90%] m:w-[95%] max-w-[600px] bg-black opacity-20 animate-pulse
        ${type === "myOffers" ? "h-[138px] m:h-[173px]" : "h-[110px] m:h-[142px]"} mt-8 m:mt-10`}>
        </div>
    )
};

export default UserOffersLoader
