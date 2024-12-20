import React from "react";
import PasswordChangeForm from "../../../../../SharedComponents/PasswordChange/PasswordChangeForm.tsx";

interface PasswordChangeProps {
    setIsChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({setIsChanged}) => {

    return (
        <div className="flex flex-col border border-black">
            <PasswordChangeForm setIsChanged={setIsChanged} loggedIn={true} scaled={true} isShrink={true}/>
        </div>
    )
}

export default PasswordChange