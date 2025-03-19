import React, {useState} from "react";
import ImageDetails from "./Atomic/ImageDetails.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage} from "@fortawesome/free-solid-svg-icons";

interface ImageDisplayProps {
    photos: string[];
    offerFetched: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({photos, offerFetched}) => {
    const [fullScreen, setFullScreen] = useState<boolean>(false);

    return (
        <>
            {fullScreen && <div className="fixed inset-0 m-auto w-full h-full bg-black bg-opacity-70 z-50"></div>}
            <div className="w-[98%] h-full max-w-[630px] max-h-[420px] aspect-[15/10] my-8 m:my-10
            bg-gray-100 rounded-md border-2 border-gray-300 overflow-hidden relative">
                {offerFetched && (photos.length === 0 || fullScreen) && <FontAwesomeIcon icon={faImage} className="text-6xl m:text-7xl absolute inset-0 m-auto"/>}
                <ImageDetails photos={photos} fullScreen={fullScreen} setFullScreen={setFullScreen} offerFetched={offerFetched}/>
            </div>
        </>
    )
};

export default ImageDisplay