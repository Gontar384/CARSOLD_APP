import React from "react";
import SocialLink from "./Atomic/SocialLink.tsx";

const Socials: React.FC = () => {

    return (
        <div className="mt-12 m:mt-14">
            <p className="mb-6 m:mb-8 font-bold">Check our socials:</p>
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