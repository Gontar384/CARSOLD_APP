import React, {useEffect, useState} from "react";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";

const MyOffers: React.FC = () => {
    const [offerAdded, setOfferAdded] = useState<boolean>(false);
    const [offerUpdated, setOfferUpdated] = useState<boolean>(false);

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

    return (
        <div>
            <p>MyOffers</p>
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