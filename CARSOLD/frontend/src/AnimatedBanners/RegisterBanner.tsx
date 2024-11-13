import React, {useEffect, useState} from "react";

//specifies component's props
interface RegisterBannerProps {
    onAnimationEnd: () => void;
}

//animated banner which pops when user is registered successfully
const RegisterBanner: React.FC<RegisterBannerProps> = ({onAnimationEnd}: { onAnimationEnd: () => void }) => {
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
            className={`flex justify-center items-center fixed bottom-0 left-0 right-0 h-24 sm1:h-20 bg-darkLime ${animation}`}>
            <p className="p-4 text-xl sm1:text-2xl text-center">
                Registered successfully! We've sent you e-mail with confirmation link. Check it out!
            </p>
        </div>
    )
}

export default RegisterBanner;