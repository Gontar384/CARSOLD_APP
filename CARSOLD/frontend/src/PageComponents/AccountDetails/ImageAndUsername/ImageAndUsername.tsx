import React from "react";
import Image from "./Atomic/Image.tsx";
import Username from "./Atomic/Username.tsx";

const ImageAndUsername: React.FC = () => {
    return (
        <div className="flex flex-row bg-lime items-center rounded-full w-[500px] gap-10">
            <Image/>
            <Username/>
        </div>
    )
}

export default ImageAndUsername