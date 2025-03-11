import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faPlay} from "@fortawesome/free-solid-svg-icons";
import ImageDisplayLoader from "../../../SharedComponents/Additional/Loading/ImageDisplayLoader.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

interface ImageDisplayProps {
    photos: string[];
    loading: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({photos, loading}) => {

    const [photoHovered, setPhotoHovered] = useState<boolean>(false);
    const [photoIndex, setPhotoIndex] = useState<number>(0);
    const [error, setError] = useState<boolean>(false);
    const [direction, setDirection] = useState<number>(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const {isMobile} = useUtil();
    const [startTouch, setStartTouch] = useState<number>(0);
    const [endTouch, setEndTouch] = useState<number>(0);
    const [startMouse, setStartMouse] = useState<number>(0);
    const [endMouse, setEndMouse] = useState<number>(0);

    const changePhoto = (dir: number) => {
        if (disabled) return;
        setDisabled(true);
        setDirection(dir);
        setTimeout(() => {
            setPhotoIndex(prev => prev + dir)
        });
        setTimeout(() => {
            setDisabled(false);
        }, 400);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartTouch(e.touches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setEndTouch(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (startTouch - endTouch > 50) {
            if (photoIndex < photos.length - 1) changePhoto(1);
        } else if (endTouch - startTouch > 50) {
            if (photoIndex > 0) changePhoto(-1);
        }
        setStartTouch(0);
        setEndTouch(0);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setStartMouse(e.clientX);
        setEndMouse(e.clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (startMouse === 0) return;
        setEndMouse(e.clientX);
    };

    const handleMouseUp = () => {
        if (Math.abs(startMouse - endMouse) > 50) {
            if (startMouse - endMouse > 50) {
                if (photoIndex < photos.length - 1) changePhoto(1);
            } else if (endMouse - startMouse > 50) {
                if (photoIndex > 0) changePhoto(-1);
            }
        }
        setStartMouse(0);
        setEndMouse(0);
    };

    return (
        <div className="flex justify-center max-w-[630px] max-h-[440px] aspect-[14/10] w-full h-full my-1 border-2 bg-white border-gray-300
        cursor-pointer rounded-md overflow-hidden relative"
             onMouseEnter={!isMobile ? () => setPhotoHovered(true) : undefined}
             onMouseLeave={!isMobile ? () => setPhotoHovered(false) : undefined}
             onMouseDown={!isMobile ? handleMouseDown : undefined}
             onMouseMove={!isMobile ? handleMouseMove : undefined}
             onMouseUp={!isMobile ? handleMouseUp : undefined}
             onTouchStart={isMobile ? handleTouchStart : undefined}
             onTouchMove={isMobile ? handleTouchMove : undefined}
             onTouchEnd={isMobile ? handleTouchEnd : undefined}>
            {loading ? <ImageDisplayLoader/>
                : photos.length > 0 && !error ? (
                    <>
                        <AnimatePresence custom={direction} mode="popLayout">
                            <motion.img key={photoIndex} src={photos[photoIndex]} alt="Car Photo"
                                        className="w-full h-full object-cover rounded" onError={() => setError(true)}
                                        initial={{x: direction * 100 + "%"}} exit={{x: -direction * 100 + "%"}}
                                        animate={{x: "0%"}} transition={{duration: 0.5, ease: "easeInOut"}}/>
                        </AnimatePresence>
                        {photoHovered &&
                                <div className="absolute inset-0 flex items-center">
                                    {photoIndex > 0 &&
                                        <button className="absolute left-1"
                                                onClick={photoIndex > 0 ? () => changePhoto(-1) : undefined}>
                                            <FontAwesomeIcon icon={faPlay} className="text-6xl text-gray-200 opacity-90"
                                                             style={{transform: "rotate(180deg)"}}/>
                                        </button>
                                    }
                                    {photoIndex < photos.length - 1 &&
                                        <button className="absolute right-1"
                                                onClick={photoIndex < photos.length - 1 ? () => changePhoto(1) : undefined}>
                                            <FontAwesomeIcon icon={faPlay}
                                                             className="text-6xl text-gray-200 opacity-90"/>
                                        </button>
                                    }
                                </div>
                        }
                        {photos.length > 0 && photoHovered || isMobile ?
                        <div className="flex gap-1 m:gap-1.5 absolute bottom-3 m:bottom-4">
                            {photos.map((_, index) => (
                                <div key={index} className={`w-1.5 h-1.5 m:w-2 m:h-2 border border-black border-opacity-70
                                        rounded ${photoIndex === index ? "bg-lowBlack" : "bg-white"} transition-all duration-500`}>
                                </div>
                            ))}
                        </div> : null}
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