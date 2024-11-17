import React, {useEffect, useState} from "react";

//specifies component's props
interface RegisterBannerProps {
    text: string;
    onAnimationEnd: () => void;
    lowerBar: boolean;   //info about lower banner 'presence'
}

//animated banner which pops (used in when user register and when user send email to change password)
//long-time banner, with disappearing mechanism
const LongDisBanner: React.FC<RegisterBannerProps> = ({text, onAnimationEnd, lowerBar}: { text: string, onAnimationEnd: () => void, lowerBar: boolean }) => {
    const [animation, setAnimation] = useState<string>('animate-slideIn');   //changes animation

    useEffect(() => {
        const hideTimer = setTimeout(() => {     //timer when banner hides
            onAnimationEnd();
        }, 7300)
        const slideOutTimer = setTimeout(() => {  //timer when banner gets second animation
            setAnimation('animate-slideOut');
        }, 7000);

        return () => {
            clearTimeout(hideTimer)                //cleanups
            clearTimeout(slideOutTimer);
        };
    }, [onAnimationEnd]);

    return (
        <div
            className={`flex justify-center items-center fixed ${lowerBar ? "bottom-10" : "bottom-0" } 
            sm:bottom-0 left-0 right-0 h-24 xs:h-20 bg-gradient-to-r from-lowLime to-lowLime via-coolGreen ${animation}`}>
            <p className="p-4 text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">
                {text}
            </p>
        </div>
    )
}

export default LongDisBanner;