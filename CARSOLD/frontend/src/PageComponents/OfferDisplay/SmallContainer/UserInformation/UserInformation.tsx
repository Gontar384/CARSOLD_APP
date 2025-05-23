import React from "react";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import OfferButton from "./Atomic/OfferButton.tsx";
import UserContactInfo from "./Atomic/UserContactInfo.tsx";

interface UserInformationProps {
    username: string;
    profilePic: string;
    name: string;
    phone: string;
    city: string;
    coordinates: string;
    permission: boolean;
    id: number | null;
}

const UserInformation: React.FC<UserInformationProps> = ({username, profilePic, name, phone,
                                                             city, coordinates, permission, id}) => {

    return (
        <div className="w-[95%] mt-1.5 m:mt-2 mb-6 m:mb-8 border-2 border-black border-opacity-40 bg-white rounded">
            <div className="flex flex-wrap flex-row justify-center items-center w-full gap-2 m:gap-3 my-8 m:my-10 px-1">
                <p className="text-2xl m:text-3xl">{username}</p>
                {profilePic !== "" ?
                    <img src={profilePic} alt={"User pic"}
                         className="w-10 h-10 m:w-12 m:h-12 object-cover rounded-full"/>
                    : <FontAwesomeIcon icon={faCircleUser} className="w-10 h-10 m:w-12 m:h-12"/>}
            </div>
            <OfferButton permission={permission} id={id} username={username}/>
            <UserContactInfo name={name} phone={phone} city={city} coordinates={coordinates}/>
        </div>
    )
}

export default UserInformation