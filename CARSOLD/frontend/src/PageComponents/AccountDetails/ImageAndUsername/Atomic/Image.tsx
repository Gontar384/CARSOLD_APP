import React, {useEffect, useRef, useState} from "react";
import {faCirclePlus, faCircleUser, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUserUtil} from "../../../../CustomHooks/useUserUtil.ts";
import ProfilePicLoader from "../../../../SharedComponents/Additional/Loading/ProfilePicLoader.tsx";
import LoadingPicAnimation from "../../../../SharedComponents/Additional/Loading/LoadingPicAnimation.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {deleteProfilePic, uploadProfilePic} from "../../../../ApiCalls/Service/UserService.ts";
import {InternalServerError, UnprocessableEntityError, UnsupportedMediaTypeError} from "../../../../ApiCalls/Errors/CustomErrors.ts";

interface ImageProps {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Image: React.FC<ImageProps> = ({setMessage}) => {

    const [inputActive, setInputActive] = useState<boolean>(false);
    const [inputHovered, setInputHovered] = useState<boolean>(false);
    const {isMobile, CreateDebouncedValue} = useUtil();
    const debouncedHover: boolean = CreateDebouncedValue(inputHovered, 300)
    const [inputClickable, setInputClickable] = useState<boolean>(false);
    const [hideButton, setHideButton] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar
    const [imageError, setImageError] = useState<boolean>(false);   //handles image display error
    const [picUploaded, setPicUploaded] = useState<boolean>(true);   //for loading animation
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const {setProfilePicChange} = useItems();
    const {profilePic, profilePicFetched, handleFetchProfilePic} = useUserUtil();
    const {isAuthenticated} = useAuth();

    const handleActivateInput = () => {
        setInputActive(true);
        setInputHovered(true);
        setInputClickable(true);
        setHideButton(false);
    }   //activates on mouse

    const handleDeactivateInput = () => {
        setInputHovered(false);
        setInputClickable(false);
    }   //deactivates on mouse

    useEffect(() => {
        if (!debouncedHover && !inputHovered) setInputActive(false);
    }, [debouncedHover, inputHovered]);   //delays deactivation

    const handleToggleInput = () => {
        setInputActive(true);
        setHideButton(false);
    }

    const handleClickable = () => {
        setTimeout(() => {
            setInputClickable(true);
        }, 100)
    }    //makes "clickable" delayed

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setInputActive(false);
                setInputClickable(false);
            }
        };
        if (inputActive) {
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [inputActive, inputClickable]);  //adds event listener to deactivate button

    const handleUploadPic = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (isDisabled) return;

        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setMessage("This is not an image!");
            return;
        }
        if (file.size > 3 * 1024 * 1024) {
            setMessage("Couldn't upload, image is too large.");
            return;
        }
        const formData = new FormData();
        formData.append('file', file);

        setPicUploaded(false);
        setIsDisabled(true);
        try {
            await uploadProfilePic(formData);
            setProfilePicChange(true);
        } catch (error: unknown) {
            if (error instanceof UnsupportedMediaTypeError) {
                setMessage("Provided image is not supported.")  //fallback check
            } else if (error instanceof UnprocessableEntityError) {
                setMessage("Couldn't upload, image is inappropriate.");
            } else if (error instanceof InternalServerError) {
                setMessage("Couldn't upload image.")
            } else {
                console.error("Unexpected error during image upload occurred: ", error);
            }
        } finally {
            setPicUploaded(true);
            setInputActive(false);
            setInputClickable(false)
            setIsDisabled(false);
        }
    }   //uploads pic

    const handleDeletePic = async () => {
        if (isDisabled) return;

        setPicUploaded(false);
        setIsDisabled(true);
        try {
            await deleteProfilePic();
            setProfilePicChange(true);
        } catch (error: unknown) {
            setMessage("Couldn't delete image.")
            if (error instanceof InternalServerError) {
                console.error("Problem with external cloud: ", error);
            } else {
                console.error("Unexpected error deleting profile pic");
            }
        } finally {
            setPicUploaded(true);
            setInputActive(false);
            setInputClickable(false);
            setIsDisabled(false);
        }
    }

    useEffect(() => {
        handleFetchProfilePic();
    }, [handleFetchProfilePic, isAuthenticated, picUploaded]);  //fetches pic

    return (
        <div className="absolute left-0 scale-125 rounded-full" ref={componentRef}
             onMouseEnter={!isMobile ? handleActivateInput : undefined}
             onMouseLeave={!isMobile ? handleDeactivateInput : undefined}
             onTouchStart={isMobile ? handleToggleInput : undefined}
             onTouchEnd={isMobile ? handleClickable : undefined}>
            <div
                className={`relative w-[70px] h-[70px] m:w-[80px] m:h-[80px] overflow-hidden z-20 ${profilePicFetched ? "" : "bg-lowLime"}`}
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
                                {inputClickable &&
                                    <input type="file" accept="image/*" title=""
                                           className="file-input absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
                                           onChange={handleUploadPic} onClick={() => setHideButton(true)}/>}
                                {!hideButton &&
                                    <FontAwesomeIcon icon={faCirclePlus} className="w-1/2 h-1/2 animate-shock"/>}
                            </div>
                        )}
                        {!picUploaded && <LoadingPicAnimation/>}
                    </div>
                ) : (
                    <ProfilePicLoader/>
                )}
            </div>
            {inputActive && picUploaded && profilePic && !imageError && !hideButton &&
                <button className={`absolute -bottom-1 -right-[14px] m:-right-4 px-[6px] m:pt-[2px] z-10 
                ${inputActive ? "animate-slideInDiagonal" : ""}`}
                        onClick={handleDeletePic}>
                    <FontAwesomeIcon icon={faTrash} className="text-sm m:text-base"/>
                </button>}
        </div>
    )
}

export default Image