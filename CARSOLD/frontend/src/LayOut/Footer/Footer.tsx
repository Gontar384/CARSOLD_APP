import React from "react";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const Footer: React.FC = () => {

    const {lowerBar, mobileWidth} = useUtil();

    return (
        <div className={`flex flex-col justify-center items-center w-full bg-lowLime shadow-top
        text-sm m:text-base py-2 m:py-3 ${lowerBar && mobileWidth ? "mb-14 animate-slideUp" : ""} `}>
            <div className="flex flex-row gap-[2px]">
                <p>Give feedback:</p>
                <p className="font-bold">carsold384@gmail.com</p>
            </div>
            <p className="mt-1">All rights reserved &copy;</p>
        </div>
    )
}

export default Footer