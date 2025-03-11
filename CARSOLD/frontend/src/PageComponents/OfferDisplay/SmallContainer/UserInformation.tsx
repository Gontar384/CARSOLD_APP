import React from "react";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface UserInformationProps {
    username: string;
    profilePic: string;
    loading: boolean;
}

const UserInformation: React.FC<UserInformationProps> = ({username, profilePic, loading}) => {

    if (loading) return null;

    return (
        <>
        <div className="flex flex-row justify-center gap-2 items-center m-2 m:m-3">
            <p className="text-2xl m:text-3xl">{username}</p>
            {profilePic !== "" ?
                <img src={profilePic} alt={"User pic"} className="w-12 h-12 m:w-14 m:h-14 object-cover rounded-full"/>
                : <FontAwesomeIcon icon={faCircleUser} className="w-12 h-12 m:w-14 m:h-14"/>}
        </div>
            <div className="w-full border border-black border-opacity-5"></div>
        </>
    )
}

export default UserInformation