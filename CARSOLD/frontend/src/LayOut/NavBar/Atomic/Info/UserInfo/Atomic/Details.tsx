import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";
import {useNavigate} from "react-router-dom";
import {useUserUtil} from "../../../../../../GlobalProviders/UserUtil/useUserUtil.ts";
import {useMessages} from "../../../../../../GlobalProviders/Messages/useMessages.ts";

interface DetailsProps {
    iconAnimation?: "animate-pop" | null;
    letClick?: boolean;
}

const Details: React.FC<DetailsProps> = ({iconAnimation, letClick}) => {
    const {username, profilePic} = useUserUtil();
    const {unseenMessagesCount} = useMessages();
    const {bigWidth, isMobile} = useUtil();
    const [imageError, setImageError] = useState<boolean>(false);   //handles image display error
    const navigate = useNavigate();

    return (
        <div className="flex flex-row items-center h-full gap-[5px] relative cursor-pointer"
             onClick={!isMobile || letClick ? () => navigate("/details/myOffers?page=0") : undefined}>
            <div className="w-7 h-7">
                {profilePic !== "" && !imageError ? (
                    <img src={profilePic} alt="Profile Picture"
                         className={`object-cover w-full h-full rounded-full ${iconAnimation}`}
                         onError={() => setImageError(true)}/>
                ) : (
                    <FontAwesomeIcon icon={faCircleUser} className={`w-full h-full ${iconAnimation}`}/>)}
            </div>
            <div className="text-2xl whitespace-nowrap">
                {username}
            </div>
            {unseenMessagesCount > 0 && bigWidth &&(
                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}}
                                 className="absolute -right-4 top-6 text-[10px]"/>)}
        </div>
    )
}

export default Details