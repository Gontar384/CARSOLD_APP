import React from "react";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SendMessageButton from "./Atomic/SendMessageButton.tsx";
import UserContactInfo from "./Atomic/UserContactInfo.tsx";

interface UserInformationProps {
    username: string;
    profilePic: string;
    name: string;
    phone: string;
    city: string;
    coordinates: string;
}

const UserInformation: React.FC<UserInformationProps> = ({username, profilePic, name, phone, city, coordinates}) => {

    return (
        <div className="m-1.5 m:m-2 border-2 border-black border-opacity-30 bg-white rounded">
            <div className="flex flex-row justify-center items-center w-full gap-2 m:gap-3 my-8 m:my-10">
                <p className="text-2xl m:text-3xl">{username}</p>
                {profilePic !== "" ?
                    <img src={profilePic} alt={"User pic"}
                         className="w-10 h-10 m:w-12 m:h-12 object-cover rounded-full"/>
                    : <FontAwesomeIcon icon={faCircleUser} className="w-10 h-10 m:w-12 m:h-12"/>}
            </div>
            <SendMessageButton/>
            <UserContactInfo name={name} phone={phone} city={city} coordinates={coordinates}/>
        </div>
    )
}

export default UserInformation