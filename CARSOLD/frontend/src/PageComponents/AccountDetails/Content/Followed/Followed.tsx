import React, {useEffect, useState} from "react";
import {useOfferUtil} from "../../../../CustomHooks/useOfferUtil.ts";
import UserOfferLoader from "../../../../Additional/Loading/UserOfferLoader.tsx";
import SmallOfferDisplay from "../MyOffers/Atomic/SmallOfferDisplay.tsx";
import {usePagination} from "../../../../CustomHooks/usePagination.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

const Followed: React.FC = () => {
    interface FetchedOffer {
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
    interface UpdatedOffer {
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
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const {handleFetchAllFollowed, offerFetched} = useOfferUtil();
    const [followed, setFollowed] = useState<boolean>(false);
    const itemsPerPage = 3;
    const {currentPage, setCurrentPage, setTotalPages, hasPrevPage, hasNextPage, prevPage, nextPage, hovered, bindHoverButtons} = usePagination();
    const {t} = useLanguage();
    document.title = `CARSOLD | ${t("tabTitle7")}`;

    useEffect(() => {
        const manageHandleFetchAllFollowed = async () => {
            const offers = await handleFetchAllFollowed(currentPage, itemsPerPage);
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
        manageHandleFetchAllFollowed();
        setFollowed(false);
    }, [followed, currentPage]); //fetch offers

    return (
        <>
            {offerFetched ? (
                offers.length > 0 ? (
                    <div className="w-[90%] m:w-[95%] h-full max-w-[700px] pb-8">
                        {offers.map((offer) => (
                            <SmallOfferDisplay type="followed" key={offer.id} offer={offer} setFollowed={setFollowed}/>
                        ))}
                        {offers.length > 0 && (hasPrevPage || hasNextPage) && (
                            <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                                {hasPrevPage && (
                                    <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md
                                    ${hovered[0] && "ring ring-white"}`}
                                            {...bindHoverButtons(0)} onClick={prevPage}>
                                        {currentPage}
                                    </button>
                                )}
                                <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white rounded-md cursor-default`}>
                                    {currentPage + 1}
                                </button>
                                {hasNextPage && (
                                    <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md
                                    ${hovered[1] && "ring ring-white"}`}
                                            {...bindHoverButtons(1)} onClick={nextPage}>
                                        {currentPage + 2}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                        <p className="text-xl m:text-2xl text-center mt-44 m:mt-48 w-[90%] m:w-[95%]">
                            {t("followed")}
                        </p>
                )
            ) : (
                <>
                    {Array.from({ length: 3 }).map((_, index) => (
                        <UserOfferLoader key={index} type="followed"/>
                    ))}
                </>
            )}
        </>
    )
}

export default Followed