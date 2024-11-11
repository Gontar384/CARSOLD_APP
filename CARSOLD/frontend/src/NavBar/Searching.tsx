import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {ReactElement, useEffect, useRef, useState} from "react";

function Searching(): ReactElement {

    const [isClicked, setIsClicked] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);

    //handles input click
    const handleClick = () => {
        setIsClicked(true);
    }

    //offs input backlight
    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            setIsClicked(false);
        }
    }

    //live checks if user click outside input and then uses handleClickOutside function
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    return (
        <div ref={componentRef} className="flex gap-1">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-2xl sm1:text-3xl sm:text-4xl"/>
            <input onClick={handleClick}
                   className={`w-11/12 sm3:max-w-52 sm1:max-w-full h-7 sm1:h-8 sm:h-10 p-1 text-xl 
                   sm1:text-2xl sm:text-3xl text-black border border-solid border-black transition-all 
                   duration-400 ease-in-out 
                   ${isClicked ? 'bg-white rounded-1xl' : 'bg-lime rounded-full'}`}/>
        </div>
    )
}

export default Searching;