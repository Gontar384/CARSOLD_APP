import React, {useEffect, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import SearchFilters from "./SearchFilters/SearchFilters.tsx";
import {UpdatedOffer} from "../AccountDetails/Content/MyOffers/MyOffers.tsx";
import SmallOfferDisplay from "../AccountDetails/Content/MyOffers/Atomic/SmallOfferDisplay.tsx";
import SearchOfferLoader from "../../Additional/Loading/SearchOfferLoader.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const Search: React.FC = () => {
    document.title = "CARSOLD | Search";
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 10;
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
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
        <LayOut>
            <div className="flex flex-col items-center -mt-12 m:-mt-14 -mb-[200px]">
                <div className="flex flex-col items-center bg-lowLime bg-opacity-90 w-full max-w-[1300px] h-full min-h-[1500px] pb-44 m:pb-48">
                    <SearchFilters setOffers={setOffers} setFetched={setFetched} setCurrentPage={setCurrentPage}
                                   currentPage={currentPage} itemsPerPage={itemsPerPage} setTotalPages={setTotalPages}
                                   setTotalElements={setTotalElements}/>
                    {fetched ?
                        <div className="flex flex-col items-center w-full max-w-[1200px]">
                            {offers.length > 0 ?
                                <div className="w-[90%] m:w-[95%] max-w-[700px] relative">
                                    <p className="absolute top-[5px] m:top-[7px] right-0 text-sm m:text-base underline">
                                        Results: {totalElements}
                                    </p>
                                    {offers.map((offer) => (
                                        <SmallOfferDisplay type="search" key={offer.id} offer={offer}/>
                                    ))}
                                    {(hasPrevPage || hasNextPage) && (
                                        <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                                            {hasPrevPage && (
                                                <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md 
                                                ${hovered[0] && "ring ring-white"}`}
                                                        {...bindHoverButtons(0)} onClick={prevPage}>
                                                    {currentPage}
                                                </button>
                                            )}
                                            <button className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white rounded-md cursor-default">
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