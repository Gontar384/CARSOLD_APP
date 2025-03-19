import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faCarSide, faGasPump, faRoad} from "@fortawesome/free-solid-svg-icons";

interface OfferDetailsProps {
    brand: string;
    model: string;
    bodyType: string;
    year: string;
    mileage: string;
    fuel: string;
    capacity: string;
    power: string;
    drive: string;
    transmission: string;
    color: string;
    condition: string;
    seats: string | null;
    doors: string | null;
    steeringWheel: string | null;
    country: string | null;
    vin: string | null;
    plate: string | null;
    firstRegistration: string | null;
    description: string;
}

const OfferDetails: React.FC<OfferDetailsProps> = ({ brand, model, bodyType, year, mileage, fuel, capacity, power,
                                                       drive, transmission, color, condition, seats, doors, steeringWheel,
                                                       country, vin, plate, firstRegistration, description }) => {
    const details = [
        {value: bodyType, icon: faCarSide}, {value: year, icon: faCalendar}, {value: mileage + " km", icon: faRoad}, {value: fuel, icon: faGasPump}
    ];
    const moreDetails = [
        {label: "Capacity", value: capacity + " cm3"}, {label: "Power", value: power + " KM"}, {label: "Drive", value: drive.split("(")[0]},
        {label: "Transmission", value: transmission}, {label: "Color ", value: color}, {label: "Condition ", value: condition}
    ];
    const additionalDetails = [
        seats && seats + " seats", doors && doors + " doors",
        steeringWheel && "steering wheel on " + steeringWheel, country && "from " + country
    ];

    return (
        <div className="w-full">
            <p className="text-2xl m:text-3xl text-center font-bold">{brand + " " + model}</p>
            <div className="flex flex-row justify-evenly mt-10 m:mt-12">
                {details.map((item, index) => (
                    <div className="flex flex-col items-center justify-center gap-1.5 m:gap-2" key={index}>
                        <FontAwesomeIcon icon={item.icon} className="text-3xl m:text-4xl"/>
                        <p className="text-lg m:text-xl">{item.value}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap flex-row justify-evenly items-center mt-6 m:mt-8 gap-1.5 m:gap-2 p-1.5 m:p-2">
                {moreDetails.map((item, index) => (
                    <div className="flex flex-col items-center justify-center w-28 h-12 m:w-32 m:h-14
                    border border-black border-opacity-40 rounded-xl bg-gray-50 text-sm m:text-base" key={index}>
                        <p>{item.label}</p>
                        <p className="font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
            {(seats || doors || steeringWheel || country) &&
                <div className="flex flex-row justify-center items-center mt-4 m:mt-5 border-y border-black border-opacity-40">
                    {additionalDetails.length > 0 && (
                        <p className="text-base m:text-lg">
                            {additionalDetails.filter(Boolean).join(" • ")}
                        </p>
                    )}
                </div>}
        </div>
    )
};

export default OfferDetails