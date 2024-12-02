import React from "react";
import {useNavigate} from "react-router-dom";

const Logo: React.FC = () => {

    const navigate = useNavigate();

    return (
        <button className="flex flex-row justify-center text-xl xs:text-2xl lg:text-3xl xl:text-4xl
        2xl:text-[44px] 3xl:text-[50px]"
                onClick={() => navigate("/home")}>
            <p className="text-white">CAR</p>
            <p className="text-black">$</p>
            <p className="text-white">OLD</p>
        </button>
    )
}

export default Logo