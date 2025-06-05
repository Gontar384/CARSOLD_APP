import React from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import ImageAndUsername from "./ImageAndUsername/ImageAndUsername.tsx";
import ChoiceHeaders from "./ChoiceHeaders/ChoiceHeaders.tsx";
import Content from "./Content/Content.tsx";

const AccountDetails: React.FC = () => {

    return (
        <LayOut>
            <div className={`flex flex-col items-center gap-8 m:gap-10 -mb-[200px] m:mb-0`}>
                <ImageAndUsername/>
                <div className="flex flex-col items-center w-full gap-8 m:gap-10">
                    <ChoiceHeaders/>
                    <Content/>
                </div>
            </div>
        </LayOut>
    )
}

export default AccountDetails