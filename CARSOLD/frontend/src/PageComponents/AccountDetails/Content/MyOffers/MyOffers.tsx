import React, {useEffect, useState} from "react";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {fetchAllOffers} from "../../../../ApiCalls/Services/OfferService.ts";
import SmallOfferDisplay from "./Atomic/SmallOfferDisplay.tsx";

const MyOffers: React.FC = () => {
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
    const [offerAdded, setOfferAdded] = useState<boolean>(false);
    const [offerUpdated, setOfferUpdated] = useState<boolean>(false);
    const [offers, setOffers] = useState<UpdatedOffer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (sessionStorage.getItem("offerAdded") === "true") {
            setOfferAdded(true);
            sessionStorage.removeItem("offerAdded");
        }
        if (sessionStorage.getItem("offerUpdated") === "true") {
            setOfferUpdated(true);
            sessionStorage.removeItem("offerUpdated");
        }
    }, []); //detects if new offer was added and displays banner

    useEffect(() => {
        const handleFetchAllOffers = async () => {
            setLoading(true);
            try {
                const response = await fetchAllOffers();
                if (response.data) {
                    const formattedOffers: UpdatedOffer[] = response.data.map((offer: FetchedOffer) => ({
                        id: offer.id,
                        title: offer.title,
                        photoUrl: offer.photoUrl,
                        price: String(offer.price),
                        currency: offer.currency,
                        power: String(offer.power),
                        capacity: String(offer.capacity),
                        transmission: offer.transmission,
                        fuel: offer.fuel,
                        mileage: String(offer.mileage),
                        year: String(offer.year),
                    }));
                    setOffers(formattedOffers);
                }
            } catch (error) {
                console.error("Custom error: ", error);
            } finally {
                setLoading(false);
            }
        }
        handleFetchAllOffers();
    }, []);

    if (loading) return null;

    return (
        <>
            <div className="w-[90%] m:w-[95%] h-full max-w-[600px] py-6 m:py-8">
                {offers.length > 0 && (
                    offers.map((offer) => (
                        <SmallOfferDisplay key={offer.id} offer={offer}/>
                    ))
                )}
            </div>
            {offerAdded &&
                <AnimatedBanner text={"Offer added successfully!"} onAnimationEnd={() => setOfferAdded(false)}
                                delay={3000} color={"bg-gray-200"} z={"z-10"}/>}
            {offerUpdated &&
                <AnimatedBanner text={"Offer updated successfully!"} onAnimationEnd={() => setOfferUpdated(false)}
                                delay={3000} color={"bg-gray-200"} z={"z-10"}/>}
        </>
    )
}

export default MyOffers