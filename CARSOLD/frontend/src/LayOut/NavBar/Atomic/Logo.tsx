import React from "react";
import {Link} from "react-router-dom";

const Logo: React.FC = () => {

    return (
        <Link className="flex flex-row justify-center text-[22px] m:text-[26px]"
                to={"/home"} title="Home">
            <p className="text-white">CAR</p>
            <p className="text-black">$</p>
            <p className="text-white">OLD</p>
        </Link>
    )
}

export default Logo