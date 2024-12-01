import React from "react";

interface LoginButtonProps {
    navigate: (path: string) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ navigate }) => {
    return (
        <button onClick={() => navigate("/authenticate/login")}
                className="text-[15px] lg:text-[18px] xl:text-[22px] 2xl:text-[27px] 3xl:text-[31px] whitespace-nowrap cursor-pointer">
            <p>Login | Register</p>
        </button>
    )
}

export default LoginButton