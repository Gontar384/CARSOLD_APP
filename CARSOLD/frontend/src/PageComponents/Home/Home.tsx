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
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";

const Home: React.FC = () => {
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const [fetched, setFetched] = useState<boolean>(false);
    const [hovered, setHovered] = useState<boolean[]>(Array(3).fill(false));
    const [initial, setInitial] = useState<boolean>(true);
    const {bigWidth, isMobile} = useUtil();
    const {t} = useLanguage();

    useEffect(() => {
        document.title = `CARSOLD | ${t("tabTitle1")}`
    }, [t]);

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
    }, []); //fetches random offers

    useEffect(() => {
        const animationDone = setTimeout(() => setInitial(false), 1000);

        return () => clearTimeout(animationDone);
    }, []); //offs animations

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
            <div className={`flex ${bigWidth ? "flex-row" : "flex-col items-center"} w-full h-full overflow-hidden relative`}>
                <div className={`flex flex-col bg-gradient-to-t from-lime to-darkLime border-y border-gray-300 animate-appearFastRev
                ${bigWidth ? "w-[50%] min-h-[680px] justify-center z-10" : "w-full items-center min-h-[500px] text-center"}`}>
                    <h1 className={`text-2xl m:text-3xl ${bigWidth ? `ml-20 ${initial && "animate-appearSlowRev"}` : "mt-24"}`}>
                        {t("home1")}
                    </h1>
                    <h2 className={`flex flex-row items-center gap-2 text-[20px] m:text-[26px] mt-6 ${bigWidth && `ml-20 ${initial && "animate-appearSlowRev"}`}`}>
                        {t("home2")}
                        <FontAwesomeIcon icon={faEarthAmericas} className="text-2xl m:text-3xl"/>
                    </h2>
                    <h3 className={`mt-10 ${bigWidth && `ml-20 ${initial && "animate-appearSlowRev"}`}`}>
                        <Link className={`flex flex-row items-center w-fit gap-2 text-xl m:text-2xl relative`} to={"/authenticate/login"} {...bindHoverHandlers(0)}>
                            <p className="animate-pulseText">{t("home3")}</p>
                            <FontAwesomeIcon icon={faDoorOpen} className={`text-2xl m:text-3xl ${hovered[0] && "scale-110"}`}/>
                            <div className={`w-[77%] h-[1px] m:h-[2px] absolute bottom-0 bg-black ${hovered[0] ? "animate-underlineRev" : "animate-underline"}`}/>
                        </Link>
                    </h3>
                    <h3 className={`mt-10 ${bigWidth && `ml-20 ${initial && "animate-appearSlowRev"}`}`}>
                        <Link className={`flex flex-row items-center w-fit gap-2 text-xl m:text-2xl relative`} to={"/search?page=0&size=10"} {...bindHoverHandlers(1)}>
                            <p className="animate-pulseText">{t("home4")}</p>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className={`text-2xl m:text-3xl ${hovered[1] && "scale-110"}`}/>
                            <div className={`w-[86%] h-[1px] m:h-[2px] absolute bottom-0 bg-black ${hovered[1] ? "animate-underlineRev" : "animate-underline"}`}/>
                        </Link>
                    </h3>
                    <h3 className={`mt-10 ${bigWidth && `ml-20 ${initial && "animate-appearSlowRev"}`}`}>
                        <Link className={`flex flex-row items-center w-fit gap-2.5 text-xl m:text-2xl relative`} to={"/addingOffer"} {...bindHoverHandlers(2)}>
                            <p className="animate-pulseText">{t("home5")}</p>
                            <FontAwesomeIcon icon={faMoneyBillWave} className={`text-2xl m:text-3xl ${hovered[2] && "scale-110"}`}/>
                            <div className={`w-[76%] h-[1px] m:h-[2px] absolute bottom-0 bg-black ${hovered[2] ? "animate-underlineRev" : "animate-underline"}`}/>
                        </Link>
                    </h3>
                </div>
                <div className={`flex flex-col items-center justify-center h-fit bg-gradient-to-t from-lime to-darkLime border-y border-gray-300 animate-appearFast
                ${bigWidth ? "w-[60%] absolute right-0 min-h-[680px] z-20" : "w-full min-h-[600px] m:min-h-[860px] mt-5"}`}>
                    <div className={`flex flex-col justify-center ${bigWidth ? "w-full" : "w-[95%] gap-4 m:gap-6"}`}>
                        <div className={`flex ${bigWidth ? `justify-end mr-5 ${initial && "animate-appearSlow"}` : "justify-center"} -mt-8 m:-mt-10`}>
                            <div className={`${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[0] ? <SmallOfferDisplay type="search" offer={offers[0]}/> : null) : (
                                    <HomeOfferLoading/>)}
                            </div>
                        </div>
                        <div className={`flex justify-center ${bigWidth && `mr-5 ${initial && "animate-appearSlow"}`}`}>
                            <div className={`${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[1] ? <SmallOfferDisplay type="search" offer={offers[1]}/> : null) : (
                                    <HomeOfferLoading/>)}
                            </div>
                        </div>
                        <div className={`flex ${bigWidth ? `justify-end mr-5 ${initial && "animate-appearSlow"}` : "justify-center"}`}>
                            <div className={`${bigWidth ? "max-w-[580px]" : "max-w-[670px]"} w-full`}>
                                {fetched ? (offers[2] ? <SmallOfferDisplay type="search" offer={offers[2]}/> : null) : (
                                    <HomeOfferLoading/>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayOut>
    )
};

export default Home