import React from "react";
import SocialLink from "./Atomic/SocialLink.tsx";
import {useLanguage} from "../../../../../../GlobalProviders/Language/useLanguage.ts";

const Socials: React.FC = () => {
    const {t} = useLanguage();

    return (
        <div className="mt-14 m:mt-16">
            <p className="mb-8 m:mb-10 font-bold">{t("socials")}</p>
            <div className="flex flex-col items-center relative z-10 gap-2 m:gap-3">
                <SocialLink imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/600px-Octicons-mark-github.svg.png"
                            name="GitHub" link="https://github.com/Gontar384"/>
                <SocialLink imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/600px-Instagram_logo_2022.svg.png"
                            name="Instagram" link="https://www.instagram.com/g0ntar/"/>
            </div>
        </div>
    )
}

export default Socials