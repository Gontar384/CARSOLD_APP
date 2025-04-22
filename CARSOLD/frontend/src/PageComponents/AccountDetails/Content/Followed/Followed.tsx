import React, {useEffect, useState} from "react";
import {useOfferUtil} from "../../../../CustomHooks/useOfferUtil.ts";
import UserOfferLoader from "../../../../Additional/Loading/UserOfferLoader.tsx";
import SmallOfferDisplay from "../MyOffers/Atomic/SmallOfferDisplay.tsx";

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
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 3;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOffers = offers.slice(startIndex, endIndex);
    const {handleFetchAllFollowed, offerFetched} = useOfferUtil();
    const [followed, setFollowed] = useState<boolean>(false);

    const nextPage = () => {
        if (endIndex < offers.length) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    useEffect(() => {
        const manageHandleFetchAllFollowed = async () => {
            const offerData = await handleFetchAllFollowed();
            if (offerData) {
                const formattedOffers: UpdatedOffer[] = offerData.map((offer: FetchedOffer) => ({
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
            }
        };
        manageHandleFetchAllFollowed();
        setFollowed(false);
    }, [followed]); //fetch offers

    return (
        <>
            {offerFetched ? (
                offers.length > 0 ? (
                    <div className="w-[90%] m:w-[95%] h-full max-w-[700px]">
                        {paginatedOffers.map((offer) => (
                            <SmallOfferDisplay type="followed" key={offer.id} offer={offer} setFollowed={setFollowed}/>
                        ))}
                        {offers.length > itemsPerPage &&
                            <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                                <button onClick={prevPage} disabled={currentPage === 0}
                                        className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white
                                    rounded-md disabled:opacity-60">
                                    Previous
                                </button>
                                <button onClick={nextPage} disabled={endIndex >= offers.length}
                                        className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white
                                    rounded-md disabled:opacity-60">
                                    Next
                                </button>
                            </div>
                        }
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