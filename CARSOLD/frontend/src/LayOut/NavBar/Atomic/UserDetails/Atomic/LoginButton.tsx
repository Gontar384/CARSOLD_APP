import React from "react";
import {useNavigate} from "react-router-dom";

const LoginButton: React.FC = () => {

    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/authenticate/login")}
                className="text-2xl whitespace-nowrap cursor-pointer">
            <p>Login | Register</p>
        </button>
    )
}

export default LoginButton