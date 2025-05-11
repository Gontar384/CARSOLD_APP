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
    const [hovered, setHovered] = useState<boolean[]>(Array(3).fill(false));
    const {bigWidth, isMobile} = useUtil();

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

    const handleHover = (index: number, val: boolean) => {
        setHovered(prev => {
            const copy = [...prev];
            copy[index] = val;
            return copy;
        });
    };

    const bindHoverHandlers = (index: number) => {
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

    return (
        <LayOut>
            <div className={`flex ${bigWidth ? "flex-row" : "flex-col items-center"} w-full h-full -mb-[200px] m:-mb-[100px] overflow-hidden relative`}>
                <div className={`flex flex-col bg-gradient-to-t from-lime to-darkLime animate-appearFastRev border-gray-300
                ${bigWidth ? "w-[50%] min-h-[720px] justify-center border-y-2 z-10" : "rounded w-[90%] items-center min-h-[500px] px-5 border"}`}>
                    <p className={`${bigWidth ? "ml-20 animate-appearLongRev" : "mt-24"} text-2xl m:text-3xl`}>
                        Welcome to CAR$OLD!</p>
                    <div className={`flex flex-row items-center gap-2 ${bigWidth && "ml-20 animate-appearLongRev"} mt-6`}>
                        <p className="text-[20px] m:text-[26px]">A world of cars</p>
                        <FontAwesomeIcon icon={faEarthAmericas} className="text-2xl m:text-3xl"/>
                    </div>
                    <div className={`flex flex-row items-center gap-2 ${bigWidth && "ml-20 animate-appearLongRev"} mt-10`}
                         {...bindHoverHandlers(0)}>
                        <Link to={"/authenticate/login"} className={`text-xl m:text-2xl ${hovered[0] ? "underline" : "no-underline"}`}>
                            Join us here
                        </Link>
                        <FontAwesomeIcon icon={faDoorOpen} className={`text-2xl m:text-3xl ${hovered[0] && "scale-110"}`}/>
                    </div>
                    <div className={`flex flex-row items-center gap-2 ${bigWidth && "ml-20 animate-appearLongRev"} mt-10`}
                         {...bindHoverHandlers(1)}>
                        <Link to={"/search?page=0&size=10 "} className={`text-xl m:text-2xl ${hovered[1] ? "underline" : "no-underline"}`}>
                            Find your dream car
                        </Link>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={`text-2xl m:text-3xl ${hovered[1] && "scale-110"}`}/>
                    </div>
                    <div className={`flex flex-row items-center gap-2 ${bigWidth && "ml-20 animate-appearLongRev"} mt-10`}
                         {...bindHoverHandlers(2)}>
                        <Link to={"/addingOffer"} className={`text-xl m:text-2xl underline ${hovered[2] ? "underline" : "no-underline"}`}>
                            Sell your car
                        </Link>
                        <FontAwesomeIcon icon={faMoneyBillWave} className={`text-2xl m:text-3xl ${hovered[2] && "scale-110"}`}/>
                    </div>
                </div>
                <div className={`flex flex-col items-center justify-center h-fit bg-gradient-to-t from-lime to-darkLime animate-appearFast border-gray-300
                ${bigWidth ? "w-[60%] absolute right-0 min-h-[720px] border-y-2 z-20" : "rounded w-[90%] min-h-[600px] m:min-h-[860px] mt-5 border"}`}>
                    <div className={`flex flex-col justify-center ${bigWidth ? "w-full gap-4" : "w-[95%] gap-4 m:gap-6"}`}>
                        <div className={`flex ${bigWidth ? "justify-end mr-5 animate-appearLong" : "justify-center"} -mt-8 m:-mt-10`}>
                            <div className={` ${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[0] ? <SmallOfferDisplay type="search" offer={offers[0]} /> : null) : (<HomeOfferLoading />)}
                            </div>
                        </div>
                        <div className={`flex justify-center ${bigWidth && "mr-5 animate-appearLong"}`}>
                            <div className={` ${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[1] ? <SmallOfferDisplay type="search" offer={offers[1]} /> : null) : (<HomeOfferLoading />)}
                            </div>
                        </div>
                        <div className={`flex ${bigWidth ? "justify-end mr-5 animate-appearLong" : "justify-center"}`}>
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