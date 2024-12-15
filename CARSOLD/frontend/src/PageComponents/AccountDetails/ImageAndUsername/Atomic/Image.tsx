import React, {useEffect, useRef, useState} from "react";
import {faCircleUser, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUtil} from "../../../../GlobalProviders/UtilProvider.tsx";
import {useUserDetails} from "../../../../CustomHooks/UseUserDetails.ts";
import {useAuth} from "../../../../GlobalProviders/AuthProvider.tsx";
import ProfilePicLoader from "../../../../Additional/Loading/ProfilePicLoader.tsx";
import {api} from "../../../../Config/AxiosConfig/AxiosConfig.tsx";
import LoadingPicAnimation from "../../../../Additional/Loading/LoadingPicAnimation.tsx";
import {useItems} from "../../../../GlobalProviders/ItemsProvider.tsx";

interface ImageProps {
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Image: React.FC<ImageProps> = ({setMessage}) => {

    const {isMobile} = useUtil();

    const [inputActive, setInputActive] = useState<boolean>(false);
    const [inputHovered, setInputHovered] = useState<boolean>(false);
    const {createDebouncedValue} = useUtil();
    const debouncedHover: boolean = createDebouncedValue(inputHovered, 300)
    const [iconAnimation, setIconAnimation] = useState<"animate-shock" | null>(null);
    const [animationActive, setAnimationActive] = useState<boolean>(false);
    const [inputClickable, setInputClickable] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar

    const handleActivateInput = () => {
        setInputActive(true);
        setInputHovered(true);
        if (!animationActive) {
            setIconAnimation("animate-shock");
            setAnimationActive(true);
            setInputClickable(true);
        }
    }   //activates on mouse

    const handleDeactivateInput = () => {
        setInputHovered(false);
        setIconAnimation(null);
        setInputClickable(false);
    }   //deactivates on mouse

    useEffect(() => {
        if (!debouncedHover && !inputHovered) {
            setInputActive(false);
            setAnimationActive(false);
        }
    }, [debouncedHover, inputHovered]);   //delays deactivation

    const handleToggleInput = () => {
        setInputActive(true);
        setIconAnimation("animate-shock");   //activates on touch
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
                setIconAnimation(null);
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

    const [picUploaded, setPicUploaded] = useState<boolean>(true);
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
                const response = await api.post('api/storage-upload', formData);
                if (response.data) {
                    setPicUploaded(true);
                    setProfilePicChange(true);
                    if (response.data.info) {
                        setMessage(response.data.info);
                    }
                }
            } catch (error) {
                console.log('Error uploading pic: ', error);
            }
        }
    }   //uploads pic

    const {profilePic, profilePicFetched, handleProfilePicFetch} = useUserDetails();
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        handleProfilePicFetch().then();
    }, [isAuthenticated, picUploaded]);  //fetches pic

    return (
        <div className="absolute left-0 w-14 h-14 xs:w-16 xs:h-16 lg:w-[72px] lg:h-[72px] xl:w-[80px] xl:h-[80px]
        2xl:w-[92px] 2xl:h-[92px] 3xl:w-[108px] 3xl:h-[108px] scale-110 rounded-full overflow-hidden"
             ref={componentRef}
             onMouseEnter={!isMobile ? handleActivateInput : undefined}
             onMouseLeave={!isMobile ? handleDeactivateInput : undefined}
             onTouchStart={isMobile ? handleToggleInput : undefined}
             onTouchEnd={isMobile ? handleClickable : undefined}
             style={{clipPath: 'circle(50%)'}}>
            {profilePicFetched ? (
                <div className="relative w-full h-full rounded-full">
                    {profilePic !== "" ? (
                        <img src={profilePic} alt="Profile Picture"
                             className="object-cover w-full h-full z-10"/>
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} className="w-full h-full z-10"/>
                    )}
                    {inputActive && (
                        <div className="flex items-center justify-center absolute inset-0 w-full h-full
                            rounded-full bg-lowLime bg-opacity-50 z-20">
                            {inputClickable &&
                                <input type="file" accept="image/*" title=""
                                       className="absolute inset-0 w-full h-full opacity-0 z-30"
                                       onChange={handleUploadPic}/>}
                            {picUploaded && <FontAwesomeIcon icon={faPlus} className={`text-[28px] xs:text-[32px] lg:text-[36px] xl:text-[40px] 
                                                                           2xl:text-[46px] 3xl:text-[52px] ${iconAnimation} text-black`}/>}
                            {!picUploaded && <LoadingPicAnimation/>}
                        </div>
                    )}
                </div>
            ) : (
                <ProfilePicLoader/>
            )}
        </div>

    )
}

export default Image