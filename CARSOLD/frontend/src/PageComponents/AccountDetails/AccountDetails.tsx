import React from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import ImageAndUsername from "./ImageAndUsername/ImageAndUsername.tsx";
import {useUtil} from "../../GlobalProviders/UtilProvider.tsx";
import ChoiceHeaders from "./ChoiceHeaders/ChoiceHeaders.tsx";
import Content from "./Content/Content.tsx";

const AccountDetails: React.FC = () => {

    const { isWide } = useUtil();

    document.title = "CARSOLD | Account Details";

    return (
        <LayOut>
            <div className="flex flex-col items-center h-screen gap-20 mt-20 xs:mt-24 sm:mt-16 2xl:mt-10">
                <ImageAndUsername/>
                <div className={`flex ${isWide ? "flex-row w-11/12 sm:max-w-[700px] lg:max-w-[900px]" +
                    " xl:max-w-[1050px] 2xl:max-w-[1300px] 3xl:max-w-[1400px]" : "flex-col w-11/12 max-w-[530px]"}`}>
                    <ChoiceHeaders/>
                    <Content/>
                </div>
            </div>
        </LayOut>
    )
}

export default AccountDetails