import React, {useEffect, useState} from "react";

//specifies component's props
interface RegisterBannerProps {
    onAnimationEnd: () => void;
    lowerBar: boolean;   //info about lower banner 'presence'
}

//animated banner which pops when user is registered successfully
const RegisterBanner: React.FC<RegisterBannerProps> = ({onAnimationEnd, lowerBar}: { onAnimationEnd: () => void, lowerBar: boolean }) => {
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
            className={`flex justify-center items-center fixed ${lowerBar ? "bottom-10" : "bottom-0" } sm:bottom-0 left-0 right-0 h-24 xs:h-20 bg-darkLime ${animation}`}>
            <p className="p-4 text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">
                Registered successfully! We've sent you e-mail with confirmation link. Check it out!
            </p>
        </div>
    )
}

export default RegisterBanner;