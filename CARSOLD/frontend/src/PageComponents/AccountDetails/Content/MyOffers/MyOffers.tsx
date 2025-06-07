import React, {useEffect, useState} from "react";
import AnimatedBanner from "../../../../Additional/Banners/AnimatedBanner.tsx";
import SmallOfferDisplay from "./Atomic/SmallOfferDisplay.tsx";
import {useNavigate} from "react-router-dom";
import {useButton} from "../../../../CustomHooks/useButton.ts";
import {useOfferUtil} from "../../../../CustomHooks/useOfferUtil.ts";
import UserOfferLoader from "../../../../Additional/Loading/UserOfferLoader.tsx";
import {usePagination} from "../../../../CustomHooks/usePagination.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

export interface FetchedOffer {
    id: number;
    title: string;
    photoUrl: string;
    price: number;
    currency: string;
    power: number;
    capacity: number;
    transmission: string;
    fuel: string;
    mileage: number;
    year: number;
}

export interface UpdatedOffer {
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
}

const MyOffers: React.FC = () => {
    const [offerAdded, setOfferAdded] = useState<boolean>(false);
    const [offerUpdated, setOfferUpdated] = useState<boolean>(false);
    const [offerDeleted, setOfferDeleted] = useState<boolean>(false);
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const navigate = useNavigate();
    const {buttonColor, bindHoverHandlers} = useButton();
    const {handleFetchAllUserOffers, offerFetched} = useOfferUtil();
    const [deleted, setDeleted] = useState<boolean>(false);
    const itemsPerPage = 3;
    const {currentPage, setCurrentPage, setTotalPages, hasPrevPage, hasNextPage, prevPage, nextPage, hovered, bindHoverButtons} = usePagination();
    const {t} = useLanguage();
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        document.title = `CARSOLD | ${t("tabTitle6")}`;
    }, [t]);

    useEffect(() => {
        if (sessionStorage.getItem("offerAdded") === "true") {
            setOfferAdded(true);
            sessionStorage.removeItem("offerAdded");
        }
        if (sessionStorage.getItem("offerUpdated") === "true") {
            setOfferUpdated(true);
            sessionStorage.removeItem("offerUpdated");
        }
        if (sessionStorage.getItem("offerDeleted") === "true") {
            setOfferDeleted(true);
            sessionStorage.removeItem("offerDeleted");
        }
        setDeleted(false);
    }, [deleted]); //detects if offer was added, modified or deleted and displays banner

    const manageHandleFetchAllUserOffers = async () => {
        const offers = await handleFetchAllUserOffers(currentPage, itemsPerPage);
        if (offers) {
            const offersList = offers._embedded?.partialOfferDtoList ?? [];
            const formattedOffers: UpdatedOffer[] = offersList.map((offer: FetchedOffer) => ({
                id: offer.id ?? "",
                title: offer.title ?? "",
                photoUrl: offer.photoUrl ?? "",
                price: String(offer.price ?? ""),
                currency: offer.currency ?? "",
                power: String(offer.power ?? ""),
                capacity: String(offer.capacity ?? ""),
                transmission: offer.transmission ?? "",
                fuel: offer.fuel ?? "",
                mileage: String(offer.mileage ?? ""),
                year: String(offer.year ?? ""),
            }));
            setOffers(formattedOffers);
            setTotalPages(offers.page.totalPages);
        } else {
            setOffers([]);
            setTotalPages(0);
            setCurrentPage(0);
        }
    };

    useEffect(() => {
        setFetchTrigger(true);
    }, [deleted, currentPage]); //triggers fetch

    useEffect(() => {
        if (fetchTrigger){
            manageHandleFetchAllUserOffers();
            setFetchTrigger(false);
        }
        if (deleted) setDeleted(false);
    }, [fetchTrigger]); //fetches offers

    return (
        <>
            <h1 className="hidden">My offers</h1>
            {offerFetched ? (
                offers.length > 0 ? (
                    <div className="w-[90%] m:w-[95%] h-full max-w-[700px] pb-8">
                        <ul className="list-none">
                            {offers.map((offer) => (
                                <li key={offer.id}>
                                    <SmallOfferDisplay type="myOffers" offer={offer} setDeleted={setDeleted}/>
                                </li>
                            ))}
                        </ul>
                        {offers.length > 0 && (hasPrevPage || hasNextPage) && (
                            <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                                {hasPrevPage && (
                                    <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md
                                    ${hovered[0] && "ring ring-white"}`} {...bindHoverButtons(0)} onClick={prevPage}>
                                        {currentPage}
                                    </button>
                                )}
                                <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white rounded-md cursor-default`}>
                                    {currentPage + 1}
                                </button>
                                {hasNextPage && (
                                    <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md
                                    ${hovered[1] && "ring ring-white"}`} {...bindHoverButtons(1)} onClick={nextPage}>
                                        {currentPage + 2}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-[90%] m:w-[95%] h-full mt-28 m:mt-32">
                        <p className="text-xl m:text-2xl text-center">
                            {t("myOffers1")}
                        </p>
                        <button className={`mt-8 m:mt-10 text-xl m:text-2xl p-2 m:p-3 border-2 border-black border-opacity-40 rounded
                                ${buttonColor ? "bg-white" : "bg-lime"}`}
                                onClick={() => navigate("/addingOffer")} {...bindHoverHandlers()}>
                            {t("myOffers2")}
                        </button>
                    </div>
                )
            ) : (
                <>
                    {Array.from({length: 3}).map((_, index) => (
                        <UserOfferLoader key={index} type="myOffers"/>
                    ))}
                </>
            )}
            {(offerAdded || offerUpdated || offerDeleted) &&
                <AnimatedBanner text={`${t("animatedBanner2")} ${offerAdded ? t("animatedBanner3") : offerUpdated ? t("animatedBanner4") : t("animatedBanner5")} ${t("animatedBanner6")}`}
                                onAnimationEnd={offerAdded ? () => setOfferAdded(false) : offerUpdated ? () => setOfferUpdated(false) : () => setOfferDeleted(false)}
                                delay={3000} color="bg-gray-200" z="z-10"/>}
        </>
    )
}

export default MyOffers