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
    const [photoHovered, setPhotoHovered] = useState<boolean>(true);
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
    const [isZoomed, setIsZoomed] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(1);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStartPosition = useRef({x: 0, y: 0, offsetX: 0, offsetY: 0});
    const [style, setStyle] = useState({});

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
            if (!isZoomed && Math.abs(touchDifference) > 50) {
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

        if (!isMobile && scale > 1) {
            setIsDragging(true);
            dragStartPosition.current = {
                x: e.clientX,
                y: e.clientY,
                offsetX: position.x,
                offsetY: position.y
            };
            document.body.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && !isMobile && scale > 1) {
            const img = imageRef.current;
            if (img) {
                const deltaX = e.clientX - dragStartPosition.current.x;
                const deltaY = e.clientY - dragStartPosition.current.y;

                const rawX = dragStartPosition.current.offsetX + deltaX;
                const rawY = dragStartPosition.current.offsetY + deltaY;

                const maxOffsetX = (scale - 1) * img.clientWidth / 2;
                const maxOffsetY = (scale - 1) * img.clientHeight / 2;

                setPosition({
                    x: Math.max(-maxOffsetX, Math.min(maxOffsetX, rawX)),
                    y: Math.max(-maxOffsetY, Math.min(maxOffsetY, rawY))
                });
            }
        } else if (startMouse !== 0) {
            setEndMouse(e.clientX);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            document.body.style.cursor = '';
            dragStartPosition.current.offsetX = position.x;
            dragStartPosition.current.offsetY = position.y;
        } else if (scale === 1 && Math.abs(startMouse - endMouse) > 50) {
            if (startMouse - endMouse > 50) {
                if (photoIndex < photos.length - 1) changePhoto(1);
            } else if (endMouse - startMouse > 50) {
                if (photoIndex > 0) changePhoto(-1);
            }
        }

        setStartMouse(0);
        setEndMouse(0);
    };

    const handleMouseLeave = () => {
        setPhotoHovered(false);
        if (isDragging) {
            setIsDragging(false);
            document.body.style.cursor = '';
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (isMobile || !fullScreen) return;
        const zoomSpeed = 0.002;
        const delta = e.deltaY * zoomSpeed;
        const newScale = Math.min(Math.max(1, scale * (1 - delta)), 3);
        if ((scale <= 1 && delta > 0) || (scale >= 3 && delta < 0)) return;

        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const focusX = (mouseX - rect.width / 2 - position.x) / scale;
        const focusY = (mouseY - rect.height / 2 - position.y) / scale;

        const newX = -(focusX * newScale) + (mouseX - rect.width / 2);
        const newY = -(focusY * newScale) + (mouseY - rect.height / 2);

        const maxOffset = (newScale - 1) * Math.max(rect.width, rect.height) / 2;

        setScale(newScale);
        setPosition({
            x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
            y: Math.max(-maxOffset, Math.min(maxOffset, newY))
        });
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        if (isMobile || !fullScreen) return;

        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (scale === 1) {
            const newScale = 2;
            const focusX = (mouseX - rect.width / 2 - position.x) / scale;
            const focusY = (mouseY - rect.height / 2 - position.y) / scale;

            const newX = -(focusX * newScale) + (mouseX - rect.width / 2);
            const newY = -(focusY * newScale) + (mouseY - rect.height / 2);

            const maxOffset = (newScale - 1) * Math.max(rect.width, rect.height) / 2;

            setScale(newScale);
            setPosition({
                x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
                y: Math.max(-maxOffset, Math.min(maxOffset, newY))
            });
        } else {
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
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

    useEffect(() => {
        if (!isMobile) return;
        let zoomOutTimeout: ReturnType<typeof setTimeout> | null = null;

        const checkZoom = () => {
            const zoom = window.visualViewport?.scale || 1;
            const isZoomNow = Math.abs(zoom - 1) > 0.05;
            setIsZoomed(prev => {
                if (prev === isZoomNow) return prev;
                if (isZoomNow) {
                    if (zoomOutTimeout) {
                        clearTimeout(zoomOutTimeout);
                        zoomOutTimeout = null;
                    }
                    return true;
                }
                if (!isZoomNow) {
                    if (zoomOutTimeout) clearTimeout(zoomOutTimeout);
                    zoomOutTimeout = setTimeout(() => {
                        setIsZoomed(false);
                    }, 300);
                }
                return prev;
            });
        };

        checkZoom();
        window.visualViewport?.addEventListener("resize", checkZoom);
        window.visualViewport?.addEventListener("scroll", checkZoom);

        return () => {
            if (zoomOutTimeout) clearTimeout(zoomOutTimeout);
            window.visualViewport?.removeEventListener("resize", checkZoom);
            window.visualViewport?.removeEventListener("scroll", checkZoom);
        };
    }, []); //detects zoom and blocks swiping

    useEffect(() => {
        if (!fullScreen) return;
        const originalOverflow = document.body.style.overflow;
        const originalTouchAction = document.body.style.touchAction;

        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "pinch-zoom";

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.touchAction = originalTouchAction;
        };
    }, [fullScreen]); //blocks moving background vertically

    useEffect(() => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    }, [fullScreen, photoIndex]); //resets scale when changing photo or fullScreen

    useEffect(() => {
        const updateSize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const aspectRatio = 15 / 10;

            const isPortrait = windowHeight > windowWidth;

            if (isMobile && !isPortrait) {
                setStyle({
                    width: '100vw',
                    height: '100vh',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                });
            } else if (isMobile && isPortrait) {
                const width = windowWidth;
                const height = width / aspectRatio;
                setStyle({
                    width: `${width}px`,
                    height: `${height}px`,
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                });
            } else {
                const maxWidthLimit = 1400;
                const maxHeightLimit = 870;

                let maxWidth = Math.min(windowWidth * 0.9, maxWidthLimit);
                let maxHeight = Math.min(windowHeight * 0.9, maxHeightLimit);

                if (maxWidth / aspectRatio > maxHeight) {
                    maxWidth = maxHeight * aspectRatio;
                } else {
                    maxHeight = maxWidth / aspectRatio;
                }

                setStyle({
                    maxWidth: `${maxWidth}px`,
                    maxHeight: `${maxHeight}px`,
                    width: '100%',
                    height: 'auto',
                });
            }
        };

        if (fullScreen) {
            updateSize();
            window.addEventListener('resize', updateSize);
            return () => window.removeEventListener('resize', updateSize);
        } else {
            setStyle({});
        }
    }, [fullScreen, isMobile]); //resizes image on fullScreen

    return (
            offerFetched ? (
                photos.length > 0 && !error &&
                    <div className={`w-full aspect-[15/10] overflow-hidden cursor-pointer outline-none bg-gray-200
                    ${fullScreen && `fixed inset-0 m-auto z-50 ${!isMobile && "ring-2 ring-gray-600 rounded"}`}`}
                         style={{userSelect: 'none', ...(fullScreen ? style : {})}}
                         onMouseEnter={!isMobile ? () => setPhotoHovered(true) : undefined}
                         onMouseLeave={!isMobile ? handleMouseLeave : undefined}
                         onMouseDown={!isMobile ? handleMouseDown : undefined}
                         onMouseMove={!isMobile ? handleMouseMove : undefined}
                         onMouseUp={!isMobile ? handleMouseUp : undefined}
                         onTouchStart={isMobile ? handleTouchStart : undefined}
                         onTouchMove={isMobile ? handleTouchMove : undefined}
                         onTouchEnd={isMobile ? handleTouchEnd : undefined}
                         onWheel={!isMobile && fullScreen ? handleWheel : undefined}
                         onDoubleClick={!isMobile ? handleDoubleClick : undefined}
                         onKeyDown={e => {
                             if (!fullScreen) return;
                             if (e.key === "ArrowLeft" && photoIndex > 0) changePhoto(-1);
                             else if (e.key === "ArrowRight" && photoIndex < photos.length - 1) changePhoto(1);
                         }} tabIndex={0} ref={imageRef}>
                        <AnimatePresence custom={direction} mode="popLayout">
                            <motion.img key={photoIndex} src={photos[photoIndex]} alt="Car Photo"
                                        className="w-full h-full object-cover" onError={() => setError(true)}
                                        initial={{translateX: direction * 100 + "%"}} exit={{translateX: -direction * 100 + "%"}}
                                        animate={{translateX: "0%", scale: scale, x: position.x, y: position.y}}
                                        transition={{duration: 0.4, ease: "easeInOut"}} style={{willChange: 'transform'}}/>
                        </AnimatePresence>
                        {(photoHovered || isMobile) && !isZoomed &&
                        <div className="flex items-center justify-center absolute inset-0">
                            {photoIndex > 0 &&
                                <button className="absolute left-1"
                                        onClick={photoIndex > 0 ? () => changePhoto(-1) : undefined} onDoubleClick={e => e.stopPropagation()}>
                                    <FontAwesomeIcon icon={faPlay} className={`${isMobile ? "text-3xl pl-5 py-5" : "text-5xl p-2"} text-gray-300 opacity-90`} style={{transform: "rotate(180deg)"}}/>
                                </button>}
                            {photoIndex < photos.length - 1 &&
                                <button className="absolute right-1"
                                        onClick={photoIndex < photos.length - 1 ? () => changePhoto(1) : undefined} onDoubleClick={e => e.stopPropagation()}>
                                    <FontAwesomeIcon icon={faPlay} className={`${isMobile ? "text-3xl pl-5 py-5" : "text-5xl p-2"} text-gray-300 opacity-90`}/>
                                </button>}
                            {photos.length > 1 &&
                                <div className="flex gap-1 m:gap-1.5 absolute bottom-3 m:bottom-4">
                                    {photos.map((_, index) => (
                                        <div key={index} className={`${isMobile ? "w-1.5 h-1.5" : "w-2 h-2"} border border-black border-opacity-70 rounded
                                        ${photoIndex === index ? "bg-lowBlack" : "bg-gray-100"} transition-all duration-500`}/>))}
                                </div>}
                            <button className="flex absolute text-gray-300 left-1 bottom-1 m:left-2 m:bottom-2 p-2"
                                    onClick={() => setFullScreen(!fullScreen)}>
                                <FontAwesomeIcon icon={!fullScreen ? faMagnifyingGlassPlus : faMagnifyingGlassMinus} className={`${isMobile ? "text-xl" : "text-3xl"} text-gray-300`}/>
                            </button>
                        </div>}
                    </div>
            ) : (
                <ImageDisplayLoader/>
            )
    );
};

export default ImageDetails