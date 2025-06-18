import React, {useState} from "react";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

interface ContactProps {
    email: string;
}

const Contact: React.FC<ContactProps> = ({email}) => {
    const [animation, setAnimation] = useState<"animate-pop" | null>(null);
    const {isMobile} = useUtil();
    const {t} = useLanguage();

    return (
        <div className="flex flex-col mt-10 m:mt-12">
            <h2>{t("contact")}</h2>
            <div className="flex flex-row items-center justify-center gap-2 m:gap-3 mt-3 m:mt-4">
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