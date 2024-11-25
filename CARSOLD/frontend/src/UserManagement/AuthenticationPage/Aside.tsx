import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactElement} from "react";

//displays graphic with some text on '/authentication' page
function Aside(): ReactElement {
    return (
        <div className="flex flex-col w-11/12 xs:w-10/12 max-w-[360px] xs:max-w-[420px] sm:max-w-[700px] 2xl:max-w-[850px] 3xl:max-w-[950px] 3xl:h-[650px]
         text-base xs:text-xl 2xl:text-2xl 3xl:text-3xl p-3 rounded-sm
         bg-lowLime bg-[url('src/assets/carBackground.jpg')] bg-center bg-cover">
            <p className="text-center text-xl xs:text-2xl 2xl:text-3xl 3xl:text-4xl pb-3 font-bold">Why to use?</p>
            <p><FontAwesomeIcon icon={faCheck}/>CAR$OLD is a site created with passion,
                dedication and a dream.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Our services are free to use.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Putting your car for sell is easy and fast.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Write and meet new people.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Test some new features, like adding comments to auctions.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Unlock Dark Mode - available only for authenticated users!</p>
            <p className="mb-72"><FontAwesomeIcon icon={faCheck}/>Register and check how simple it is!</p>
        </div>
    )
}

export default Aside;