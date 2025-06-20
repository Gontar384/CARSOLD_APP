import React, {useEffect, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import SearchFilters from "./SearchFilters/SearchFilters.tsx";
import {UpdatedOffer} from "../AccountDetails/Content/MyOffers/MyOffers.tsx";
import SmallOfferDisplay from "../AccountDetails/Content/MyOffers/Atomic/SmallOfferDisplay.tsx";
import SearchOfferLoader from "../../Additional/Loading/SearchOfferLoader.tsx";
import {usePagination} from "../../CustomHooks/usePagination.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const Search: React.FC = () => {
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const itemsPerPage = 10;
    const [totalElements, setTotalElements] = useState<number>(0);
    const {currentPage, setCurrentPage, setTotalPages, hasPrevPage, hasNextPage, prevPage, nextPage, hovered, bindHoverButtons} = usePagination();
    const {t} = useLanguage();

    useEffect(() => {
        document.title = `CARSOLD | ${t("tabTitle2")}`;
    }, [t]);

    return (
        <LayOut>
            <div className="flex flex-col items-center -mt-12 m:-mt-14">
                <div className="flex flex-col items-center bg-lowLime bg-opacity-90 w-full max-w-[1300px]
                h-full min-h-[1500px] pb-32 m:pb-40 border-gray-300 border-b xl:border-x xl:rounded-b">
                    <h1 className="hidden">Search</h1>
                    <SearchFilters setOffers={setOffers} setFetched={setFetched} setCurrentPage={setCurrentPage}
                                   currentPage={currentPage} itemsPerPage={itemsPerPage} setTotalPages={setTotalPages}
                                   setTotalElements={setTotalElements}/>
                    {fetched ?
                        <div className="flex flex-col items-center w-full max-w-[1200px]">
                            <h2 className="hidden">Offers</h2>
                            {offers.length > 0 ?
                                <div className="w-[90%] m:w-[95%] max-w-[700px] relative">
                                    <p className="absolute top-[5px] m:top-[7px] right-0 text-sm m:text-base underline">
                                        {t("search1")}{totalElements}
                                    </p>
                                    <ul className="list-none">
                                        {offers.map((offer) => (
                                            <li key={offer.id}>
                                                <SmallOfferDisplay type="search" offer={offer}/>
                                            </li>
                                        ))}
                                    </ul>
                                    {(hasPrevPage || hasNextPage) && (
                                        <div
                                            className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                                            {hasPrevPage && (
                                                <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md 
                                                ${hovered[0] && "ring ring-white"}`} {...bindHoverButtons(0)}
                                                        onClick={prevPage}>
                                                    {currentPage}
                                                </button>
                                            )}
                                            <button
                                                className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white rounded-md cursor-default">
                                                {currentPage + 1}
                                            </button>
                                            {hasNextPage && (
                                                <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md 
                                                ${hovered[1] && "ring ring-white"}`} {...bindHoverButtons(1)}
                                                        onClick={nextPage}>
                                                    {currentPage + 2}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                                : <p className="text-xl m:text-2xl mt-36 m:mt-40">{t("search2")}</p>
                            }
                        </div> :
                        <>
                        {Array.from({length: 10}).map((_, index) => (
                                <SearchOfferLoader key={index}/>
                            ))}
                        </>}
                </div>
            </div>
        </LayOut>
    )
}

export default Search