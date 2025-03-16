import React, {useEffect, useState} from "react";

interface LoadingPicAnimationProps {
    size: number;
}

const LoadingPicAnimation: React.FC<LoadingPicAnimationProps> = ({ size }) => {

    //stores accumulating degrees every cycle
    const [rotationDegrees, setRotationDegrees] = useState<number>(0);

    //makes cycle every 16 millis to maintain its smooth flow
    useEffect(() => {
        const interval = setInterval(() => {
            setRotationDegrees(prev => prev + 2);
        }, 16);  //for 60FPS

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center h-full w-full absolute inset-0 z-30">
            <svg className="w-full h-full" viewBox="0 0 50 50" style={{ width: size, height: size }}>
                <circle className="animate-dash origin-center"
                        cx="25" cy="25" r="20" fill="none" stroke="lime" strokeWidth="4"
                        style={{transform: `rotate(${rotationDegrees}deg)`}}>
                </circle>
            </svg>
        </div>
    );
}

export default LoadingPicAnimation;