import React from "react";
import SocialLink from "./Atomic/SocialLink.tsx";

const Socials: React.FC = () => {
    return (
        <div className="mt-10 xs:mt-12 sm:mt-5 lg:mt-7 xl:mt-10 2xl:mt-12 3xl:mt-14
        mb-14 xs:mb-16 sm:mb-0">
            <p className="mb-4 xs:mb-5 sm:mb-3 lg:mb-5 xl:mb-6 2xl:mb-8 3xl:mb-9 font-bold">Check our socials:</p>
            <div className="flex flex-col items-center relative z-10 gap-1 xs:gap-[6px] lg:gap-2 2xl:gap-3">
                <SocialLink imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/600px-Octicons-mark-github.svg.png"
                            name="GitHub" link="https://github.com/Gontar384"/>
                <SocialLink imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/600px-Instagram_logo_2022.svg.png"
                            name="Instagram" link="https://www.instagram.com/g0ntar/"/>
            </div>
        </div>
    )
}

export default Socials