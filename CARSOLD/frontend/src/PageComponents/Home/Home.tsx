import React, {useEffect, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import {fetchRandomOffers} from "../../ApiCalls/Services/OfferService.ts";
import {FetchedOffer, UpdatedOffer} from "../AccountDetails/Content/MyOffers/MyOffers.tsx";
import SmallOfferDisplay from "../AccountDetails/Content/MyOffers/Atomic/SmallOfferDisplay.tsx";
import HomeOfferLoading from "../../Additional/Loading/HomeOfferLoading.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDoorOpen, faEarthAmericas, faMagnifyingGlass, faMoneyBillWave} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const Home: React.FC = () => {
    document.title = "CARSOLD | Home"
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const {bigWidth} = useUtil();

    useEffect(() => {
        const handleFetchRandomOffers = async () => {
            try {
                const randomOffers = await fetchRandomOffers();
                if (randomOffers.data) {
                    const formattedOffers: UpdatedOffer[] = randomOffers.data.map((offer: FetchedOffer) => ({
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
            } catch (error) {
                console.error("Could not fetch random offers: ", error);
            } finally {
                setFetched(true);
            }
        };
        handleFetchRandomOffers();
    }, []);

    return (
        <LayOut>
            <div className={`flex ${bigWidth ? "flex-row" : "flex-col items-center"} w-full h-full overflow-hidden relative`}>
                <div className={`flex flex-col bg-gradient-to-t from-lime to-darkLime animate-appearFastRev
                ${bigWidth ? "w-[50%] min-h-[720px] justify-center z-10" : "rounded w-[90%] items-center min-h-[500px] px-5"}`}>
                    <p className={`${bigWidth ? "ml-20" : "mt-24"} text-2xl m:text-3xl animate-appearLongRev`}>
                        Welcome to CAR$OLD!</p>
                    <div className={`flex flex-row items-center  gap-2 ${bigWidth && "ml-20"} mt-6 animate-appearLongRev`}>
                        <p className="text-[20px] m:text-[26px]">A world of cars</p>
                        <FontAwesomeIcon icon={faEarthAmericas} className="text-2xl m:text-3xl"/>
                    </div>
                    <div className={`flex flex-row items-center gap-2 ${bigWidth && "ml-20"} mt-10 animate-appearLongRev`}>
                        <Link to={"/authenticate/login"} className="text-xl m:text-2xl underline">Join us here</Link>
                        <FontAwesomeIcon icon={faDoorOpen} className="text-2xl m:text-3xl"/>
                    </div>
                    <div className={`flex flex-row items-center gap-2 ${bigWidth && "ml-20"} mt-10 animate-appearLongRev`}>
                        <Link to={"/search?page=0&size=10 "} className="text-xl m:text-2xl underline">Find your dream car</Link>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl m:text-3xl"/>
                    </div>
                    <div className={`flex flex-row items-center gap-2 ${bigWidth && "ml-20"} mt-10 animate-appearLongRev`}>
                        <Link to={"/addingOffer"} className="text-xl m:text-2xl underline">Sell your car</Link>
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl m:text-3xl"/>
                    </div>
                </div>
                <div className={`flex flex-col items-center justify-center h-fit bg-gradient-to-t from-lime to-darkLime
                ${bigWidth ? "w-[60%] absolute right-0 min-h-[720px] z-20" : "rounded w-[90%] min-h-[600px] m:min-h-[860px] mt-5"} animate-appearFast`}>
                    <div className={`flex flex-col justify-center ${bigWidth ? "w-full gap-4" : "w-[95%] gap-4 m:gap-6"}`}>
                        <div className={`flex ${bigWidth ? "justify-end mr-5" : "justify-center"} -mt-8 m:-mt-10 animate-appearLong`}>
                            <div className={` ${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[0] ? <SmallOfferDisplay type="search" offer={offers[0]} /> : null) : (<HomeOfferLoading />)}
                            </div>
                        </div>
                        <div className={`flex justify-center ${bigWidth && "mr-5"} animate-appearLong`}>
                            <div className={` ${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[1] ? <SmallOfferDisplay type="search" offer={offers[1]} /> : null) : (<HomeOfferLoading />)}
                            </div>
                        </div>
                        <div className={`flex ${bigWidth ? "justify-end mr-5" : "justify-center"} animate-appearLong`}>
                            <div className={` ${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[2] ? <SmallOfferDisplay type="search" offer={offers[2]} /> : null) : (<HomeOfferLoading />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayOut>
    )
};

export default Home