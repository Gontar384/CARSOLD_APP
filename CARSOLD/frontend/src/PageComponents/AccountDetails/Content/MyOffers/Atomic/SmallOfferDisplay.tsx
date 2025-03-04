import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faHeart, faImage, faRoad} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {useNavigate} from "react-router-dom";

interface SmallOfferDisplayProps {
    offer: {
        id: number;
        title: string;
        photoUrl: string;
        price: string;
        currency: string;
        power: string;
        capacity: string;
        transmission: string;
        fuel: string;
        mileage: string;
        year: string;
    };
    followForm?: boolean;
}

const SmallOfferDisplay: React.FC<SmallOfferDisplayProps> = ({offer, followForm}) => {

    const [photoError, setPhotoError] = useState<boolean>(false);
    const formatNumber = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    const offerDetails = [
        {label: formatNumber(offer.power) + " KM"},
        {label: formatNumber(offer.capacity) + " cm3"},
        {label: offer.transmission},
        {label: offer.fuel},
    ];
    const {isMobile} = useUtil();
    const PriceDiv = () => (
        <div
            className={`flex ${isMobile ? "flex-row mt-1 gap-1" : "flex-col justify-end"} text-xs m:text-lg font-bold text-coolRed`}>
            <p className={`${isMobile && "order-2"} text-nowrap`}>{offer.currency}</p>
            <p className={`${isMobile && "order-1"} text-nowrap`}>{formatNumber(offer.price)}</p>
        </div>
    );
    const [followed, setFollowed] = useState<boolean>(false);
    const [heartHovered, setHeartHovered] = useState<boolean>(false);
    const navigate = useNavigate();

    return (
        <div className="relative border mb-4 m:mb-5">
            <div className="flex flex-row bg-white border border-black border-opacity-50 p-1 m:p-1.5 rounded overflow-hidden cursor-pointer"
            onClick={() => navigate(`/modifyingOffer/${offer.id}`)}>
                <div className="w-20 m:w-32 h-fit">
                    <div className="w-20 h-20 m:w-32 m:h-32 flex-shrink-0 rounded">
                        {offer.photoUrl !== "" && !photoError ?
                            <img src={offer.photoUrl} alt={"Offer image"} className="object-cover w-full h-full rounded"
                                 onError={() => setPhotoError(true)}/> :
                            <div className="flex justify-center items-center w-full h-full border border-black border-opacity-40 rounded">
                                <FontAwesomeIcon icon={faImage} className="text-3xl m:text-4xl"/>
                            </div>}
                    </div>
                    {isMobile && <PriceDiv/>}
                </div>
                <div className="flex flex-col w-full min-w-0 mx-1 m:mx-2">
                    <p className={`text-base m:text-lg font-bold ${isMobile && "truncate"}`}>{offer.title}</p>
                    <div className={`flex flex-col ${!isMobile && "justify-between"} h-full mt-2 m:mt-2`}>
                        <div className="flex flex-wrap text-xs m:text-sm gap-1 m:gap-1.5 text-gray-600">
                            {offerDetails.map((detail, index) => (
                                <p className="border border-gray-600 rounded border-opacity-40 p-[1px] m:p-[2px]"
                                   key={index}>
                                    {detail.label}
                                </p>
                            ))}
                        </div>
                        <div className={`flex flex-row gap-4 ${isMobile && "mt-2 justify-end h-full"}`}>
                            <div className={`flex flex-row ${!isMobile ? "items-center" : "items-end"} gap-[2px] m:gap-1.5`}>
                                <FontAwesomeIcon icon={faRoad}
                                                 className={`text-xs m:text-base ${isMobile && "mb-[3px]"}`}/>
                                <p className="text-xs m:text-sm text-nowrap">{formatNumber(offer.mileage) + " km"}</p>
                            </div>
                            <div className={`flex flex-row ${!isMobile ? "items-center" : "items-end"} gap-1 m:gap-1.5`}>
                                <FontAwesomeIcon icon={faCalendarDays}
                                                 className={`text-xs m:text-base ${isMobile && "mb-[3px]"}`}/>
                                <p className="text-xs m:text-sm text-nowrap">{offer.year}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {!isMobile && <PriceDiv/>}
            </div>
            {followForm &&
                <button className="flex absolute -top-2 -right-[11px] m:-top-2.5 m:-right-3.5"
                        onClick={() => setFollowed(!followed)}
                        onMouseEnter={!isMobile ? () => setHeartHovered(true) : undefined}
                        onMouseLeave={!isMobile ? () => setHeartHovered(false) : undefined}
                        onTouchStart={isMobile ? () => setHeartHovered(true) : undefined}
                        onTouchEnd={isMobile ? () => setHeartHovered(false) : undefined}>
                    <FontAwesomeIcon icon={faHeart} className={`text-2xl m:text-3xl ${followed ? "text-coolRed" : "text-gray-800"} 
                    ${heartHovered && "brightness-[120%]"}`}/>
                </button>
            }
        </div>
    );
};

export default SmallOfferDisplay