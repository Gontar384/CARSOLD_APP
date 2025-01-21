import React from "react";
import {useNavigate} from "react-router-dom";

const Logo: React.FC = () => {

    const navigate = useNavigate();

    return (
        <button className="flex flex-row justify-center text-[26px] m:text-3xl mx-2"
                onClick={() => navigate("/home")}>
            <p className="text-white">CAR</p>
            <p className="text-black">$</p>
            <p className="text-white">OLD</p>
        </button>
    )
}

export default Logo