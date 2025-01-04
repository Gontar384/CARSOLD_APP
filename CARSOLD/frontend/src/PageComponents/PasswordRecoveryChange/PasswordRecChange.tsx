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
                <div className="flex flex-col items-center w-10/12 min-w-[310px] xs:min-w-[450px] xs:max-w-[600px] lg:max-w-[630px]
                xl:max-w-[670px] 2xl:max-w-[740px] 3xl:max-w-[820px] mt-20 xs:mt-24 sm:mt-12 lg:mt-14 xl:mt-16 2xl:mt-[72px] 3xl:mt-20
                pt-6 xs:pt-8 sm:pt-9 lg:pt-10 xl:pt-11 2xl:pt-12 3xl:pt-14 pb-8 xs:pb-9 sm:pb-10 lg:pb-12 xl:pb-14 2xl:pb-16 3xl-pb-[72px]
                bg-lime rounded-sm">
                    <p className="text-center text-sm xs:text-base lg:text-lg 2xl:text-[21px] 3xl:text-2xl w-10/12 mb-7 xs:mb-10 lg:mb-11 2xl:mb-14 3xl:mb-16">
                        Now, you can change your password.
                    </p>
                    <div className="w-full max-w-[250px] xs:max-w-[320px] sm:max-w-[340px] lg:max-w-[370px] xl:max-w-[390px] 2xl:max-w-[430px] 3xl:max-w-[500px]">
                    <PasswordChangeForm setIsChanged={setIsChanged} setWentWrong={setWentWrong} loggedIn={false}/>
                    </div>
                    {isChanged ? <AnimatedBanner text={"Password changed successfully!"} color={"bg-lowLime"} z={"z-50"}/> : null}
                    {wentWrong? <AnimatedBanner text={"Your link has expired..."} color={"bg-coolYellow"} z={"z-50"}/>: null}
                </div>
            </div>
        </LayOut>
    )
}

export default PasswordRecChange