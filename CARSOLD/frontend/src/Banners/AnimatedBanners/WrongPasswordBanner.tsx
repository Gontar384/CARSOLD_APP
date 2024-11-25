import React, {useEffect, useState} from "react";
import {useUtil} from "../../GlobalProviders/UtilProvider.tsx";

//specifies props
interface WrongPasswordBannerProps {
    onAnimationEnd: () => void;
}

//animated banner which pops when user enter wrong password during login process
const WrongPasswordBanner: React.FC<WrongPasswordBannerProps> = ({onAnimationEnd}: { onAnimationEnd: () => void}) => {
    const [animation, setAnimation] = useState<string>('animate-slideIn');   //changes animation

    //disappearing mechanism
    useEffect(() => {
        const hideTimer = setTimeout(() => {     //timer when banner hides
            onAnimationEnd();
        }, 2300)
        const slideOutTimer = setTimeout(() => {  //timer when banner gets second animation
            setAnimation('animate-slideOut');
        }, 2000);

        return () => {
            clearTimeout(hideTimer)                //cleanups
            clearTimeout(slideOutTimer);
        };
    }, [onAnimationEnd]);

    //global states to adapt banner to lower bar and window size
    const { lowerBar, isWide } = useUtil(); // Access global state

    return (
        <div
            className={`flex justify-center items-center fixed ${lowerBar && !isWide ? "bottom-10 xs:bottom-11 transition-all duration-300 ease-out" : "bottom-0"} sm:bottom-0 left-0 
            right-0 h-12 xs:h-14 lg:h-16 2xl:h-[70px] bg-gradient-to-r from-coolRed to-coolRed via-coolLowRed z-50
            border-t-2 border-white rounded-t-2xl shadow-top ${animation}`}>
            <p className="p-4 text-white text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">Wrong password</p>
        </div>
    )
}

export default WrongPasswordBanner;