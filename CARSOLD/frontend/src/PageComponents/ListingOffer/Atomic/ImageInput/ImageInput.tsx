import React from "react";
import SingularImageInput from "./Atomic/SingularImageInput.tsx";

interface ImageInputProps {
    photos: (string | null)[];
    setPhotos: React.Dispatch<React.SetStateAction<(string | null)[]>>;
}

const ImageInput: React.FC<ImageInputProps> = ({ photos, setPhotos }) => {

    return (
        <div className="mx-1">
            <p className="text-lg m:text-xl">Add photos</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 m:gap-3">
                {photos.map((_, index) => (
                    <SingularImageInput key={index} index={index} photos={photos} setPhotos={setPhotos}/>
                ))}
            </div>
        </div>
    );
}

export default ImageInput;
