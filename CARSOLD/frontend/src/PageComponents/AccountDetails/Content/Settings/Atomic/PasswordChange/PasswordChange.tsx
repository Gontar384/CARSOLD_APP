import React from "react";
import PasswordChangeForm from "../../../../../PasswordRecoveryChange/PasswordChangeForm/PasswordChangeForm.tsx";

interface PasswordChangeProps {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({setIsChanged}) => {

    return (
        <div className="w-full mt-36 m:mt-40">
            <p className="mb-8 m:mb-10 text-xl m:text-2xl text-center">
                Change your password:</p>
            <PasswordChangeForm setIsChanged={setIsChanged} loggedIn={true}/>
        </div>
    )
}

export default PasswordChange