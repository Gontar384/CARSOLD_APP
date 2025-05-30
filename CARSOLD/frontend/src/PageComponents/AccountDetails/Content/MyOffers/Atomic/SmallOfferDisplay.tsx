import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendarDays, faEye, faHeart, faImage, faRoad} from "@fortawesome/free-solid-svg-icons";
import {useUtil} from "../../../../../GlobalProviders/Util/useUtil.ts";
import {Link, useNavigate} from "react-router-dom";
import MyOfferButton from "./Atomic/MyOfferButton.tsx";
import ConfirmDeleteWindow from "../../../../AddingOffer/Atomic/Button/ConfirmDeleteWindow/ConfirmDeleteWindow.tsx";
import MyOfferDetail from "./Atomic/MyOfferDetail.tsx";
import {deleteOffer} from "../../../../../ApiCalls/Services/OfferService.ts";
import {NotFoundError} from "../../../../../ApiCalls/Errors/CustomErrors.ts";
import AddingOfferLoader from "../../../../../Additional/Loading/AddingOfferLoader.tsx";
import AnimatedBanner from "../../../../../Additional/Banners/AnimatedBanner.tsx";
import {useOfferUtil} from "../../../../../CustomHooks/useOfferUtil.ts";
import {useLanguage} from "../../../../../GlobalProviders/Language/useLanguage.ts";

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
    type: "myOffers" | "followed" | "search";
    setDeleted?: React.Dispatch<React.SetStateAction<boolean>>;
    setFollowed?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SmallOfferDisplay: React.FC<SmallOfferDisplayProps> = ({offer, type, setDeleted, setFollowed}) => {
    const [photoError, setPhotoError] = useState<boolean>(false);
    const formatNumber = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    const {t, translate} = useLanguage();
    const offerDetails = [
        {label: formatNumber(offer.power) + t("smallOfferDisplay1")},
        {label: formatNumber(offer.capacity) + " cm3"},
        {label: translate("transmission", offer.transmission)},
        {label: translate("fuel", offer.fuel)},
    ];
    const {isMobile} = useUtil();
    const [heartHovered, setHeartHovered] = useState<boolean>(false);
    const navigate = useNavigate();
    const [decision, setDecision] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [wentWrong, setWentWrong] = useState<boolean>(false);
    const {handleFetchStats, handleFollowAndCheck} = useOfferUtil();
    const [views, setViews] = useState<number>(0);
    const [follows, setFollows] = useState<number>(0);
    const [linkDisabled, setLinkDisabled] = useState<boolean>(true);

    useEffect(() => {
        const manageHandleFetchStats = async (id: number | null) => {
            const response = await handleFetchStats(id);
            setViews(response.views);
            setFollows(response.follows);
        };
        if (type === "myOffers") {
            manageHandleFetchStats(offer.id);
        }
    }, []);

    const handleDeleteOffer = async () => {
        if (disabled) return;

        setDisabled(true);
        setLoading(true);
        setDecision(false);
        try {
            await deleteOffer(offer.id);
            sessionStorage.setItem("offerDeleted", "true");
        } catch (error: unknown) {
            setWentWrong(true);
            if (error instanceof NotFoundError) {
                console.error("Offer not found");
            } else {
                console.error("Unexpected error during offer removal");
            }
        } finally {
            setLoading(false);
            setTimeout(() => setDisabled(false), 500);
            setDeleted?.(true);
        }
    };

    const handleFollow = async (id: number | null, follow: boolean) => {
        if (disabled) return;
        setDisabled(true);
        await handleFollowAndCheck(id, follow);
        setFollowed?.(true);
        setTimeout(() => setDisabled(false), 500);
    };

    const PriceDiv = () => (
        <div className={`flex ${isMobile ? "flex-row mt-1.5 gap-1" : "flex-col justify-end"} text-sm m:text-xl font-bold text-coolRed`}>
            <p className={`${isMobile && "order-2"} text-nowrap`}>{offer.currency}</p>
            <p className={`${isMobile && "order-1"} text-nowrap`}>{formatNumber(offer.price)}</p>
        </div>
    );

    useEffect(() => {
        setTimeout(() => {
            setLinkDisabled(false);
        }, 150);
    }, []);  //prevents bug, when user after login instantly clicked link

    return (
        <>
            <div className="relative mt-8 m:mt-10 w-full">
                <Link className="flex flex-row bg-white border border-black border-opacity-50 p-1 m:p-2 rounded overflow-hidden cursor-pointer"
                    to={`/displayOffer/${offer.id}`} onClick={(e) => {if (linkDisabled) e.preventDefault()}}>
                    <div className="w-28 m:w-44 h-fit">
                        <div className="w-28 h-24 m:w-44 m:h-36 flex-shrink-0 rounded">
                            {offer.photoUrl !== "" && !photoError ?
                                <img src={offer.photoUrl} alt={"Offer image"}
                                     className="object-cover w-full h-full rounded"
                                     onError={() => setPhotoError(true)}/> :
                                <div className="flex justify-center items-center w-full h-full border border-black border-opacity-40 rounded">
                                    <FontAwesomeIcon icon={faImage} className="text-3xl m:text-4xl"/>
                                </div>}
                        </div>
                        {isMobile && <PriceDiv/>}
                    </div>
                    <div className="flex flex-col w-full min-w-0 mx-1 m:mx-2">
                        <p className={`text-lg m:text-xl font-bold pb-3 ${isMobile && "truncate"}`}>{offer.title}</p>
                        <div className={`flex flex-col ${!isMobile && "justify-between"} h-full`}>
                            <div className="flex flex-wrap text-xs m:text-sm gap-1 m:gap-1.5 text-gray-600">
                                {offerDetails.map((detail, index) => (
                                    <p className="border border-gray-600 rounded border-opacity-40 p-[1px] m:p-[2px]"
                                       key={index}>
                                        {detail.label}
                                    </p>
                                ))}
                            </div>
                            <div className={`flex flex-row flex-wrap gap-4 mt-4 ${isMobile && "justify-end h-full"}`}>
                                <div className={`flex flex-row ${!isMobile ? "items-center" : "items-end"} gap-[2px] m:gap-1.5`}>
                                    <FontAwesomeIcon icon={faRoad}
                                                     className={`text-sm m:text-base ${isMobile && "mb-[2px]"}`}/>
                                    <p className="text-xs m:text-sm text-nowrap">{formatNumber(offer.mileage) + " km"}</p>
                                </div>
                                <div
                                    className={`flex flex-row ${!isMobile ? "items-center" : "items-end"} gap-1 m:gap-1.5`}>
                                    <FontAwesomeIcon icon={faCalendarDays}
                                                     className={`text-sm m:text-base ${isMobile && "mb-[3px]"}`}/>
                                    <p className="text-xs m:text-sm text-nowrap">{offer.year}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {!isMobile && <PriceDiv/>}
                </Link>
                {type === "followed" &&
                    <button className="flex absolute -top-2 -right-[11px] m:-top-2.5 m:-right-3.5"
                            onClick={() => handleFollow(offer.id, true)}
                            onMouseEnter={!isMobile ? () => setHeartHovered(true) : undefined}
                            onMouseLeave={!isMobile ? () => setHeartHovered(false) : undefined}
                            onTouchStart={isMobile ? () => setHeartHovered(true) : undefined}
                            onTouchEnd={isMobile ? () => setHeartHovered(false) : undefined}>
                        <FontAwesomeIcon icon={faHeart}
                                         className={`text-2xl m:text-3xl text-coolRed ${heartHovered && "brightness-[115%]"}`}/>
                    </button>
                }
            </div>
            {type === "myOffers" &&
                <>
                    <div className="flex flex-row justify-between gap-2 mt-1 m:mt-1.5">
                        <div className="flex flex-row flex-wrap gap-2 m:gap-3">
                            <MyOfferButton label={t("smallOfferDisplay2")} onClick={() => navigate(`/modifyingOffer/${offer.id}`)}/>
                            <MyOfferButton label={t("smallOfferDisplay3")} onClick={() => setDecision(true)}/>
                        </div>
                        <div className="flex flex-row flex-wrap gap-3 m:gap-4">
                            <MyOfferDetail label={t("smallOfferDisplay4")} icon={faEye} count={views}/>
                            <MyOfferDetail label={t("smallOfferDisplay5")} icon={faHeart} count={follows}/>
                        </div>
                    </div>
                    {decision && (<ConfirmDeleteWindow decision={decision} setDecision={setDecision}
                                                       onClick={handleDeleteOffer} deleteType={"offer"}/>)}
                </>
            }
            {loading && <AddingOfferLoader/>}
            {wentWrong && <AnimatedBanner text={t("animatedBanner1")} onAnimationEnd={() => setWentWrong(false)}
                                          delay={3000} color={"bg-coolYellow"} z={"z-10"}/>}
        </>
    );
};

export default SmallOfferDisplay