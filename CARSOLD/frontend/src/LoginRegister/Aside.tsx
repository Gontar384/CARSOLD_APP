import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactElement} from "react";

function Aside(): ReactElement {
    return (
        <div className="flex flex-col justify-center w-11/12 sm:w-2/3
        lg:w-5/12 text-md sm1:text-xl p-3 mb-8 mt-8 sm:mt-4 md:mt-0 rounded-xl
        bg-lowLime bg-[url('src/assets/carBackground.jpg')] bg-center bg-cover">
            <p className="text-center text-2xl pb-3 font-bold">Why to use?</p>
            <p><FontAwesomeIcon icon={faCheck}/>CAR$OLD is a site created with passion,
                dedication and a dream.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Our services are free to use.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Putting your car for sell is easy and fast.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Write and meet new people.</p>
            <p><FontAwesomeIcon icon={faCheck}/>Test some new features, like adding comments to auctions.</p>
            <p className="mb-72"><FontAwesomeIcon icon={faCheck}/>Register and check how simple it is!</p>
        </div>
    )
}

export default Aside;