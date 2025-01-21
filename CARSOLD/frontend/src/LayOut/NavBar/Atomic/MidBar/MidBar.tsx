import React, {useEffect, useState} from "react";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

const MidBar: React.FC = () => {

    const [midBarActive, setMidBarActive] = useState<boolean>(false);
    const {midBar, midWidth} = useUtil();
    const [barAnimation, setBarAnimation] = useState<"animate-slideShow" | "animate-slideHide" | null>(null);

    useEffect(() => {
        if (midBar) {
            setMidBarActive(true);
            setBarAnimation("animate-slideShow")
        } else {
            setBarAnimation("animate-slideHide")
            const timeout = setTimeout(() => {
                setMidBarActive(false);
            }, 300);

            return () => clearTimeout(timeout);
        }

        if (!midWidth) {
            setBarAnimation(null);
            setMidBarActive(false);
        }
    }, [midBar, midWidth]);   //activates/deactivates lower bar and resets animation

    if (midBarActive) {
        return (
            <div className={`fixed h-screen top-11 w-80 bg-lime ${barAnimation} z-50`}>
                <div>test</div>
                <div>test</div>
                <div>test</div>
                <div>test</div>
                <div>test</div>
            </div>
        )
    }
}

export default MidBar