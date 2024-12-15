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
        <div className="flex flex-col w-11/12 xs:w-10/12 max-w-[360px] xs:max-w-[420px] sm:max-w-[700px] 2xl:max-w-[850px]
        3xl:max-w-[950px] 3xl:h-[650px] text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl p-3 rounded-sm bg-lowLime
        bg-[url('/AsideBackground.jpg')] bg-center bg-cover">
            <p className="text-center text-xl xs:text-2xl 2xl:text-3xl 3xl:text-4xl pb-3 font-bold">Why to use?</p>
            {features.map((feature, index) => (
                <p key={index}>
                    <FontAwesomeIcon icon={faCheck}/> {feature}
                </p>
            ))}
            <p className="mb-72"></p>
        </div>
    )
}

export default Aside