import React from "react";
import PasswordChangeForm from "../../../../PasswordRecChange/Atomic/PasswordChangeForm.tsx";

interface PasswordChangeProps {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({setIsChanged}) => {

    return (
        <div className="flex flex-col justify-center items-center h-full min-w-[300px] xs:w-[380px] lg:w-[400px] xl:w-[430px] 2xl:w-[490px] 3xl:w-[550px]
        pt-6 xs:pt-7 lg:pt-8 xl:pt-9 2xl:pt-11 3xl:pt-12 gap-6 xs:gap-7 2xl:gap-8 3xl:gap-9 scale-75">
            <p>Change password:</p>
            <PasswordChangeForm setIsChanged={setIsChanged} loggedIn={true}/>
        </div>
    )
}

export default PasswordChange