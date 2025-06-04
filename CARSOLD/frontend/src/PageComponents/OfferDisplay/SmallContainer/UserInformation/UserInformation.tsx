import React from "react";
import {faCircleUser, faUserXmark} from "@fortawesome/free-solid-svg-icons";
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
    userRole: string;
    setUserDeleteDecision: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserInformation: React.FC<UserInformationProps> = ({username, profilePic, name, phone, city, coordinates, permission,
                                                             id, userRole, setUserDeleteDecision}) => {

    return (
        <div className="w-full m:w-[95%] mt-4 m:mt-6 mb-8 m:mb-10 border-y m:border-2 border-black border-opacity-40 bg-white m:rounded">
            <div className="flex flex-wrap flex-row justify-center items-center w-full gap-2 m:gap-3 my-8 m:my-10 px-1 relative">
                <p className="text-2xl m:text-3xl">{username}</p>
                {profilePic !== "" ?
                    <img src={profilePic} alt={"User pic"}
                         className="w-10 h-10 m:w-12 m:h-12 object-cover rounded-full"/>
                    : <FontAwesomeIcon icon={faCircleUser} className="w-10 h-10 m:w-12 m:h-12"/>}
                {userRole === "ADMIN" && !permission &&
                    <button className="absolute -top-5 m:-top-6"
                            onClick={() => setUserDeleteDecision(true)}>
                        <FontAwesomeIcon icon={faUserXmark} className="text-xl m:text-2xl"/>
                    </button>
                }
            </div>
            <OfferButton permission={permission} id={id} username={username}/>
            <UserContactInfo name={name} phone={phone} city={city} coordinates={coordinates}/>
        </div>
    )
}

export default UserInformation