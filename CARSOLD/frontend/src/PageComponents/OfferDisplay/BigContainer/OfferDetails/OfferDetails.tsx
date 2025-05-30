import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar, faCarSide, faCircleInfo, faGasPump, faRoad} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../../../CustomHooks/useButton.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

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
    const {t, translate} = useLanguage();
    const details = [
        {value: translate("bodyType", bodyType), icon: faCarSide},
        {value: year, icon: faCalendar},
        {value: mileage + " km", icon: faRoad},
        {value: translate("fuel", fuel), icon: faGasPump}
    ];
    const moreDetails = [
        {label: t("offerDisplay17"), value: capacity + " cm3"},
        {label: t("offerDisplay18"), value: power + t("offerDisplay7")},
        {label: t("offerDisplay19"), value: translate("drive", drive)},
        {label: t("offerDisplay20"), value: translate("transmission", transmission)},
        {label: t("offerDisplay21"), value: translate("color", color)},
        {label: t("offerDisplay22"), value: translate("condition", condition)}
    ];
    const additionalDetails = [
        seats && <><span className="font-bold">{seats}</span>{t("offerDisplay8")}</>,
        doors && <><span className="font-bold">{doors}</span> {t("offerDisplay9")}</>,
        steeringWheel && <>{t("offerDisplay10")}<span className="font-bold">{translate("steeringWheel", steeringWheel).toLowerCase()}</span></>,
        country && <>{t("offerDisplay11")}<span className="font-bold">{translate("country", country)}</span></>
    ];
    const registrationInfo = [
        {label: "VIN:", value: vin},
        {label: t("offerDisplay12"), value: plate},
        {label: t("offerDisplay13"), value: firstRegistration?.split("-").reverse().join("-")}
    ];
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>(null);
    const {buttonColor, bindHoverHandlers} = useButton();

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
                    window.scrollBy({ top: -850, behavior: "smooth" });
                }, 0);
            }
            return !prev;
        });
    };

    return (
        <div className="w-[95%] bg-white rounded border-2 border-black border-opacity-40 mb-8 m:mb-16">
            <p className="text-2xl m:text-3xl text-center font-bold mt-6 m:mt-8">{brand + " " + model}</p>
            <div className="flex flex-row justify-evenly mt-10 m:mt-12">
                {details.map((item, index) => (
                    <div className="flex flex-col items-center justify-center gap-1.5 m:gap-2" key={index}>
                        <FontAwesomeIcon icon={item.icon} className="text-3xl m:text-4xl"/>
                        <p className="text-base m:text-lg text-center">{item.value}</p>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap flex-row justify-evenly items-center mt-6 m:mt-8 gap-3 px-3">
                {moreDetails.map((item, index) => (
                    <div className="flex flex-col items-center justify-center w-28 m:w-32 h-14 m:h-16
                    border border-black border-opacity-40 rounded-xl bg-gray-50 text-xs m:text-sm" key={index}>
                        <p>{item.label}</p>
                        <p className="font-bold">{item.value}</p>
                    </div>
                ))}
            </div>
            {(seats || doors || steeringWheel || country) &&
                <div className="flex flex-row justify-center items-center mt-7 m:mt-8 px-3 m:px-4 py-1 border-y border-black border-opacity-40">
                    {additionalDetails.length > 0 && (
                        <div className="text-center">
                            {additionalDetails.filter(Boolean).map((item, index, arr) => (
                                <span className="text-sm m:text-base" key={index}>
                                    {item} {index < arr.length - 1 && " • "}
                                </span>
                            ))}
                        </div>
                    )}
                </div>}
                {(vin || plate || firstRegistration) &&
                    <div className="flex flex-col items-center justify-center mt-8 m:mt-10">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-xl m:text-2xl mb-4"/>
                        {registrationInfo.map((item, index) => (
                            item.value !== "" &&
                            <div className="flex flex-row gap-0.5 m:gap-1 text-sm m:text-base" key={index}>
                                <p>{item.label}</p>
                                <p className="font-bold">{item.value}</p>
                            </div>
                        ))}
                    </div>
                }
            <div className="flex justify-center my-10 m:my-12">
                <div className="w-[95%]">
                    <p className="mb-0.5 m:mb-1 text-base m:text-lg font-bold">{t("offerDisplay14")}</p>
                    <div className={`${!isExpanded && "max-h-[200px] m:max-h-[300px]"} p-1.5 m:p-2 text-sm m:text-base relative
                    rounded border border-black border-opacity-10 whitespace-pre-wrap break-words overflow-hidden`} ref={textRef}>
                        {description}
                        {!isExpanded && isOverflowing && <div className="absolute bottom-0 w-full h-8 m:h-10 bg-gradient-to-t from-white to-transparent"></div>}
                    </div>
                    {isOverflowing && (
                        <button className={`text-sm m:text-base mt-2 ${buttonColor && "underline"}`}
                                onClick={toggleExpand} {...bindHoverHandlers()}>
                            {isExpanded ? t("offerDisplay15") : t("offerDisplay16")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};

export default OfferDetails