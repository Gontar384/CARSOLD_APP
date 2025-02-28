import React, {useEffect, useState} from "react";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";
import {fetchAllOffers} from "../../../../ApiCalls/Services/OfferService.ts";

const MyOffers: React.FC = () => {
    interface OfferPreview {
        id: number | null;
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
    const [offers, setOffers] = useState<OfferPreview[]>([]);

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
            try {
                const response = await fetchAllOffers();
                if (response.data) {
                    setOffers(response.data);
                }
            } catch (error) {
                console.error("Custom error: ", error);
            }
        }

        handleFetchAllOffers();
    }, []);

    return (
        <div>
            <p>MyOffers</p>
            <div>
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <div key={offer.id}>
                            <h2>{offer.title}</h2>
                            <p>Price: {offer.price} {offer.currency}</p>
                            <img src={offer.photoUrl} alt={offer.title}/>
                        </div>
                    ))
                ) : (
                    <p>No offers available</p>
                )}
            </div>
            {offerAdded &&
                <AnimatedBanner text={"Offer added successfully!"} onAnimationEnd={() => setOfferAdded(false)}
                                delay={3000} color={"bg-gray-200"} z={"z-10"}/>}
            {offerUpdated &&
                <AnimatedBanner text={"Offer updated successfully!"} onAnimationEnd={() => setOfferUpdated(false)}
                                delay={3000} color={"bg-gray-200"} z={"z-10"}/>}
        </div>
    )
}

export default MyOffers