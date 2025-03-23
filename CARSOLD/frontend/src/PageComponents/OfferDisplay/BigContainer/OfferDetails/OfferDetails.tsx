import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faCarSide, faCircleInfo, faGasPump, faRoad} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../CustomHooks/useButton.ts";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

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
        seats && <><span className="font-bold">{seats}</span> seats</>,
        doors && <><span className="font-bold">{doors}</span> doors</>,
        steeringWheel && <>steering wheel on <span className="font-bold">{steeringWheel?.toLowerCase()}</span></>,
        country && <>from <span className="font-bold">{country}</span></>
    ];
    const registrationInfo = [
        {label: "VIN:", value: vin}, {label: "License plate number:", value: plate},
        {label: "First registration:", value: firstRegistration?.split("-").reverse().join("-")}
    ];
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>(null);
    const {buttonColor, handleStart, handleEnd} = useButton();
    const {isMobile} = useUtil();

    useEffect(() => {
        if (textRef.current) {
            setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
        }
    }, [description]);

    const toggleExpand = () => {
        setIsExpanded((prev) => {
            if (prev) {
                textRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setTimeout(() => {
                    window.scrollBy({ top: isMobile ? -1200 : -500, behavior: "smooth" });
                }, 0);
            }
            return !prev;
        });
    };

    return (
        <div className="w-[95%] bg-white rounded border-2 border-black border-opacity-40 mb-14 m:mb-16">
            <p className="text-2xl m:text-3xl text-center font-bold mt-6 m:mt-8">{brand + " " + model}</p>
            <div className="flex flex-row justify-evenly mt-10 m:mt-12">
                {details.map((item, index) => (
                    <div className="flex flex-col items-center justify-center gap-1.5 m:gap-2" key={index}>
                        <FontAwesomeIcon icon={item.icon} className="text-3xl m:text-4xl"/>
                        <p className="text-lg m:text-xl">{item.value}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap flex-row justify-evenly items-center mt-6 m:mt-8 gap-1.5 m:gap-2 p-1 m:p-1.5">
                {moreDetails.map((item, index) => (
                    <div className="flex flex-col items-center justify-center w-28 h-12 m:w-32 m:h-14
                    border border-black border-opacity-40 rounded-xl bg-gray-50 text-sm m:text-base" key={index}>
                        <p>{item.label}</p>
                        <p className="font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
            {(seats || doors || steeringWheel || country) &&
                <div className="flex flex-row justify-center items-center mt-7 m:mt-8 px-3 m:px-4 border-y border-black border-opacity-40">
                    {additionalDetails.length > 0 && (
                        <div className="text-center">
                            {additionalDetails.filter(Boolean).map((item, index, arr) => (
                                <span className="text-base m:text-lg" key={index}>
                                    {item} {index < arr.length - 1 && " • "}
                                </span>
                            ))}
                        </div>
                    )}
                </div>}
                {(vin || plate || firstRegistration) &&
                    <div className="flex flex-col items-center justify-center mt-10 m:mt-12">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-2xl m:text-3xl mb-4"/>
                        {registrationInfo.map((item, index) => (
                            <div className="flex flex-row gap-0.5 m:gap-1 text-base m:text-lg" key={index}>
                                <p className="font-bold">{item.label}</p>
                                <p>{item.value}</p>
                            </div>
                        ))}
                    </div>
                }
            <div className="flex justify-center my-12 m:my-14">
                <div className="w-[95%]">
                    <p className="mb-0.5 m:mb-1 text-base m:text-lg font-bold">Description</p>
                    <div className={`${!isExpanded && "max-h-[200px] m:max-h-[300px]"} p-1.5 m:p-2 text-sm m:text-base relative
                    rounded border border-black border-opacity-10 whitespace-pre-line overflow-hidden`} ref={textRef}>
                        {description}
                        {!isExpanded && isOverflowing && <div className="absolute bottom-0 w-full h-8 m:h-10 bg-gradient-to-t from-white to-transparent"></div>}
                    </div>
                    {isOverflowing && (
                        <button className={`text-sm m:text-base mt-2 ${buttonColor && "underline"}`}
                                onClick={toggleExpand}
                                onMouseEnter={!isMobile ? handleStart : undefined}
                                onMouseLeave={!isMobile ? handleEnd : undefined}
                                onTouchStart={isMobile ? handleStart : undefined}
                                onTouchEnd={isMobile ? handleEnd :undefined}>
                            {isExpanded ? "Show Less" : "Show More"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};

export default OfferDetails