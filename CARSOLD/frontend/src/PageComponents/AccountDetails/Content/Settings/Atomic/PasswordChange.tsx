import React from "react";
import PasswordChangeForm from "../../../../../SharedComponents/PasswordChange/PasswordChangeForm.tsx";

interface PasswordChangeProps {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({setIsChanged}) => {

    return (
        <div className="relative w-full max-w-[300px] xs:max-w-[340px] lg:max-w-[320px] xl:max-w-[340px]
        2xl:max-w-[420px] 3xl:max-w-[470px] -mb-6 xs:-mb-7 sm:-mb-8 lg:-mb-10 xl:-mb-14 2xl:-mb-16">
            <p className="absolute -inset-4 xs:-inset-3 sm:-inset-1 lg:-inset-5 xl:-inset-8 2xl:-inset-9
            3xl:-inset-10 text-xs xs:text-sm lg:text-base xl:text-lg 2xl:text-xl 3xl:test-2xl text-center">
                Change your password
            </p>
            <PasswordChangeForm setIsChanged={setIsChanged} loggedIn={true} scaled={true} isShrink={true}/>
        </div>
    )
}

export default PasswordChange