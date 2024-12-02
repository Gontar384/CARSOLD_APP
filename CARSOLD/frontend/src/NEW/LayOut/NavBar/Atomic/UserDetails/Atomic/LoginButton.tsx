import React from "react";
import {useNavigate} from "react-router-dom";

const LoginButton: React.FC= () => {

    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/authenticate/login")}
                className="text-[15px] lg:text-[18px] xl:text-[22px] 2xl:text-[27px] 3xl:text-[31px] whitespace-nowrap cursor-pointer">
            <p>Login | Register</p>
        </button>
    )
}

export default LoginButton