import React from "react";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const LoadingNavBarLine: React.FC = () => {

    const {darkMode} = useUtil();

    return (
        <div className="absolute w-full h-[2px] m:h-[3px] mt-10 m:mt-11 bg-gray-400 overflow-hidden z-50">
            <div className={`h-full ${!darkMode ? "bg-black" : "bg-white"} animate-grow`}></div>
        </div>
    );
};

export default LoadingNavBarLine;