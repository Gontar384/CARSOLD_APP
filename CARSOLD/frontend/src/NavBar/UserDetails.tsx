import {ReactElement} from "react";

function UserDetails(): ReactElement {

    const test: boolean = true;

    if (test) {
        return (
            <div className="lg:pl-4 lg:pr-2 text-md sm1:text-xl sm:text-2xl truncate cursor-pointer">
                <p>Log in | Register</p>
            </div>
        )
    } else
        return (
            <div className="truncate cursor-pointer">
                <p className="text-xl sm1:text-2xl lg:text-3xl">Gontar</p>
                <p className="text-sm sm1:text-md lg:text-xl">Followed 2⭐</p>
            </div>
        )
}

export default UserDetails;