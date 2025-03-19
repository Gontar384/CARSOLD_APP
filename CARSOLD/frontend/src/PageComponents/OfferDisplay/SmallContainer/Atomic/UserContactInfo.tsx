import React from "react";
import {faCity, faIdCard, faPhone} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {GoogleMap, LoadScript} from "@react-google-maps/api";

interface ContactInfoProps {
    name: string;
    phone: string;
    city: string;
    coordinates: string;
}

const UserContactInfo: React.FC<ContactInfoProps> = ({name, phone, city, coordinates}) => {
    const contactData = [
        {value: name, icon: faIdCard},
        {value: phone, icon: faPhone},
        {value: city, icon: faCity}
    ];
    const position = {lat: parseFloat(coordinates.split(',')[0]), lng: parseFloat(coordinates.split(',')[1])};

    return (
        <div className="flex flex-col items-center w-full mt-14 m:mt-16 gap-4 m:gap-5">
            {contactData.map((item, index) => (
                <div className="flex flex-row items-center justify-center w-[90%] gap-1.5 m:gap-2" key={index}>
                    <FontAwesomeIcon icon={item.icon} className="text-2xl m:text-3xl"/>
                    <p className="text-xl m:text-2xl">{item.value}</p>
                </div>
            ))}
            <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_APIKEY}>
                <GoogleMap mapContainerStyle={{width: "90%", height: "250px", maxWidth: "400px", border: "1px solid #2e302c", borderRadius: "8px"}}
                           center={position} zoom={11}/>
            </LoadScript>
        </div>
    )
}

export default UserContactInfo