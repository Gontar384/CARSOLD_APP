import React from "react";

interface AuthWindowLoaderProps {
    choice: "login" | "register";
}

const AuthWindowLoader: React.FC<AuthWindowLoaderProps> = ({choice}) => {

    return (
        <div className={`w-11/12 max-w-[460px] ${choice  === "login" ? "h-[432px] m:h-[472px]" : "h-[536px] m:h-[592px]"} bg-lime rounded-sm animate-pulse`}></div>
    )
}

export default AuthWindowLoader