import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass, faTableList} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";
import {Link, useNavigate} from "react-router-dom";
import {useItems} from "../../../GlobalProviders/Items/useItems.ts";
import {useButton} from "../../../CustomHooks/useButton.ts";

const SearchBar: React.FC = () => {
    const {phrase, setPhrase, setTrigger, clicked, setClicked, searched, setSearched} = useItems();
    const searchRef = useRef<string>("");
    const componentRef = useRef<HTMLDivElement | null>(null);
    const [magnifierAnimation, setMagnifierAnimation] = useState<"animate-disappear" | "animate-disappearRev" | null>(null);
    const {isMobile} = useUtil();
    const navigate = useNavigate();
    const {buttonColor, handleStart, handleEnd} = useButton();

    const handleClick = () => {
        setMagnifierAnimation("animate-disappear");
        setTimeout(() => {
            setClicked(true);
            setMagnifierAnimation(null);
        }, 100);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (clicked && searchRef.current === "" && componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setMagnifierAnimation("animate-disappearRev");
                setClicked(false);
            }
        }
        if (clicked) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
    }, [clicked])   //adds event listener to off input backlight

    const handleSearch = () => {
        navigate(`/search?page=0&size=10&phrase=${phrase}`);
        setSearched(true);
        setTrigger(prev => !prev);
    };

    useEffect(() => {
        searchRef.current = phrase;
        if (phrase === "" && searched) {
            setSearched(false);
            setTrigger(prev => !prev);
        }
        if (phrase !== "") setClicked(true);
    }, [phrase]);

    return (
        <div className="flex flex-row items-center justify-center gap-1 m:gap-1.5 mr-2">
            <div className="w-full m:max-w-[330px] relative" ref={componentRef}>
                {!clicked && phrase === "" &&
                    <FontAwesomeIcon className={`absolute top-[5px] left-[6px] m:left-2 text-xl m:text-2xl z-30 ${magnifierAnimation}`}
                        icon={faMagnifyingGlass}/>}
                <input className={`w-full h-7 m:h-8 text-xl m:text-2xl p-[6px] m:p-2 border border-black relative z-10 outline-none
                ${clicked ? "bg-white rounded-sm border-opacity-0 ring-1 ring-blue-500/30 shadow-blue-500/50" : "bg-lime rounded-full"}`}
                       onClick={handleClick} value={phrase} onChange={e => setPhrase(e.target.value)}
                       onKeyDown={(e) => {
                           if (e.key === "Enter") handleSearch()
                       }}/>
                {!isMobile && clicked &&
                    <button className={`h-7 m:h-8 absolute top-0 right-0 px-1 m:px-2 text-lg m:text-xl rounded-sm bg-lime z-20 ${buttonColor && "brightness-[97%]"}`}
                            onClick={handleSearch}
                            onTouchStart={isMobile ? handleStart : undefined}
                            onTouchEnd={isMobile ? handleEnd : undefined}
                            onMouseEnter={!isMobile ? handleStart : undefined}
                            onMouseLeave={!isMobile ? handleEnd : undefined}>
                        Search
                    </button>}
            </div>
            <Link className="flex" to={"/search?page=0&size=10"}>
                <FontAwesomeIcon icon={faTableList} className="text-xl m:text-2xl p-0.5"/>
            </Link>
        </div>
    )
}

export default SearchBar