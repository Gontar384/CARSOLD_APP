import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

interface VersionProps {
    v: number;
}

const Version: React.FC<VersionProps> = ({v}) => {

    const [animation, setAnimation] = useState<"animate-shock" | null>(null);
    const {isMobile} = useUtil();

    return (
        <div className="flex flex-row items-center gap-2 xs:gap-[10px] lg:gap-3 2xl:gap-4 3xl:gap-5
            mt-9 xs:mt-11 sm:mt-7 lg:mt-9 xl:mt-10 2xl:mt-14 3xl:mt-16">
            <p>CARSOLD version {v.toFixed(1)}</p>
            <FontAwesomeIcon icon={faGear} className={`${animation}`}
                             onMouseEnter={!isMobile ? () => setAnimation("animate-shock") : undefined}
                             onMouseLeave={!isMobile ? () => setAnimation(null) : undefined}
                             onTouchStart={isMobile ? () => setAnimation("animate-shock") : undefined}
                             onTouchEnd={isMobile ? () => setAnimation(null) : undefined}/>
        </div>
    )
}

export default Version