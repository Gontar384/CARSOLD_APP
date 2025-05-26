import React from "react";
import {Link} from "react-router-dom";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";

const Logo: React.FC = () => {
    const {t} = useLanguage();

    return (
        <Link className="flex flex-row justify-center text-[22px] m:text-[26px] -ml-1" to={"/home"} title={t("logo")}>
            <p className="text-white">CAR</p>
            <p className="text-black">$</p>
            <p className="text-white">OLD</p>
        </Link>
    )
}

export default Logo