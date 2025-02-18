import React, {useEffect, useState} from "react";
import SingularImageInput from "./Atomic/SingularImageInput.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";

interface ImageInputProps {
    photos: (string | null)[];
    setPhotos: React.Dispatch<React.SetStateAction<(string | null)[]>>;
    isWrong: boolean;
    setIsWrong: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageInput: React.FC<ImageInputProps> = ({ photos, setPhotos, isWrong, setIsWrong }) => {
    const [warning, setWarning] = useState<string | null>(null);
    const {isMobile} = useUtil();

    useEffect(() => {
        if (isWrong) {
            if (photos[0] !== null) setIsWrong(false);
            else setWarning("Add at least one photo.") 
        }
    }, [isWrong, photos, setIsWrong]);

    return (
        <div className="flex flex-col items-center w-fit mx-1 pb-8">
            <div className="flex flex-row items-center justify-between w-full mb-1 m:mb-2 relative">
                <FontAwesomeIcon className="absolute left-[95px] m:left-[108px] text-[10px] m:text-xs" icon={faAsterisk}/>
                <span className={`text-lg m:text-xl ${isWrong && "text-coolRed"}`}>Add photos</span>
                <span className="text-xs m:text-sm">{!isMobile ? "Drag " : "Click on "}item to change order.</span>
            </div>
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-2 m:gap-3 ${isWrong && "border-2 border-coolRed rounded-md"}`}>
                {photos.map((_, index) => (
                    <SingularImageInput key={index} index={index} photos={photos} setPhotos={setPhotos} setWarning={setWarning}/>
                ))}
            </div>
            <div className="flex items-center min-h-5 m:min-h-6 mt-1 m:mt-2">
                <span className="text-xs m:text-sm text-coolRed">{warning}</span>
            </div>
        </div>
    );
}

export default ImageInput;
