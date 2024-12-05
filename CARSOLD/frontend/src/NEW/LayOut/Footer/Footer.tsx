import {useUtil} from "../../../GlobalProviders/UtilProvider.tsx";
import React from "react";

const Footer: React.FC = () => {

    const { lowerBar, isWide } = useUtil();

    return (
        <div className={`flex flex-col justify-center items-center w-full bg-lowLime shadow-top mt-16 xs:mt-20 sm:mt-28 md:mt-32
         lg:mt-36 xl:mt-40 2xl:mt-44 3xl:mt-48 text-[10px] xs:text-xs 2xl:text-sm 3xl:text-base p-1 xs:p-2 2xl:p-3 3xl:p-[14px]
         ${lowerBar && !isWide ? "mb-10 xs:mb-11 animate-slideUp" : ""} `}>
            <div className="flex flex-row gap-[2px]">
                <p>Give feedback:</p>
                <p className="font-bold">carsold384@gmail.com</p>
            </div>
            <p className="mt-1 xs:mt-[6px] 2xl:mt-2">All rights reserved &copy;</p>
        </div>
    )
}

export default Footer