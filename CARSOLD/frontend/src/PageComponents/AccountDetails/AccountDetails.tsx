import React from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import ImageAndUsername from "./ImageAndUsername/ImageAndUsername.tsx";
import ChoiceHeaders from "./ChoiceHeaders/ChoiceHeaders.tsx";
import Content from "./Content/Content.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const AccountDetails: React.FC = () => {

    const { mobileWidth } = useUtil();

    document.title = "CARSOLD | Account UsernameAndPic";

    return (
        <LayOut>
            <div className={'flex flex-col items-center h-screen gap-6 xs:gap-7 sm:gap-6 lg:gap-7 ' +
                `xl:gap-8 2xl:gap-10 3xl:gap-12 -mt-3 ${!mobileWidth ? "" : "mb-64"}`}>
                <ImageAndUsername/>
                <div className={`flex ${!mobileWidth ? "flex-row w-11/12 gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 3xl:gap-6" +
                    " sm:max-w-[700px] lg:max-w-[900px] xl:max-w-[1050px] 2xl:max-w-[1300px] 3xl:max-w-[1400px]" 
                    : "flex-col w-11/12 max-w-[530px] gap-4 xs:gap-5"}`}>
                    <ChoiceHeaders/>
                    <Content/>
                </div>
            </div>
        </LayOut>
    )
}

export default AccountDetails