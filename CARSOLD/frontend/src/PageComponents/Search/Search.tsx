import React, {useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import SearchFilters from "./SearchFilters/SearchFilters.tsx";
import {UpdatedOffer} from "../AccountDetails/Content/MyOffers/MyOffers.tsx";
import SmallOfferDisplay from "../AccountDetails/Content/MyOffers/Atomic/SmallOfferDisplay.tsx";
import SearchOfferLoader from "../../Additional/Loading/SearchOfferLoader.tsx";

const Search: React.FC = () => {
    document.title = "CARSOLD | Search";
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 8;
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
            <div className="flex flex-col items-center -mt-12 m:-mt-14 -mb-[500px]">
                <div className="flex flex-col items-center bg-lowLime bg-opacity-90 w-full max-w-[1300px] h-full min-h-[1500px] pb-44 m:pb-48">
                    <SearchFilters setOffers={setOffers} setFetched={setFetched} setCurrentPage={setCurrentPage}/>
                    {fetched ?
                        <div className="flex flex-col items-center w-full max-w-[1200px]">
                            {offers.length > 0 ?
                                <div className="w-[90%] m:w-[95%] max-w-[700px]">
                                    {paginatedOffers.map((offer) => (
                                        <SmallOfferDisplay type="search" key={offer.id} offer={offer}/>
                                    ))}
                                    {offers.length > itemsPerPage && (
                                        <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                                            {currentPage > 0 && (
                                                <button onClick={prevPage} className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md">
                                                    {currentPage}
                                                </button>
                                            )}
                                            <button className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white rounded-md">
                                                {currentPage + 1}
                                            </button>
                                            {endIndex < offers.length && (
                                                <button onClick={nextPage} className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md">
                                                    {currentPage + 2}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                : <p className="text-xl m:text-2xl mt-36 m:mt-40">No results found</p>
                            }
                        </div> :
                        <>
                            {Array.from({length: 3}).map((_, index) => (
                                <SearchOfferLoader key={index}/>
                            ))}
                        </>}
                </div>
            </div>
        </LayOut>
    )
}

export default Search