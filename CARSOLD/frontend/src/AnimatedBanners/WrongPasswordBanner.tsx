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
            className={`flex justify-center items-center fixed bottom-0 left-0 right-0 h-12 sm1:h-16 bg-coolRed ${animation}`}>
            <p className="p-4 text-xl sm1:text-2xl text-center">Wrong password</p>
        </div>
    )
}

export default WrongPasswordBanner;