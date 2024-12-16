import React, {useState} from "react";
import {Link} from "react-router-dom";
import {useUtil} from "../../../../../../../GlobalProviders/Util/useUtil.ts";

interface CreatorLinkProps {
    link: string;
    imageUrl: string;
    name: string;
}

const SocialLink: React.FC<CreatorLinkProps> = ({link, imageUrl, name}) => {

    const [animation, setAnimation] = useState<"animate-pop" | null>(null);
    const {isMobile} = useUtil();

    return (
        <Link to={link} target="_blank" className="flex flex-row items-center xs:mt-[2px] lg:mt-1 xl:mt-[6px]
        2xl:mt-2 3xl:mt-3 gap-1 xs:gap-[6px] lg:gap-2 2xl:gap-3 3xl:gap-4"
              onMouseEnter={!isMobile ? () => setAnimation("animate-pop") : undefined}
              onMouseLeave={!isMobile ? () => setAnimation(null) : undefined}
              onTouchStart={isMobile ? () => setAnimation("animate-pop") : undefined}
              onTouchEnd={isMobile ? () => setAnimation(null) : undefined}>
            <p>{name}</p>
            <img src={imageUrl} alt="logo"
                 className={`w-[18px] h-[18px] xs:w-5 xs:h-5 lg:w-[22px] lg:h-[22px] 
                 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 3xl:w-8 3xl:h-8 ${animation}`}/>
        </Link>
    )
}

export default SocialLink