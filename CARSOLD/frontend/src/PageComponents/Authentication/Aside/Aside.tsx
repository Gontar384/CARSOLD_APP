import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";

const Aside: React.FC = () => {

    const features = [
        "CAR$OLD is a site created with passion, dedication and a dream.",
        "Our services are free to use.",
        "Putting your car for sell is easy and fast.",
        "Write and meet new people.",
        "Test some new features, like adding comments to auctions.",
        "Unlock Dark Mode - available only for authenticated users!",
        "Register and check how simple it is!",
    ];

    return (
        <div className="flex flex-col w-11/12 h-full max-w-[900px] text-xl m:text-2xl p-3 rounded-sm bg-lowLime
        bg-[url('/AsideBackground.jpg')] bg-center bg-cover">
            <p className="text-center text-2xl m:text-3xl pb-3 font-bold">Why to use?</p>
            {features.map((feature, index) => (
                <p key={index}>
                    <FontAwesomeIcon icon={faCheck}/> {feature}
                </p>
            ))}
            <p className="mb-80"></p>
        </div>
    )
}

export default Aside