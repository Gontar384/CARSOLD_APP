import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {ReactElement} from "react";

function AddButton(): ReactElement {
    return (
        <div className="flex flex-row p-1 gap-2 border-2 border-solid border-black
         cursor-pointer hover:bg-white hover:rounded-md">
            <FontAwesomeIcon icon={faPlus} className="text-2xl lg:text-3xl"/>
            <p className="text-md sm:text-2xl sm1:text-xl truncate">Add Offer</p>
        </div>
    )
}

export default AddButton;