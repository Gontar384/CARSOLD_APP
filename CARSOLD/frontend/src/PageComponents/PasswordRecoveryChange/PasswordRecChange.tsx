import React, {useState} from "react";
import AnimatedBanner from "../../Additional/Banners/AnimatedBanner.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import PasswordChangeForm from "./PasswordChangeForm/PasswordChangeForm.tsx";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const PasswordRecChange: React.FC = () => {
    document.title = "CARSOLD | Password Recovery";
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [wentWrong, setWentWrong] = useState<boolean>(false);
    const {t} = useLanguage();

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center w-11/12 max-w-[850px] mt-28 py-10 m:py-11 bg-lime
                    border border-gray-300 rounded">
                    <p className="w-11/12 text-center text-lg m:text-xl mb-8 m:mb-9">
                        {t("changePassword11")}
                    </p>
                    <PasswordChangeForm setIsChanged={setIsChanged} setWentWrong={setWentWrong} loggedIn={false}/>
                </div>
            </div>
            {isChanged && <AnimatedBanner text={t("animatedBanner7")} color={"bg-lowLime"} z={"z-50"}/>}
            {wentWrong && <AnimatedBanner text={t("animatedBanner8")} color={"bg-coolYellow"} z={"z-50"}/>}
        </LayOut>
    )
}

export default PasswordRecChange