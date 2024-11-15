import React, {useEffect, useState} from "react";

//specifies component's props
interface WrongPasswordBannerProps {
    onAnimationEnd: () => void;
}

//animated banner which pops when user enter wrong password during login process
const WrongPasswordBanner: React.FC<WrongPasswordBannerProps> = ({onAnimationEnd}: { onAnimationEnd: () => void }) => {
    const [animation, setAnimation] = useState<string>('animate-slideIn');   //changes animation

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

    return (
        <div
            className={`flex justify-center items-center fixed bottom-10 sm:bottom-0 left-0 right-0 h-12 xs:h-14 lg:h-16 2xl:h-[70px] bg-coolRed ${animation}`}>
            <p className="p-4 text-base sm:text-xl lg:text-2xl 2xl:text-3xl 3xl:text-4xl text-center">Wrong password</p>
        </div>
    )
}

export default WrongPasswordBanner;