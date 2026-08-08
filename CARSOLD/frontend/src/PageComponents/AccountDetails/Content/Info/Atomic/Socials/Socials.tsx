import React from "react";
import SocialLink from "./Atomic/SocialLink.tsx";
import {useLanguage} from "../../../../../../GlobalProviders/Language/useLanguage.ts";

interface SocialsProps {
    active: boolean;
}

const Socials: React.FC<SocialsProps> = ({ active }) => {
    const {t} = useLanguage();

    if (!active) return null;

    return (
        <div className="mt-14 m:mt-16">
            <h2 className="mb-8 m:mb-10 font-bold">{t("socials")}</h2>
            <div className="flex flex-col items-center relative z-10 gap-4 m:gap-5">
                <SocialLink imageUrl="/svg/github.svg"
                            name="GitHub" link="https://github.com/Gontar384"/>
                <SocialLink imageUrl="/svg/linkedin.svg"
                            name="LinkedIn" link="https://www.linkedin.com/in/jakub-gontarek-3b8210370/"/>
                <SocialLink imageUrl="/svg/instagram.svg"
                            name="Instagram" link="https://www.instagram.com/g0ntar/"/>
            </div>
        </div>
    )
}

export default Socials