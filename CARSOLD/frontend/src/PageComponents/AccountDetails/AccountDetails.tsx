import React from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import ImageAndUsername from "./ImageAndUsername/ImageAndUsername.tsx";
import ChoiceHeaders from "./ChoiceHeaders/ChoiceHeaders.tsx";
import Content from "./Content/Content.tsx";

const AccountDetails: React.FC = () => {

    document.title = "CARSOLD | Account";

    return (
        <LayOut>
            <div className={`flex flex-col items-center gap-8 m:gap-10`}>
                <ImageAndUsername/>
                <div className="flex flex-col items-center w-11/12 gap-8 m:gap-10">
                    <ChoiceHeaders/>
                    <Content/>
                </div>
            </div>
        </LayOut>
    )
}

export default AccountDetails