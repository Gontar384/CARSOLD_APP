import React from "react";
import {Link, useLocation} from "react-router-dom";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";

const Logo: React.FC = () => {
    const {t} = useLanguage();
    const location = useLocation();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        const hasPage = searchParams.has("page");
        const hasSize = searchParams.has("size");

        if (currentPath === "/search" && hasPage && hasSize) e.preventDefault();
    };

    return (
        <Link className="flex flex-row justify-center text-[24px] m:text-[28px] lg:ml-4 mr-1 lg:mr-0" title={t("logo")}
              to={"/search?page=0&size=10"} onClick={handleClick} >
            <p className="text-white">CAR</p>
            <p className="text-black">$</p>
            <p className="text-white">OLD</p>
        </Link>
    )
}

export default Logo