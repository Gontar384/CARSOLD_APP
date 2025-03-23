import React, {useState} from "react";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

interface ContactProps {
    email: string;
}

const Contact: React.FC<ContactProps> = ({email}) => {

    const [animation, setAnimation] = useState<"animate-pop" | null>(null);
    const {isMobile} = useUtil();

    return (
        <div className="flex flex-col mt-10 m:mt-12">
            <p>We will be glad, if you report any issues at: </p>
            <div className="flex flex-row items-center justify-center gap-2 m:gap-3 mt-1 m:mt-[6px]">
                <p className="font-bold">{email}</p>
                <FontAwesomeIcon icon={faEnvelope} className={`${animation}`}
                                 onMouseEnter={!isMobile ? () => setAnimation("animate-pop") : undefined}
                                 onMouseLeave={!isMobile ? () => setAnimation(null) : undefined}
                                 onTouchStart={isMobile ? () => setAnimation("animate-pop") : undefined}
                                 onTouchEnd={isMobile ? () => setAnimation(null) : undefined}/>
            </div>
        </div>
    )
}

export default Contact