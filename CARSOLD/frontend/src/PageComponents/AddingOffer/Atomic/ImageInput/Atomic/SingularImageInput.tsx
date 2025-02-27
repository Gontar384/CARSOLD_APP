import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faImage, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

interface SingularImageInputProps {
    index: number;
    photos: (string)[];
    setPhotos: React.Dispatch<React.SetStateAction<(string)[]>>;
    setWarning: React.Dispatch<React.SetStateAction<string>>;
}

const SingularImageInput: React.FC<SingularImageInputProps> = ({index, photos, setPhotos, setWarning}) => {
    const MAX_SIZE_MB = 3;
    const MAX_IMAGES = 8;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);
    const [animation, setAnimation] = useState<"animate-pop" | null>(null);
    const [imgHovered, setImgHovered] = useState<boolean>(false);
    const preview: string = photos[index];
    const {isMobile} = useUtil();

    const updatePhotos = (updated: (string)[]) => {
        const filteredPhotos: (string)[] = updated.filter(img => img !== "");
        while (filteredPhotos.length < MAX_IMAGES) {
            filteredPhotos.push("");
        }
        setPhotos(filteredPhotos.slice(0, MAX_IMAGES));
    };

    const processFiles = (files: FileList | File[]) => {
        const validFiles: File[] = [];
        let remainingSlots = photos.filter(p => p === "").length;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) {
                setWarning(`File "${file.name}" is not an image and was not added.`);
            } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setWarning(`File "${file.name}" exceeds the size limit of ${MAX_SIZE_MB}MB and was not added.`);
            } else if (remainingSlots > 0) {
                validFiles.push(file);
                remainingSlots--;
            }
        });

        if (validFiles.length === 0) return;

        const newPhotos = [...photos];

        validFiles.forEach(file => {
            const emptyIndex = newPhotos.indexOf("");
            if (emptyIndex !== -1) {
                newPhotos[emptyIndex] = URL.createObjectURL(file);
            }
        });

        if (validFiles.length < files.length) {
            setWarning(`Only ${validFiles.length} images were added. ${files.length - validFiles.length} were ignored due to size/type/limit.`);
        }

        updatePhotos(newPhotos);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWarning("");
        if (event.target.files) {
            processFiles(event.target.files);
        }
    };

    const handleImageDelete = () => {
        setWarning("");
        setTimeout(() => {
            setImgHovered(false);
            const newPhotos = [...photos];
            newPhotos[index] = "";
            updatePhotos(newPhotos);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }, 250);
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, draggedIndex: number) => {
        event.dataTransfer.setData("draggedIndex", String(draggedIndex));
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        setWarning("");
        event.preventDefault();
        const draggedIndex = event.dataTransfer.getData("draggedIndex");

        if (draggedIndex) {
            if (photos[index] === "") return;
            const newPhotos = [...photos];
            [newPhotos[index], newPhotos[Number(draggedIndex)]] = [newPhotos[Number(draggedIndex)], newPhotos[index]];
            setPhotos(newPhotos);
        } else if (event.dataTransfer.files.length > 0) {
            if (photos[index] === "") {
                processFiles(event.dataTransfer.files);
            }
        }
    };

    const handleTouch = () => {
        setImgHovered(prev => !prev);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (imgHovered && imageRef.current && !imageRef.current.contains(event.target as Node)) {
                setImgHovered(false);
            }
        }
        if (imgHovered) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
    }, [imgHovered])   //adds event listener to off img "activation"

    const moveImageOnMobile = (fromIndex: number, toIndex: number) => {
        setWarning("");
        const newPhotos = [...photos];
        [newPhotos[fromIndex], newPhotos[toIndex]] = [newPhotos[toIndex], newPhotos[fromIndex]];
        setPhotos(newPhotos);
        setImgHovered(false);
    };

    return (
        <div className={`max-w-40 h-32 m:w-48 m:h-40 m:max-w-full bg-white border-2 border-gray-300 rounded-md 
        cursor-pointer relative transition-transform duration-200 ${imgHovered && "brightness-75 scale-105"}`}
            onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
            {preview === "" ? (
                <>
                    <input className="w-full h-full opacity-0 cursor-pointer"
                           ref={fileInputRef} type="file" accept="image/*" title="" multiple
                           onMouseEnter={!isMobile ? () => setAnimation("animate-pop") : undefined}
                           onMouseLeave={!isMobile ? () => setAnimation(null) : undefined}
                           onChange={handleImageChange}
                           onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}/>
                    <FontAwesomeIcon className={`absolute inset-0 m-auto text-2xl m:text-3xl pointer-events-none ${animation}`} icon={faImage}/>
                </>
            ) : (
                <div className="w-full h-full" ref={imageRef}
                     onMouseEnter={!isMobile ? () => setImgHovered(true) : undefined}
                     onMouseLeave={!isMobile ? () => setImgHovered(false) : undefined}>
                    {index === 0 && <p className="absolute left-1 bottom-1 p-0.5 text-lg m:text-xl bg-lime rounded">MAIN</p>}
                    <img className={`w-full h-full object-cover rounded`}
                         alt="Car Image" draggable={true} src={preview}
                         onDragStart={(e) => handleDragStart(e, index)}
                         onTouchStart={isMobile ? handleTouch : undefined}/>
                    {imgHovered && (
                        <button className={`flex absolute top-1 right-1 p-2 bg-white rounded-lg ${!isMobile && "hover:brightness-90"}`}
                                onMouseUp={!isMobile ? handleImageDelete : undefined}
                                onTouchEnd={isMobile ? handleImageDelete : undefined}>
                            <FontAwesomeIcon className="text-2xl m:text-3xl" icon={faTrashCan}/>
                        </button>
                    )}
                    {imgHovered && isMobile && (
                        <div className="flex absolute bottom-1 right-1 gap-2">
                            {index > 0 && photos[index - 1] !== "" && (
                                <button className="flex bg-white p-2 rounded-lg"
                                        onTouchEnd={isMobile ? () => moveImageOnMobile(index, index - 1) : undefined}>
                                    <FontAwesomeIcon className="text-2xl m:text-3xl" icon={faArrowLeft}/>
                                </button>
                            )}
                            {index < photos.length - 1 && photos[index + 1] !== "" && (
                                <button className="flex bg-white p-2 rounded-lg"
                                        onTouchEnd={isMobile ? () => moveImageOnMobile(index, index + 1) : undefined}>
                                    <FontAwesomeIcon className="text-2xl m:text-3xl" style={{transform: "rotate(180deg)"}} icon={faArrowLeft}/>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SingularImageInput;