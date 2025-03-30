import React, {useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import SearchFilters from "./SearchFilters/SearchFilters.tsx";
import {UpdatedOffer} from "../AccountDetails/Content/MyOffers/MyOffers.tsx";
import SmallOfferDisplay from "../AccountDetails/Content/MyOffers/Atomic/SmallOfferDisplay.tsx";
import UserOffersLoader from "../../Additional/Loading/UserOffersLoader.tsx";

const Search: React.FC = () => {
    document.title = "CARSOLD | Search";
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 5;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOffers = offers.slice(startIndex, endIndex);

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

    return (
        <LayOut>
            <div className="flex flex-col items-center -mt-14">
                <SearchFilters setOffers={setOffers} setFetched={setFetched}/>
                {fetched ?
                    <div className="w-[90%] m:w-[95%] max-w-[750px]">
                        {paginatedOffers.map((offer) => (
                            <SmallOfferDisplay type="search" key={offer.id} offer={offer}/>
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
                    </div> :
                    <>
                        {Array.from({length: 3}).map((_, index) => (
                            <UserOffersLoader key={index} type="myOffers"/>
                        ))}
                    </>}
            </div>
        </LayOut>
    )
}

export default Search