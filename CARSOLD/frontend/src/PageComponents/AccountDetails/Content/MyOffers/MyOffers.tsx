import React, {useEffect, useState} from "react";
import AnimatedBanner from "../../../../SharedComponents/Additional/Banners/AnimatedBanner.tsx";

const MyOffers: React.FC = () => {
    const [offerAdded, setOfferAdded] = useState<boolean>(false);

    useEffect(() => {
        if (sessionStorage.getItem("offerAdded") === "true") {
            setOfferAdded(true);
            sessionStorage.removeItem("offerAdded");
        }
    }, []); //detects if new offer was added and displays banner

    return (
        <div>
            <p>MyOffers</p>
            {offerAdded &&
                <AnimatedBanner text={"Offer added successfully!"} onAnimationEnd={() => setOfferAdded(false)}
                                delay={3000} color={"bg-lowLime"} z={"z-10"}/>}
        </div>
    )
}

export default MyOffers