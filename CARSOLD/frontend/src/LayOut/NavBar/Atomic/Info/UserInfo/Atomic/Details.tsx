import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {useItems} from "../../../../../../GlobalProviders/Items/useItems.ts";
import {useUtil} from "../../../../../../GlobalProviders/Util/useUtil.ts";

interface DetailsProps {
    iconAnimation?: "animate-pop" | null;
    username: string;
    profilePic: string;
}

const Details: React.FC<DetailsProps> = ({iconAnimation, username, profilePic}) => {

    const {messages} = useItems();
    const {bigWidth} = useUtil();
    const [imageError, setImageError] = useState<boolean>(false);   //handles image display error

    return (
        <div className="flex flex-row items-center h-full gap-[5px] relative">
            <div className="w-7 h-7">
                {profilePic !== "" && !imageError ? (
                    <img src={profilePic} alt="Profile Picture"
                         className={`object-cover w-full h-full rounded-full ${iconAnimation}`}
                         onError={() => setImageError(true)}/>
                ) : (
                    <FontAwesomeIcon icon={faCircleUser} className={`w-full h-full ${iconAnimation}`}/>)}
            </div>
            <div
                className="text-2xl whitespace-nowrap">
                {username}
            </div>
            {messages > 0 && bigWidth &&(
                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000"}}
                                 className="absolute -right-4 top-6 text-[10px]"/>)}
        </div>
    )
}

export default Details