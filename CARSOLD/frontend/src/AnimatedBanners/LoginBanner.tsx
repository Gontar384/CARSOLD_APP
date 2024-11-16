import React from "react";

//specifies component's props
interface LoginBannerProps {
    lowerBar: boolean;   //info about lower banner 'presence'
}

//animated banner which pops when user is authenticated during login process
const LoginBanner: React.FC<LoginBannerProps> = ({lowerBar}: {lowerBar: boolean}) => {
    return (
        <div className={`flex justify-center items-center fixed ${lowerBar ? "bottom-10" : "bottom-0"} sm:bottom-0 left-0 right-0 h-12 xs:h-14 lg:h-16 2xl:h-[70px] bg-darkLime z-50 animate-slideIn`}>
            <p className="p-4 text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">Logged in successfully!</p>
        </div>
    )
}

export default LoginBanner;