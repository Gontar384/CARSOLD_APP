import {ReactElement, useEffect, useState} from "react";

//will be needed further when dealing with pics loading
function LoadingPicAnimation(): ReactElement {

    //state to add accumulating degrees every cycle
    const [rotationDegrees, setRotationDegrees] = useState<number>(0);  // Store the accumulated rotation

    //make cycle every 16 millis to maintain its smooth flow
    useEffect(() => {
        const interval = setInterval(() => {
            setRotationDegrees(prev => prev + 2);
        }, 16);  //for 60FPS

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center justify-center h-full w-full absolute z-30">
            <svg className="w-1/3 h-1/3" viewBox="0 0 50 50">
                <circle className="animate-dash origin-center"
                        cx="25" cy="25" r="20" fill="none" stroke="lime" strokeWidth="4"
                        style={{transform: `rotate(${rotationDegrees}deg)`}}>
                </circle>
            </svg>
        </div>
    );
}

export default LoadingPicAnimation;