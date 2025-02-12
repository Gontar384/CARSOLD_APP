import React from "react";
import PartButton from "./Atomic/PartButton.tsx";

const LoginRegisterButton: React.FC = () => {

    return (
        <div className="flex flex-row gap-2 text-2xl whitespace-nowrap cursor-pointer">
            <PartButton title={"Login"} path={"login"}/>
            <p>|</p>
            <PartButton title={"Register"} path={"register"}/>
        </div>
    )
}

export default LoginRegisterButton