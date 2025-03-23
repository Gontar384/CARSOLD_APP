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
        <div className="flex flex-row items-center gap-2 m:gap-3
            mt-[72px] m:mt-20">
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