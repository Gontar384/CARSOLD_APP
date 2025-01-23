import React from "react";
import PasswordChangeForm from "../../../../../../SharedComponents/PasswordChange/PasswordChangeForm.tsx";

interface PasswordChangeProps {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({setIsChanged}) => {

    return (
        <div className="w-full max-w-[210px] xs:max-w-[263px] sm:max-w-[255px] lg:max-w-[265px] xl:max-w-[275px]
        2xl:max-w-[320px] 3xl:max-w-[370px] -my-5 xs:-my-4 sm:-mb-[52px] lg:-mb-10 xl:-mb-8 2xl:-mb-10">
            <p className="mb-6 xs:-mb-1 sm:-mb-5 lg:-mb-1 xl:mb-3 2xl:mb-5 3xl:mb-3 text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:text-2xl text-center">
                Change your password:</p>
            <PasswordChangeForm setIsChanged={setIsChanged} loggedIn={true}/>
        </div>
    )
}

export default PasswordChange