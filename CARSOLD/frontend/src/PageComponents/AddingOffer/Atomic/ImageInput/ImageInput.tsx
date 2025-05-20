import React, {useState} from "react";
import SingularImageInput from "./Atomic/SingularImageInput.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

interface ImageInputProps {
    photos: (string)[];
    setPhotos: React.Dispatch<React.SetStateAction<(string)[]>>;
}

const ImageInput: React.FC<ImageInputProps> = ({ photos, setPhotos }) => {
    const [warning, setWarning] = useState<string>("");
    const {isMobile} = useUtil();
    const {t} = useLanguage();

    return (
        <div className="flex flex-col items-center w-fit mx-1 pb-8">
            <div className="flex flex-row items-center justify-between w-full mb-1 m:mb-2 relative">
                <span className={`text-lg m:text-xl`}>{t("offerForm97")}</span>
                <span className="text-xs m:text-sm">{!isMobile ? t("offerForm98") : t("offerForm99")}</span>
            </div>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-2 m:gap-3`}>
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
