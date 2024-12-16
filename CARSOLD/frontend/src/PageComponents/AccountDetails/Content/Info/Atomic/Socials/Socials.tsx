import React from "react";
import SocialLink from "./Atomic/SocialLink.tsx";

const Socials: React.FC = () => {
    return (
        <div className="mt-10 xs:mt-11 sm:mt-10 lg:mt-11 xl:mt-12 2xl:mt-14 3xl:mt-16
        mb-8 xs:mb-9 sm:mb-6 lg:mb-7 xl:mb-8 2xl:mb-9 3xl:mb-10">
            <p className="mb-3 xs:mb-4 lg:mb-5 xl:mb-6 2xl:mb-7 3xl:mb-8 font-bold">Check our socials:</p>
            <div className="flex flex-col items-center relative z-10">
                <SocialLink imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/600px-Octicons-mark-github.svg.png"
                            name="GitHub" link="https://github.com/Gontar384"/>
                <SocialLink imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/600px-Instagram_logo_2022.svg.png"
                            name="Instagram" link="https://www.instagram.com/g0ntar/"/>
            </div>
        </div>
    )
}

export default Socials