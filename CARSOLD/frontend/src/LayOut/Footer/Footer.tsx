import React from "react";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const Footer: React.FC = () => {

    const { lowerBar, mobileWidth } = useUtil();

    return (
        <div className={`flex flex-col justify-center items-center w-full bg-lowLime shadow-top mt-20 m:mt-48 text-xs m:text-sm p-2 m:p-3
         ${lowerBar && mobileWidth ? "mb-12 animate-slideUp" : ""} `}>
            <div className="flex flex-row gap-[2px]">
                <p>Give feedback:</p>
                <p className="font-bold">carsold384@gmail.com</p>
            </div>
            <p className="mt-1 m:mt-2">All rights reserved &copy;</p>
        </div>
    )
}

export default Footer