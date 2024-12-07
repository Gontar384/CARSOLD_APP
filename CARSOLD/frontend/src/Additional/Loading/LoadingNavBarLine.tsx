import React from "react";

const LoadingNavBarLine: React.FC = () => {

    return (
        <div className="absolute w-full h-[2px] xs:h-[3px] 2xl:h-1 mt-7 xs:mt-8 sm:mt-9
        lg:mt-10 xl:mt-12 2xl:mt-[52px] 3xl:mt-14 bg-gray-400 overflow-hidden z-50">
            <div className="h-full bg-black animate-grow"></div>
        </div>
    );
};

export default LoadingNavBarLine;