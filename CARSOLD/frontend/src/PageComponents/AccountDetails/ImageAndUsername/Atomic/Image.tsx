import React, {useEffect, useRef, useState} from "react";
import {faCirclePlus, faCircleUser, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ProfilePicLoader from "../../../../Additional/Loading/ProfilePicLoader.tsx";
import LoadingPicAnimation from "../../../../Additional/Loading/LoadingPicAnimation.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {deleteProfilePic, uploadProfilePic} from "../../../../ApiCalls/Services/UserService.ts";
import {InternalServerError, PayloadTooLargeError, UnprocessableEntityError, UnsupportedMediaTypeError} from "../../../../ApiCalls/Errors/CustomErrors.ts";
import {useUserUtil} from "../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

interface ImageProps {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Image: React.FC<ImageProps> = ({setMessage}) => {
    const [inputActive, setInputActive] = useState<boolean>(false);
    const {isMobile} = useUtil();
    const [inputDisabled, setInputDisabled] = useState<boolean>(true);
    const [showButton, setShowButton] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar
    const [imageError, setImageError] = useState<boolean>(false);   //handles image display error
    const [picUploaded, setPicUploaded] = useState<boolean>(true);   //for loading animation
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {profilePic, profilePicFetched, setProfilePicChanged} = useUserUtil();
    const deactivationTimeout = useRef<NodeJS.Timeout | null>(null);  //for delays
    const [changeCount, setChangeCount] = useState<number>(0);
    const {t} = useLanguage();

    const handleActivateInput = () => {
        if (!inputActive) {
            setInputActive(true);
            setShowButton(true);
        }
        if (deactivationTimeout.current) {
            clearTimeout(deactivationTimeout.current);
            deactivationTimeout.current = null;
        }
    };

    const handleDeactivateInput = () => {
        if (inputActive) {
            deactivationTimeout.current = setTimeout(() => {
                setInputActive(false);
            }, 300);
        }
    };

    const handleToggleInput = () => {
        setInputActive(true);
        setShowButton(true);
        setTimeout(() => {
            setInputDisabled(false);
        }, 300)
    };

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setInputActive(false);
                setInputDisabled(true);
            }
        };
        if (inputActive) {
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [inputActive, inputDisabled]);  //adds event listener to deactivate button

    const handleUploadPic = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isDisabled) return;
        if (changeCount >= 3) {
            setMessage(t("profilePic7"));
            return;
        }
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setMessage(t("profilePic1"));
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            setMessage(t("profilePic2"));
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        setPicUploaded(false);
        setIsDisabled(true);
        try {
            await uploadProfilePic(formData);
            setProfilePicChanged(true);
        } catch (error: unknown) {
            if (error instanceof UnsupportedMediaTypeError) {
                setMessage(t("profilePic3"))
            } else if (error instanceof PayloadTooLargeError) {
                setMessage(t("profilePic2"));
            } else if (error instanceof UnprocessableEntityError) {
                setMessage(t("profilePic4"));
            } else if (error instanceof InternalServerError) {
                setMessage(t("profilePic5"));
            } else {
                console.error("Unexpected error during image upload occurred: ", error);
            }
        } finally {
            setIsDisabled(false);
            setPicUploaded(true);
            setInputActive(false);
            setInputDisabled(true);
            setChangeCount(prev => prev + 1);
        }
    };

    const handleDeletePic = async () => {
        if (isDisabled) return;

        setPicUploaded(false);
        setIsDisabled(true);
        try {
            await deleteProfilePic();
            setProfilePicChanged(true);
        } catch (error: unknown) {
            setMessage(t("profilePic6"))
            if (error instanceof InternalServerError) {
                console.error("Problem with external cloud: ", error);
            } else {
                console.error("Unexpected error deleting profile pic");
            }
        } finally {
            setIsDisabled(false);
            setPicUploaded(true);
            setInputActive(false);
            setInputDisabled(true);
        }
    };

    return (
        <div className="absolute left-0 scale-125 rounded-full" ref={componentRef}
             onMouseEnter={!isMobile ? handleActivateInput : undefined}
             onMouseLeave={!isMobile ? handleDeactivateInput : undefined}
             onTouchEnd={isMobile ? handleToggleInput : undefined}>
            <div className={`relative w-[70px] h-[70px] m:w-[80px] m:h-[80px] overflow-hidden z-20 ${profilePicFetched ? "" : "bg-lowLime"}`}
                style={{clipPath: 'circle(50%)'}}>
                {profilePicFetched ? (
                    <div className="relative w-full h-full rounded-full">
                        {profilePic !== "" && !imageError ? (
                            <img src={profilePic} alt="Profile Picture"
                                 className="object-cover w-full h-full z-10"
                                 onError={() => setImageError(true)}/>
                        ) : (
                            <FontAwesomeIcon icon={faCircleUser} className="w-full h-full z-10"/>
                        )}
                        {inputActive && (
                            <div className="flex items-center justify-center absolute inset-0 w-full h-full
                            rounded-full bg-lowLime bg-opacity-50 z-20">
                                    <input type="file" accept="image/*" title="" disabled={isMobile ? inputDisabled : false}
                                           className="absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
                                           onChange={handleUploadPic} onClick={() => setShowButton(true)}/>
                                {showButton &&
                                    <FontAwesomeIcon icon={faCirclePlus} className="w-1/2 h-1/2 animate-shock"/>}
                            </div>
                        )}
                        {!picUploaded && <LoadingPicAnimation size={30}/>}
                    </div>
                ) : (
                    <ProfilePicLoader/>
                )}
            </div>
            {inputActive && picUploaded && profilePic && !imageError && showButton &&
                <button className={`absolute bottom-1.5 -right-4 px-1 z-10
                ${inputActive ? "animate-slideInDiagonal" : ""}`}
                        onClick={handleDeletePic}>
                    <FontAwesomeIcon icon={faTrash} className="text-xs m:text-sm"/>
                </button>}
        </div>
    )
}

export default Image