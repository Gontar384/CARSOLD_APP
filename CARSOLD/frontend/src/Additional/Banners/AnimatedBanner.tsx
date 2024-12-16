import React, {useEffect, useState} from "react";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

interface AnimatedBannerProps {
    text: string;
    onAnimationEnd?: () => void;
    delay?: number;
    color: string;
    z?: string;
}

const AnimatedBanner: React.FC<AnimatedBannerProps> = ({ text, onAnimationEnd, delay, color, z }) => {

    const [animation, setAnimation] = useState<string>('animate-slideIn');
    const { lowerBar, isWide } = useUtil();

    useEffect(() => {
        if (delay && onAnimationEnd) {
            const hideTimer = setTimeout(() => {     //banner hides
                onAnimationEnd();
            }, delay + 300)
            const slideOutTimer = setTimeout(() => {  //banner gets second animation
                setAnimation('animate-slideOut');
            }, delay);

            return () => {
                clearTimeout(hideTimer)
                clearTimeout(slideOutTimer);
            };
        }
    }, [delay, onAnimationEnd]);

    return (
        <div className={`flex justify-center items-center fixed ${lowerBar && !isWide ? "bottom-10 xs:bottom-11 transition-all duration-300 ease-out" : "bottom-0"} 
            sm:bottom-0 left-0 right-0 ${text.length > 25 ? "h-14 xs:h-16" : "h-12 xs:h-14"} ${color} border-t border-x border-white rounded-t-2xl ${z} shadow-top ${animation}`}>
            <p className="p-4 text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">
                {text}
            </p>
        </div>
    )
}

export default AnimatedBanner