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
    const [imgError, setImgError] = useState<boolean>(false);

    return (
        <>
            {fullScreen && <div className="fixed inset-0 m-auto w-full h-full bg-black bg-opacity-70 z-50 touch-none"></div>}
            <div className="w-full m:w-[95%] h-full max-w-[690px] max-h-[460px] aspect-[15/10] mt-10 m:mt-12 mb-4 m:mb-6
            bg-gray-100 m:rounded border-y m:border-2 border-black border-opacity-40 overflow-hidden relative">
                {offerFetched && (photos.length === 0 || fullScreen || imgError) && <FontAwesomeIcon icon={faImage} className="text-6xl m:text-7xl absolute inset-0 m-auto"/>}
                <ImageDetails photos={photos} fullScreen={fullScreen} setFullScreen={setFullScreen} offerFetched={offerFetched}
                              error={imgError} setError={setImgError}/>
            </div>
        </>
    )
};

export default ImageDisplay