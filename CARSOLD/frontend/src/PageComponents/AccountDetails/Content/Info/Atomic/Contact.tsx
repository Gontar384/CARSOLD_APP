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
        <div className="flex flex-col mt-4 xs:mt-5 lg:mt-6 2xl:mt-8 3xl:mt-10">
            <p>We will be glad, if you report any issues at: </p>
            <div className="flex flex-row items-center justify-center gap-2 xs:gap-[10px] lg:gap-3 2xl:gap-4 3xl:gap-5
            mt-[1px] xs:mt-[2px] lg:mt-[3px] xl:mt-1 2xl:mt-[6px] 3xl:mt-2">
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