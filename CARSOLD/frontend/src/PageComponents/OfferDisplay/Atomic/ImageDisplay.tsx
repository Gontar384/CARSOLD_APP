import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faPlay} from "@fortawesome/free-solid-svg-icons";
import ImageDisplayLoader from "../../../SharedComponents/Additional/Loading/ImageDisplayLoader.tsx";
import {AnimatePresence, motion} from "framer-motion";

interface ImageDisplayProps {
    photos: string[];
    loading: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({photos, loading}) => {

    const [photoHovered, setPhotoHovered] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);
    const [direction, setDirection] = useState<number>(0);
    const [disabled, setDisabled] = useState<boolean>(false);

    const changePhoto = (dir: number) => {
      if (disabled) return;
      setDisabled(true);
      setDirection(dir);
      setTimeout(() => {
       setIndex(prev => prev + dir)
      });
      setTimeout(() => {
          setDisabled(false);
      }, 400);
    };

    return (
        <div className="max-w-[700px] max-h-[500px] aspect-[14/10] w-full h-full border-2 bg-white border-gray-300
        rounded-md overflow-hidden relative"
             onMouseEnter={() => setPhotoHovered(true)}
             onMouseLeave={() => setPhotoHovered(false)}>
            {loading ? <ImageDisplayLoader/>
                : photos.length > 0 && !error ? (
                    <>
                        <AnimatePresence custom={direction} mode="popLayout">
                            <motion.img key={index} src={photos[index]} alt="Car Photo"
                                className="w-full h-full object-cover rounded" onError={() => setError(true)}
                                initial={{ x: direction * 100 + "%"}} exit={{ x: -direction * 100 + "%" }}
                                animate={{ x: "0%"}} transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </AnimatePresence>
                        {photoHovered &&
                            <div className="absolute inset-0 flex items-center">
                                {index > 0 &&
                                    <button className="absolute left-1"
                                            onClick={index > 0 ? () => changePhoto(-1) : undefined}>
                                        <FontAwesomeIcon icon={faPlay} className="text-6xl text-gray-200 opacity-90"
                                                         style={{transform: "rotate(180deg)"}}/>
                                    </button>
                                }
                                {index < photos.length - 1 &&
                                    <button className="absolute right-1"
                                            onClick={index < photos.length - 1 ? () => changePhoto(1) : undefined}>
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