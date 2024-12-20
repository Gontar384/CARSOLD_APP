import React, {useState} from "react";
import AnimatedBanner from "../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import LayOut from "../../LayOut/LayOut.tsx";
import PasswordChangeForm from "../../SharedComponents/PasswordChange/PasswordChangeForm.tsx";

const PasswordRecChange: React.FC = () => {

    const [isChanged, setIsChanged] = useState<boolean>(false);   //banners
    const [wentWrong, setWentWrong] = useState<boolean>(false);

    document.title = "CARSOLD | Password Recovery";

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center w-10/12 min-w-[310px] xs:min-w-[450px] xs:max-w-[500px] lg:max-w-[530px]
                xl:max-w-[570px] 2xl:max-w-[640px] 3xl:max-w-[720px] mt-20 xs:mt-24 sm:mt-12 lg:mt-14 xl:mt-16 2xl:mt-[72px] 3xl:mt-20
                pt-5 xs:pt-7 sm:pt-8 lg:pt-9 xl:pt-10 2xl:pt-11 3xl:pt-12 pb-8 xs:pb-9 sm:pb-10 lg:pb-12 xl:pb-14 2xl:pb-16 3xl-pb-[72px]
                bg-lime rounded-sm">
                    <p className="text-center text-xs xs:text-base 2xl:text-xl 3xl:text-2xl w-10/12 mb-7 xs:mb-8 2xl:mb-9 3xl:mb-10">
                        Now you can change your password.
                    </p>
                    <PasswordChangeForm setIsChanged={setIsChanged} setWentWrong={setWentWrong} loggedIn={false}/>
                    {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}/> : null}
                    {wentWrong? <AnimatedBanner text={"Your link has expired..."} color={"bg-coolYellow"} z={"z-50"}/>: null}
                </div>
            </div>
        </LayOut>
    )
}

export default PasswordRecChange