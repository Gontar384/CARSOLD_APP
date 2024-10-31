import {ReactElement} from "react";

function Logo(): ReactElement {
    return (
        <div className="flex sm:hidden lg:flex flex-row text-4xl sm1:text-5xl sm:text-6xl">
            <p className="text-white">CAR</p>
            <p className="text-black">$</p>
            <p className="text-white">OLD</p>
        </div>
    )
}

export default Logo;