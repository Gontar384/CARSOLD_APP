import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const SearchBar: React.FC = () => {

    const [search, setSearch] = useState<string>("");
    const searchRef = useRef<string>("");   //gives access to most recent value, makes it work efficiently

    const [isClicked, setIsClicked] = useState<boolean>(false);  //checks if it's clicked

    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar

    const [magnifierAnimation, setMagnifierAnimation] = useState<"animate-disappear" | "animate-disappearRev" | null>(null)

    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideUp" | "animate-slideDown" | null>(null);

    const [isInitial, setIsInitial] = useState<boolean>(false);

    const { mobileWidth } = useUtil();

    const handleClick = () => {
        setMagnifierAnimation("animate-disappear");
        setTimeout(() => {
            setMagnifierAnimation(null)
            setIsClicked(true);
        }, 100)
        if (search) {
            setButtonAnimation("animate-slideDown");
        }
    }   //handles input click

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (isClicked && componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setMagnifierAnimation("animate-disappearRev");
                setTimeout(() => {
                    setMagnifierAnimation(null)
                }, 100)
                if (searchRef.current) {
                    setButtonAnimation("animate-slideUp");
                }
                setIsClicked(false);
            }
        }

        if (isClicked) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
    }, [isClicked])   //adds event listener to off input backlight

    useEffect(() => {
        searchRef.current = search;
        if (search && isInitial) {
            setIsClicked(true);
            setButtonAnimation("animate-slideDown");
        } else {
            setButtonAnimation("animate-slideUp")
        }
        setIsInitial(true);
    }, [isInitial, search]);   //manages button animation

    useEffect(() => {
        setButtonAnimation(null);
    }, [mobileWidth])    //resets animation

    return (
        <div
            className="flex justify-center relative w-fit mr-2 max-w-[200px] m:max-w-[320px]"
            ref={componentRef}>
            {!isClicked && search === "" &&
                <FontAwesomeIcon icon={faMagnifyingGlass}
                                 className={`absolute top-[5px] left-[6px] m:left-2 text-xl m:text-2xl z-30 ${magnifierAnimation}`}/>}
            <input className={`w-full h-7 m:h-8 text-xl m:text-2xl p-[6px] m:p-2 border border-black relative z-20 
            focus:outline-none focus:border-opacity-0 focus:ring-2 m:focus:ring-2 focus:ring-blue-500/30 focus:shadow-blue-500/50 
            ${isClicked ? 'bg-white rounded-sm' : 'bg-lime rounded-full'}`}
                   onClick={handleClick} value={search} onChange={e => setSearch(e.target.value)}/>
            <button
                className={`h-7 m:h-8 absolute top-0 right-0 px-1 m:px-2 text-lg m:text-xl bg-lime border border-black z-10 
                ${buttonAnimation} ${isClicked ? 'rounded-sm border-t-0' : 'rounded-r-full z-30'}
                ${!search ? "opacity-0 pointer-events-none delay-300" : "opacity-100 pointer-events-auto"}`}>
                Search
            </button>
        </div>
    )
}

export default SearchBar