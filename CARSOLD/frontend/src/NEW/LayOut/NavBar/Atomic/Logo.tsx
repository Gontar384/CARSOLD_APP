import React from "react";

interface LogoProps {
    navigate: (path: string) => void;
}

const Logo: React.FC<LogoProps> = ({navigate}) => {
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