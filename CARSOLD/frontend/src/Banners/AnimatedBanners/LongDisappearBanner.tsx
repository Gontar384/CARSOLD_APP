import React, {useEffect, useState} from "react";
import {useUtil} from "../../GlobalProviders/UtilProvider.tsx";

//specifies props
interface RegisterBannerProps {
    text: string;
    onAnimationEnd: () => void;
}

//animated banner which pops when user register and when user send email to change password
//long-time banner, with disappearing mechanism
const LongDisappearBanner: React.FC<RegisterBannerProps> = ({text, onAnimationEnd}: { text: string, onAnimationEnd: () => void}) => {
    const [animation, setAnimation] = useState<string>('animate-slideIn');   //changes animation

    //disappearing mechanism
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

    //global states to adapt banner to lower bar and window size
    const { lowerBar, isWide } = useUtil(); // Access global state

    return (
        <div
            className={`flex justify-center items-center fixed ${lowerBar && !isWide ? "bottom-10 xs:bottom-11 transition-all duration-300 ease-out" : "bottom-0" } 
            sm:bottom-0 left-0 right-0 h-16 xs:h-20 bg-gradient-to-r from-lowLime to-lowLime via-coolGreen 
            border-t-2 border-white rounded-t-2xl z-50 shadow-top ${animation}`}>
            <p className="p-4 text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">
                {text}
            </p>
        </div>
    )
}

export default LongDisappearBanner;