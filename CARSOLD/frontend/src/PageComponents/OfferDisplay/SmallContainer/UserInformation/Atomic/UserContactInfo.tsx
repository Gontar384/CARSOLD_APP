import React from "react";
import {faCity, faIdCard, faPhone} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";

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

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_MAPS_APIKEY,
        id: 'google-map-script',
    });

    return (
        <div className="flex flex-col items-center w-full my-6 m:my-8 gap-4 m:gap-5">
            {(name || phone || city) &&
                <div className="flex flex-col items-center justify-center w-full gap-4 m:gap-5 border-y
                border-black border-opacity-40 py-3 m:py-4">
                    {contactData.map((item, index) => (
                        item.value &&
                        <div className="flex flex-row items-center w-[90%] gap-1.5 m:gap-2" key={index}>
                            <FontAwesomeIcon icon={item.icon} className="text-2xl m:text-3xl"/>
                            <p className="text-xl m:text-2xl">{item.value}</p>
                        </div>
                    ))}
                </div>}
            {city && isLoaded &&
                <GoogleMap mapContainerStyle={{
                    width: "90%",
                    height: "280px",
                    maxWidth: "400px",
                    border: "1px solid #777777",
                    borderRadius: "4px"
                }} center={position} zoom={11}/>
            }
        </div>
    )
}

export default UserContactInfo