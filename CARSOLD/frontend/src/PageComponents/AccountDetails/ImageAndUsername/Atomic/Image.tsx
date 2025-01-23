import React, {useEffect, useRef, useState} from "react";
import {faCirclePlus, faCircleUser, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUserDetails} from "../../../../CustomHooks/useUserDetails.ts";
import ProfilePicLoader from "../../../../SharedComponents/Additional/Loading/ProfilePicLoader.tsx";
import {api} from "../../../../Config/AxiosConfig/AxiosConfig.ts";
import LoadingPicAnimation from "../../../../SharedComponents/Additional/Loading/LoadingPicAnimation.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import {useItems} from "../../../../GlobalProviders/Items/useItems.ts";
import {useAuth} from "../../../../GlobalProviders/Auth/useAuth.ts";
import {AxiosResponse} from "axios";

interface ImageProps {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Image: React.FC<ImageProps> = ({setMessage}) => {

    const {isMobile, CreateDebouncedValue} = useUtil();

    const [inputActive, setInputActive] = useState<boolean>(false);
    const [inputHovered, setInputHovered] = useState<boolean>(false);
    const debouncedHover: boolean = CreateDebouncedValue(inputHovered, 300)
    const [inputClickable, setInputClickable] = useState<boolean>(false);
    const [hideButton, setHideButton] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar
    const [imageError, setImageError] = useState<boolean>(false);   //handles image display error

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
        if (!debouncedHover && !inputHovered) {
            setInputActive(false);
        }
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

    const [picUploaded, setPicUploaded] = useState<boolean>(true);   //for loading animation
    const {setProfilePicChange} = useItems();

    const handleUploadPic = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMessage("This is not an image!");
                return;
            }
            if (file.size > 3 * 1024 * 1024) {
                setMessage("Couldn't upload, image is too large.");
                return;
            }
            setMessage("");
            setPicUploaded(false);
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response: AxiosResponse = await api.put('api/storage-upload-profilePic', formData);
                if (response.data) {
                    setPicUploaded(true);
                    setInputActive(false);
                    setProfilePicChange(true);
                    setInputClickable(false)
                    if (!response.data.info) setMessage("Couldn't upload, image is inappropriate.");
                }
            } catch (error) {
                console.log('Error uploading pic: ', error);
            }
        }
    }   //uploads pic

    const handleDeletePic = async () => {
        setPicUploaded(false);
        setInputActive(false);
        try {
            const response: AxiosResponse = await api.delete('api/storage-delete-profilePic');
            if (response.data) {
                setPicUploaded(true);
                setProfilePicChange(true);
                setInputClickable(false);
            }
        } catch (error) {
            console.error("Error deleting profilePic: ", error);
        }
    }

    const {profilePic, profilePicFetched, handleProfilePicFetch} = useUserDetails();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        handleProfilePicFetch().then();
    }, [handleProfilePicFetch, isAuthenticated, picUploaded]);  //fetches pic

    return (
        <div className="absolute left-0 scale-125 rounded-full" ref={componentRef}
             onMouseEnter={!isMobile ? handleActivateInput : undefined}
             onMouseLeave={!isMobile ? handleDeactivateInput : undefined}
             onTouchStart={isMobile ? handleToggleInput : undefined}
             onTouchEnd={isMobile ? handleClickable : undefined}>
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
                                {inputClickable &&
                                    <input type="file" accept="image/*" title=""
                                           className="file-input absolute inset-0 w-full h-full opacity-0 z-30 cursor-pointer"
                                           onChange={handleUploadPic} onClick={() => setHideButton(true)}/>}
                                {!hideButton && <FontAwesomeIcon icon={faCirclePlus} className="w-1/2 h-1/2 animate-shock"/>}
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