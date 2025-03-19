import React from "react";
import {faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import OfferUserInfoLoader from "../../../Additional/Loading/OfferUserInfoLoader.tsx";
import SendMessageButton from "./Atomic/SendMessageButton.tsx";
import UserContactInfo from "./Atomic/UserContactInfo.tsx";

interface UserInformationProps {
    username: string;
    profilePic: string;
    offerFetched: boolean;
    name: string;
    phone: string;
    city: string;
    coordinates: string;
}

const UserInformation: React.FC<UserInformationProps> = ({ username, profilePic, offerFetched, name, phone, city, coordinates }) => {

    return (
            offerFetched ?
                <>
                    <div className="flex flex-row justify-center gap-2 items-center m-10 m:m-12">
                        <p className="text-2xl m:text-3xl">{username}</p>
                        {profilePic !== "" ?
                            <img src={profilePic} alt={"User pic"}
                                 className="w-10 h-10 m:w-12 m:h-12 object-cover rounded-full"/>
                            : <FontAwesomeIcon icon={faCircleUser} className="w-10 h-10 m:w-12 m:h-12"/>}
                    </div>
                    <SendMessageButton/>
                    <UserContactInfo name={name} phone={phone} city={city} coordinates={coordinates}/>
                </>
                : <OfferUserInfoLoader/>
    )
}

export default UserInformation