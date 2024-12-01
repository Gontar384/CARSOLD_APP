import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface SearchBarProps {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    isClicked: boolean;
    handleClick: () => void;
    magnifierAnimation: "animate-disappear" | "animate-disappearRev" | null;
    buttonAnimation: "animate-slideUp" | "animate-slideDown" | null;
    componentRef: React.RefObject<HTMLDivElement>;
}

const SearchBar: React.FC<SearchBarProps> = ({ search, setSearch, isClicked, handleClick, magnifierAnimation, buttonAnimation, componentRef }) => {
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