import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faPlay} from "@fortawesome/free-solid-svg-icons";
import ImageDisplayLoader from "../../../SharedComponents/Additional/Loading/ImageDisplayLoader.tsx";

interface ImageDisplayProps {
    photos: string[];
    loading: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({photos, loading}) => {

    const [photoHovered, setPhotoHovered] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);

    const previousPhoto = () => {
        setIndex(prev => Math.max(prev - 1, 0));
    };

    const nextPhoto = () => {
        setIndex(prev => Math.min(prev + 1, photos.length - 1));
    };

    return (
        <div className="w-[550px] h-[450px] border-2 bg-white border-gray-300 rounded-md relative"
             onMouseEnter={() => setPhotoHovered(true)}
             onMouseLeave={() => setPhotoHovered(false)}>
            {loading ? <ImageDisplayLoader/>
                : photos.length > 0 && !error ? (
                    <>
                        <img src={photos[index]} alt="Car Photo" className="w-full h-full object-cover rounded"
                             onError={() => setError(true)}/>
                        {photoHovered &&
                            <div className="absolute inset-0 flex items-center">
                                {index > 0 &&
                                    <button className="absolute left-1"
                                            onClick={previousPhoto}>
                                        <FontAwesomeIcon icon={faPlay} className="text-6xl text-gray-200 opacity-90"
                                                         style={{transform: "rotate(180deg)"}}/>
                                    </button>
                                }
                                {index < (photos.length - 1) &&
                                    <button className="absolute right-1"
                                            onClick={nextPhoto}>
                                        <FontAwesomeIcon icon={faPlay} className="text-6xl text-gray-200 opacity-90"/>
                                    </button>
                                }
                            </div>
                        }
                    </>
                ) : (
                    <div className="flex justify-center items-center w-full h-full">
                        <FontAwesomeIcon icon={faImage} className="text-6xl m:text-7xl"/>
                    </div>
                )}
        </div>
    );
};

export default ImageDisplay