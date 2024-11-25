import React from "react";
import {useUtil} from "../../GlobalProviders/UtilProvider.tsx";

//specifies props
interface LoginBannerProps {
    text: string;
}

//animated banner which pops when user logs in and when user changes password
//short-time banner, no disappearing mechanism
const ShortNoDisappearBanner: React.FC<LoginBannerProps> = ({text}: {text: string}) => {

    //global states to adapt banner to lower bar and window size
    const { lowerBar, isWide } = useUtil(); // Access global state

    return (
        <div className={`flex justify-center items-center fixed ${lowerBar && !isWide ? "bottom-10 xs:bottom-11 transition-all duration-300 ease-out" : "bottom-0"} sm:bottom-0 left-0 
         right-0 h-12 xs:h-14 lg:h-16 2xl:h-[70px] bg-gradient-to-r from-lowLime to-lowLime via-lime z-50 
         border-t-2 border-white rounded-t-2xl shadow-top animate-slideIn`}>
            <p className="p-4 text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">{text}</p>
        </div>
    )
}

export default ShortNoDisappearBanner;