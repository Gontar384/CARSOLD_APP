import React, {useEffect, useState} from "react";
import {useOfferUtil} from "../../../../CustomHooks/useOfferUtil.ts";
import UserOfferLoader from "../../../../Additional/Loading/UserOfferLoader.tsx";
import SmallOfferDisplay from "../MyOffers/Atomic/SmallOfferDisplay.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";

const Followed: React.FC = () => {
    document.title = "CARSOLD | Followed";
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
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 3;
    const [totalPages, setTotalPages] = useState<number>(0);
    const hasNextPage = currentPage < totalPages - 1;
    const hasPrevPage = currentPage > 0;
    const [hovered, setHovered] = useState<boolean[]>(Array(2).fill(false));
    const {isMobile} = useUtil();

    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

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

    const handleHover = (index: number, val: boolean) => {
        setHovered(prev => {
            const copy = [...prev];
            copy[index] = val;
            return copy;
        });
    };

    const bindHoverButtons = (index: number) => {
        if (isMobile) {
            return {
                onTouchStart: () => handleHover(index, true),
                onTouchEnd: () => handleHover(index, false)
            };
        } else {
            return {
                onMouseEnter: () => handleHover(index, true),
                onMouseLeave: () => handleHover(index, false)
            };
        }
    };

    useEffect(() => {
        setHovered([false, false]);
    }, [currentPage]);

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
                            You don't have any offers followed yet.
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