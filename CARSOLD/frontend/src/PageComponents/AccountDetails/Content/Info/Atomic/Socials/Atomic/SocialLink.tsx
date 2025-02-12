import React, {useState} from "react";
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
        <a href={link} target="_blank" className="flex flex-row items-center gap-2 m:gap-3"
              onMouseEnter={!isMobile ? () => setAnimation("animate-pop") : undefined}
              onMouseLeave={!isMobile ? () => setAnimation(null) : undefined}
              onTouchStart={isMobile ? () => setAnimation("animate-pop") : undefined}
              onTouchEnd={isMobile ? () => setAnimation(null) : undefined}>
            <p>{name}</p>
            <img src={imageUrl} alt="logo" className={`w-6 h-6 m:w-7 m:h-7 ${animation}`}/>
        </a>
    )
}

export default SocialLink