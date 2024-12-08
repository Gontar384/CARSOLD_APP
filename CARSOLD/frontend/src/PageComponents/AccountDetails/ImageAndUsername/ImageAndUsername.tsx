import React from "react";
import Image from "./Atomic/Image.tsx";
import Username from "./Atomic/Username.tsx";

const ImageAndUsername: React.FC = () => {
    return (
        <div className="flex items-center w-7/12 h-14 xs:h-16 lg:h-[72px] xl:h-[80px] 2xl:h-[92px]
        3xl:h-[108px] min-w-[250px] sm:max-w-[445px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[850px]
        3xl:max-w-[920px] relative bg-lowLime rounded-l-full">
            <Image/>
            <Username/>
        </div>
    )
}

export default ImageAndUsername