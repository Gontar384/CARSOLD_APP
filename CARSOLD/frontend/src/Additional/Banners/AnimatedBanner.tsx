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
    const {lowerBar, mobileWidth} = useUtil();

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
        <div className={`flex justify-center items-center fixed 
        ${lowerBar && mobileWidth ? "bottom-14 transition-all duration-300 ease-out" : "bottom-0"} 
            left-0 right-0 ${text.length > 35 ? "h-24 m:h-20" : "h-12 m:h-14"} ${color} rounded-t-2xl ${z} shadow-top ${animation}`}>
            <p className="p-4 text-xl m:text-[22px] text-center">
                {text}
            </p>
        </div>
    )
}

export default AnimatedBanner