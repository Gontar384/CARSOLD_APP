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
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
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
    }, [inputActive]);  //adds event listener to deactivate button

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
                const response: AxiosResponse = await api.post('api/storage-upload-profilePic', formData);
                if (response.data) {
                    setPicUploaded(true);
                    setInputActive(false);
                    setProfilePicChange(true);
                    setInputClickable(false)
                    if (response.data.info) {
                        setMessage(response.data.info);
                    }
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
        <div className="absolute left-0 scale-110 rounded-full" ref={componentRef}
             onMouseEnter={!isMobile ? handleActivateInput : undefined}
             onMouseLeave={!isMobile ? handleDeactivateInput : undefined}
             onTouchStart={isMobile ? handleToggleInput : undefined}
             onTouchEnd={isMobile ? handleClickable : undefined}>
            <div className={'relative w-14 h-14 xs:w-16 xs:h-16 lg:w-[72px] lg:h-[72px] xl:w-[80px] xl:h-[80px] ' +
                '2xl:w-[92px] 2xl:h-[92px] 3xl:w-[108px] 3xl:h-[108px] overflow-hidden z-20 ' +
                ` ${profilePicFetched ? "" : "bg-lowLime"}`} style={{clipPath: 'circle(50%)'}}>
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
                                <FontAwesomeIcon icon={faCirclePlus}
                                                 className={`w-1/3 h-1/3 animate-shock ${hideButton ? "hidden" : ""}`}/>
                            </div>
                        )}
                        {!picUploaded && <LoadingPicAnimation/>}
                    </div>
                ) : (
                    <ProfilePicLoader/>
                )}
            </div>
            {inputActive && picUploaded && profilePic && !imageError &&
                <button className={`absolute -bottom-[2px] -right-[5px] xs:-bottom-[1px] lg:bottom-0 lg:-right-[6px] 
                xl:bottom-[1px] xl:-right-[8px] 2xl:-right-[9px] 3xl:bottom-[2px] 3xl:-right-[10px] z-10 
                ${inputActive ? "animate-slideInDiagonal" : ""} ${hideButton ? "hidden" : ""}`}
                        onClick={handleDeletePic}>
                    <FontAwesomeIcon icon={faTrash} className="text-[9px] xs:text-[10px] lg:text-xs xl:text-sm 2xl:text-base
                                                    3xl:text-lg scale-90"/>
                </button>}
        </div>
    )
}

export default Image