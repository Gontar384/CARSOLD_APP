import React, {useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faImage, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";

interface SingularImageInputProps {
    index: number;
    photos: (string | null)[];
    setPhotos: React.Dispatch<React.SetStateAction<(string | null)[]>>;
}

const SingularImageInput: React.FC<SingularImageInputProps> = ({index, photos, setPhotos}) => {
    const MAX_SIZE_MB = 3;
    const MAX_IMAGES = 8;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [animation, setAnimation] = useState<"animate-pop" | null>(null);
    const [imgHovered, setImgHovered] = useState<boolean>(false);
    const preview: string | null = photos[index];
    const {isMobile} = useUtil();

    const updatePhotos = (updated: (string | null)[]) => {
        const filteredPhotos: (string | null)[] = updated.filter(img => img !== null);
        while (filteredPhotos.length < MAX_IMAGES) {
            filteredPhotos.push(null);
        }
        setPhotos(filteredPhotos.slice(0, MAX_IMAGES));
    };

    const processFiles = (files: FileList | File[]) => {
        const validFiles: File[] = [];
        let remainingSlots = photos.filter(p => p === null).length;

        Array.from(files).forEach(file => {
            if (!file.type.startsWith("image/")) {
                console.warn(`File "${file.name}" is not an image and was not added.`);
            } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                console.warn(`File "${file.name}" exceeds the size limit of ${MAX_SIZE_MB}MB and was not added.`);
            } else if (remainingSlots > 0) {
                validFiles.push(file);
                remainingSlots--;
            }
        });

        if (validFiles.length === 0) return;

        const newPhotos = [...photos];

        validFiles.forEach(file => {
            const emptyIndex = newPhotos.indexOf(null);
            if (emptyIndex !== -1) {
                newPhotos[emptyIndex] = URL.createObjectURL(file);
            }
        });

        if (validFiles.length < files.length) {
            console.warn(`Only ${validFiles.length} images were added. ${files.length - validFiles.length} were ignored due to size/type/limit.`);
        }

        updatePhotos(newPhotos);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            processFiles(event.target.files);
        }
    };

    const handleImageDelete = () => {
        setImgHovered(false);
        const newPhotos = [...photos];
        newPhotos[index] = null;
        updatePhotos(newPhotos);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>, draggedIndex: number) => {
        event.dataTransfer.setData("draggedIndex", String(draggedIndex));
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const draggedIndex = event.dataTransfer.getData("draggedIndex");

        if (draggedIndex) {
            if (photos[index] === null) return;
            const newPhotos = [...photos];
            [newPhotos[index], newPhotos[Number(draggedIndex)]] = [newPhotos[Number(draggedIndex)], newPhotos[index]];
            setPhotos(newPhotos);
        } else if (event.dataTransfer.files.length > 0) {
            if (photos[index] === null) {
                processFiles(event.dataTransfer.files);
            }
        }
    };

    return (
        <div className={`max-w-44 h-36 m:w-48 m:h-40 m:max-w-full border-2 bg-white border-gray-300 rounded-md cursor-pointer relative`}
             onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()}>
            {preview === null ? (
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
                <div className="w-full h-full"
                     onMouseEnter={!isMobile ? () => setImgHovered(true) : undefined}
                     onMouseLeave={!isMobile ? () => setImgHovered(false) : undefined}>
                    <img className={`w-full h-full object-cover rounded-md ${imgHovered && "brightness-75"}`} alt="Car Image"
                         src={preview} draggable={true}
                         onDragStart={(e) => handleDragStart(e, index)} />
                    {imgHovered && (
                        <button className="absolute top-2 right-2 p-1 bg-gray-200 rounded-xl"
                                onClick={handleImageDelete}>
                            <FontAwesomeIcon className="text-2xl m:text-3xl" icon={faTrashCan}/>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default SingularImageInput;