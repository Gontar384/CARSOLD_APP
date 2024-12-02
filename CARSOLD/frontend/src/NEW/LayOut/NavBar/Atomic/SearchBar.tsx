import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../../GlobalProviders/UtilProvider.tsx";

const SearchBar: React.FC = () => {

    const [search, setSearch] = useState<string>("");   //checks input

    const [isClicked, setIsClicked] = useState<boolean>(false);  //checks if it's clicked

    const [magnifierAnimation, setMagnifierAnimation] = useState<"animate-disappear" | "animate-disappearRev" | null>(null)

    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideUp" | "animate-slideDown" | null>(null);

    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar

    const searchRef = useRef<string>(""); //makes search state accessible

    useEffect(() => {
        searchRef.current = search;
        if (search) {
            setIsClicked(true);
            setButtonAnimation("animate-slideDown");
        } else {
            setButtonAnimation("animate-slideUp")
        }
    }, [search]);   //sets isClicked and animation

    useEffect(() => {
        if (!isClicked) return;
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isClicked])   //adds event listener

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

    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            if (isClicked) {
                setMagnifierAnimation("animate-disappearRev");
                setTimeout(() => {
                    setMagnifierAnimation(null)
                }, 100)
                if (searchRef.current) {    //uses ref to access the latest `search` value
                    setButtonAnimation("animate-slideUp");
                }
                setIsClicked(false);
            }
        }
    }   //offs input backlight

    const { isWide } = useUtil();

    useEffect(() => {
        setButtonAnimation(null);
    }, [isWide]);   //resets animation when resizing

    return (
        <div
            className="flex justify-center relative w-1/2 sm:w-fit max-w-[210px] xs:max-w-[250px] sm:max-w-full pr-1 sm:pr-0"
            ref={componentRef}>
            {!isClicked && search === "" &&
                <FontAwesomeIcon icon={faMagnifyingGlass}
                                 className={`absolute top-1 xs:top-[5px] lg:top-[5px] xl:top-[4px] 2xl:top-[6px] 3xl:top-[7px] left-2 lg:left-[9px] xl:left-xs 2xl:left-sm 
                                 3xl:left-lg text-[13px] xs:text-[16px] lg:text-[20px] xl:text-[25px] 2xl:text-[31px] 3xl:text-[34px] z-30 ${magnifierAnimation}`}/>
            }
            <input className={`w-full sm:w-64 lg:w-72 xl:w-80 2xl:w-96 3xl:w-[450px] h-5 xs:h-6 lg:h-7 xl:h-8
            2xl:h-10 3xl:h-11 p-[2px] sm:p-1 lg:p-[6px] text-xs xs:text-base lg:text-[19px] xl:text-2xl 2xl:text-[25px] 3xl:text-[32px] border
            border-black relative z-20 ${isClicked ? 'bg-white rounded-sm' : 'bg-lime rounded-full'}`}
                   onClick={handleClick} value={search}
                   onChange={e => setSearch(e.target.value)}/>
            <button
                className={`absolute top-0 right-1 sm:right-0 px-1 xs:px-[6px] lg:px-2 xl:px-[9px] 2xl:px-3 3xl:px-4 bg-lime border border-black h-5 xs:h-6 lg:h-7 xl:h-8 
                2xl:h-10 3xl:h-11 text-xs xs:text-base lg:text-[19px] xl:text-2xl z-10 2xl:text-[25px] 3xl:text-[32px]
                ${buttonAnimation} ${isClicked ? 'rounded-sm' : 'rounded-r-full z-30'}
                ${!search ? "opacity-0 pointer-events-none delay-300" : "opacity-100 pointer-events-auto"}`}>
                Search
            </button>
        </div>
    )
}

export default SearchBar