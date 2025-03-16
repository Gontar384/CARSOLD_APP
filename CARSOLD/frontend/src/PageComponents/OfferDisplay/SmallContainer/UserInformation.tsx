import React from "react";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import OfferUserInfoLoader from "../../../Additional/Loading/OfferUserInfoLoader.tsx";

interface UserInformationProps {
    username: string;
    profilePic: string;
    offerFetched: boolean;
}

const UserInformation: React.FC<UserInformationProps> = ({username, profilePic, offerFetched}) => {

    return (
        <>
            {offerFetched ?
                <div className="flex flex-row justify-center gap-2 items-center m-2 m:m-3">
                    <p className="text-2xl m:text-3xl">{username}</p>
                    {profilePic !== "" ?
                        <img src={profilePic} alt={"User pic"} className="w-10 h-10 m:w-12 m:h-12 object-cover rounded-full"/>
                        : <FontAwesomeIcon icon={faCircleUser} className="w-10 h-10 m:w-12 m:h-12"/>}
                </div>
                : <OfferUserInfoLoader/>}
            <div className="w-full border border-black border-opacity-5"></div>
        </>
    )
}

export default UserInformation