import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay, faMagnifyingGlassPlus, faMagnifyingGlassMinus} from "@fortawesome/free-solid-svg-icons";
import {AnimatePresence, motion} from "framer-motion";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import ImageDisplayLoader from "../../../../../Additional/Loading/ImageDisplayLoader.tsx";

interface ImageDetailsProps {
    photos: string[];
    fullScreen: boolean;
    setFullScreen: React.Dispatch<React.SetStateAction<boolean>>;
    offerFetched: boolean;
    error: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageDetails: React.FC<ImageDetailsProps> = ({photos, fullScreen, setFullScreen, offerFetched, error, setError}) => {
    const [photoHovered, setPhotoHovered] = useState<boolean>(false);
    const [photoIndex, setPhotoIndex] = useState<number>(0);
    const [direction, setDirection] = useState<number>(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const {isMobile} = useUtil();
    const [startTouchX, setStartTouchX] = useState(0);
    const [startTouchY, setStartTouchY] = useState(0);
    const [lockedAxis, setLockedAxis] = useState<null | 'x' | 'y'>(null);
    const [endTouch, setEndTouch] = useState<number>(0);
    const [startMouse, setStartMouse] = useState<number>(0);
    const [endMouse, setEndMouse] = useState<number>(0);
    const imageRef = useRef<HTMLDivElement | null>(null);

    const changePhoto = (dir: number) => {
        if (disabled) return;
        setDisabled(true);
        setDirection(dir);
        setTimeout(() => setPhotoIndex(prev => prev + dir));
        setTimeout(() => setDisabled(false), 400);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setStartTouchX(e.touches[0].clientX);
        setStartTouchY(e.touches[0].clientY);
        setLockedAxis(null);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const moveX = e.touches[0].clientX;
        const moveY = e.touches[0].clientY;
        const deltaX = Math.abs(moveX - startTouchX);
        const deltaY = Math.abs(moveY - startTouchY);

        if (!lockedAxis) {
            if (deltaX > deltaY && deltaX > 10) {
                setLockedAxis('x');
                document.body.style.overflow = 'hidden';
            } else if (deltaY > deltaX && deltaY > 10) {
                setLockedAxis('y');
            }
        }
        if (lockedAxis === 'x') {
            if (Math.abs(moveX - startTouchX) > 10) {
                setEndTouch(moveX);
            }
        }
    };

    const handleTouchEnd = () => {
        if (lockedAxis === 'x') {
            const touchDifference = startTouchX - endTouch;
            if (Math.abs(touchDifference) > 50) {
                if (touchDifference > 0 && photoIndex < photos.length - 1) {
                    changePhoto(1);
                } else if (touchDifference < 0 && photoIndex > 0) {
                    changePhoto(-1);
                }
            }
        }
        document.body.style.overflow = '';
        setLockedAxis(null);
        setStartTouchX(0);
        setStartTouchY(0);
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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (fullScreen && imageRef.current && !imageRef.current.contains(event.target as Node)) {
                setFullScreen(false);
            }
        }
        if (fullScreen) {
            document.addEventListener("mouseup", handleClickOutside);
            document.addEventListener("touchend", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mouseup", handleClickOutside);
            document.removeEventListener("touchend", handleClickOutside);
        }
    }, [fullScreen])  //adds event listener to off fullScreen image display

    useEffect(() => {
        if (fullScreen && imageRef.current) {
            imageRef.current.focus();
        }
    }, [fullScreen]); //puts focus on image when fullscreen

    return (
            offerFetched ? (
                photos.length > 0 && !error &&
                    <div className={`w-full aspect-[15/10] overflow-hidden cursor-pointer 
                    ${fullScreen && `max-w-[1300px] sm:h-full sm:max-h-[500px] md:max-h-[600px] lg:max-h-[800px]
                    border border-gray-300 rounded fixed inset-0 m-auto z-50 touch-none`}`}
                         onMouseEnter={!isMobile ? () => setPhotoHovered(true) : undefined}
                         onMouseLeave={!isMobile ? () => setPhotoHovered(false) : undefined}
                         onMouseDown={!isMobile ? handleMouseDown : undefined}
                         onMouseMove={!isMobile ? handleMouseMove : undefined}
                         onMouseUp={!isMobile ? handleMouseUp : undefined}
                         onTouchStart={isMobile ? handleTouchStart : undefined}
                         onTouchMove={isMobile ? handleTouchMove : undefined}
                         onTouchEnd={isMobile ? handleTouchEnd : undefined}
                         onKeyDown={e => {
                             if (!fullScreen) return;
                             e.preventDefault();
                             if (e.key === "ArrowLeft" && photoIndex > 0) changePhoto(-1);
                             else if (e.key === "ArrowRight" && photoIndex < photos.length - 1) changePhoto(1);
                         }} tabIndex={0} ref={imageRef}>
                        <AnimatePresence custom={direction} mode="popLayout">
                            <motion.img key={photoIndex} src={photos[photoIndex]} alt="Car Photo"
                                        className="w-full h-full object-cover rounded" onError={() => setError(true)}
                                        initial={{translateX: direction * 100 + "%"}} exit={{translateX: -direction * 100 + "%"}}
                                        animate={{translateX: "0%"}} transition={{duration: 0.4, ease: "easeInOut"}} style={{ willChange: "transform" }}/>
                        </AnimatePresence>
                        <div className="flex items-center justify-center absolute inset-0">
                            {photoHovered &&
                                <>
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
                                                <FontAwesomeIcon icon={faPlay} className="text-6xl text-gray-200 opacity-90"/>
                                            </button>
                                        }
                                    </>
                                }
                                {(photoHovered || isMobile) &&
                                    <>
                                    {photos.length > 1 &&
                                        <div className="flex gap-1 m:gap-1.5 absolute bottom-3 m:bottom-4">
                                            {photos.map((_, index) => (
                                                <div key={index} className={`w-1.5 h-1.5 m:w-2 m:h-2 border border-black border-opacity-70 rounded
                                                ${photoIndex === index ? "bg-lowBlack" : "bg-gray-200"} transition-all duration-500`}>
                                                </div>
                                            ))}
                                        </div>}
                                        <button className="flex absolute text-gray-200 left-1 bottom-1 m:left-2 m:bottom-2 p-1 m:p-2"
                                                onClick={() => setFullScreen(!fullScreen)}>
                                            <FontAwesomeIcon icon={!fullScreen ? faMagnifyingGlassPlus : faMagnifyingGlassMinus}
                                                             className="text-2xl m:text-3xl text-gray-200"/>
                                        </button>
                                    </>
                                }
                            </div>

                    </div>
            ) : (
                <ImageDisplayLoader/>
            )
    );
};

export default ImageDetails