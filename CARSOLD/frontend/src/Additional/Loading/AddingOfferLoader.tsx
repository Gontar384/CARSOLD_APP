import React from "react";
import LoadingPicAnimation from "./LoadingPicAnimation.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const AddingOfferLoader: React.FC = () => {
    const {isMobile} = useUtil();

    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-lowBlack opacity-30">
            <div className="w-[100px]">
                <LoadingPicAnimation size={isMobile ? 100 : 140}/>
            </div>
        </div>
    );
};

export default AddingOfferLoader