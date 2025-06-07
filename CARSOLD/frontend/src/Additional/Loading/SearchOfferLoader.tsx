import React from "react";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const SearchOfferLoader: React.FC = () => {
    const {isMobile} = useUtil();

    return (
        <div className={`w-[90%] m:w-[95%] max-w-[700px] bg-black opacity-20 animate-pulse h-[133px]
        ${isMobile ? "m:h-[195px]" : "m:h-[163px]"} mt-8 m:mt-10`}></div>
    )
};

export default SearchOfferLoader