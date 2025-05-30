import React from "react";
import {Link} from "react-router-dom";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";

const Logo: React.FC = () => {
    const {t} = useLanguage();

    return (
        <Link className="flex flex-row justify-center text-[22px] m:text-[26px] lg:ml-4 mr-1 lg:mr-0"
              to={"/search?page=0&size=10"} title={t("logo")}>
            <p className="text-white">CAR</p>
            <p className="text-black">$</p>
            <p className="text-white">OLD</p>
        </Link>
    )
}

export default Logo