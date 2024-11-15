import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faHouse, faMagnifyingGlass, faMessage, faPlus, faSquarePlus, faUser} from "@fortawesome/free-solid-svg-icons";

const NavBar: React.FC = () => {

    //state defining window size
    const [isWide, setIsWide] = useState<boolean>(window.innerWidth >= 640);

    //checks window size, which defines, how navbar will look like
    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth >= 640);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [])

    //state which defines if there is some input in search bar
    const [search, setSearch] = useState<string>("");

    //state which defines if search bar is clicked
    const [isClicked, setIsClicked] = useState<boolean>(false);

    //ref which checks if user clicked outside the search bar
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
        <>
            {isWide ? (
                <>{/*big screen*/}
                    <div className="flex flex-row items-center justify-evenly fixed
                     w-full h-8 md:h-9 lg:h-10 xl:h-12 2xl:h-[52px] 3xl:h-14 border-b-2 border-black bg-lime z-50">
                        {/*logo*/}
                        <div className="flex flex-row justify-center text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-[44px] 3xl:text-[50px]">
                            <p className="text-white">CAR</p>
                            <p className="text-black">$</p>
                            <p className="text-white">OLD</p>
                        </div>
                        {/*search bar*/}
                        <div className="flex justify-center">
                            <div className="relative" ref={componentRef}>
                                {!isClicked && search === "" ?
                                    <FontAwesomeIcon icon={faMagnifyingGlass}
                                                     className="absolute top-[6px] md:top-[5px] lg:top-[5px] xl:top-[5px] 2xl:top-[6px] 3xl:top-[7px]
                                                     left-[7px] md:left-[8px] lg:left-[9px] xl:left-xs 2xl:left-sm 3xl:left-lg text-[13px]
                                                     md:text-[16px] lg:text-[20px] xl:text-[25px] 2xl:text-[31px] 3xl:text-[34px]"/>
                                    : null}
                                <input onClick={handleClick} className={`xs:w-52 md:w-56 lg:w-72 xl:w-80 2xl:w-96 3xl:w-[450px] h-5 md:h-6 lg:h-7 xl:h-8
                                 2xl:h-10 3xl:h-11 p-2 text-base md:text-[18px] lg:text-[19px] xl:text-2xl 2xl:text-[25px] 3xl:text-[32px] border border-solid 
                                 border-black transition-all duration-200 ease-in-out 
                                 ${isClicked ? 'bg-white rounded' : 'bg-lime rounded-full'}`}
                                       onChange={e => setSearch(e.target.value)}/>
                            </div>
                        </div>
                        {/*add button*/}
                        <div className="flex flex-row items-center p-[1px] gap-1 border-2 border-solid border-black
                         cursor-pointer hover:bg-white hover:rounded-md">
                            <FontAwesomeIcon icon={faPlus} className="text-xs md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"/>
                            <p className="text-xs md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl truncate">Add Offer</p>
                        </div>
                        {/*login button / user details*/}
                        <div className="text-xs md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl pb-1 3xl:pb-2 truncate cursor-pointer">
                            <p>Log in | Register</p>
                        </div>
                    </div>
                </>
            ) : (
                <> {/*mobile only*/}
                    {/*upper bar*/}
                    <div className="flex flex-row items-center h-6 xs:h-7 fixed left-0 top-0 right-0 border-b bg-lime z-50">
                        {/*logo*/}
                        <div className="flex flex-row justify-center w-1/3 text-xl xs:text-2xl">
                            <p className="text-white">CAR</p>
                            <p className="text-black">$</p>
                            <p className="text-white">OLD</p>
                        </div>
                        {/*search bar*/}
                        <div className="flex justify-center w-2/3">
                            <div className="relative w-9/12" ref={componentRef}>
                                {!isClicked && search === "" ?
                                    <FontAwesomeIcon icon={faMagnifyingGlass}
                                                     className="absolute top-[6px] xs:top-[5px] left-2 text-[13px] xs:text-[16px]"/>
                                    : null}
                                <input onClick={handleClick} className={`w-full h-5 xs:h-6 p-1 text-base xs:text-xl border border-solid
                                 border-black transition-all duration-200 ease-in-out 
                                 ${isClicked ? 'bg-white rounded-1xl' : 'bg-lime rounded-full'}`}
                                       onChange={e => setSearch(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    {/*down bar*/}
                    <div
                        className="flex flex-row items-center pt-1 justify-evenly h-10 xs:h-11 fixed left-0 bottom-0 right-0 border-t bg-lime z-50">
                        <a className="flex flex-col">
                            <FontAwesomeIcon icon={faHouse} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Home</p>
                        </a>
                        <a className="flex flex-col">
                            <FontAwesomeIcon icon={faHeart} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Followed</p>
                        </a>
                        <a className="flex flex-col">
                            <FontAwesomeIcon icon={faSquarePlus} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Add</p>
                        </a>
                        <a className="flex flex-col">
                            <FontAwesomeIcon icon={faMessage} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Messages</p>
                        </a>
                        <a className="flex flex-col">
                            <FontAwesomeIcon icon={faUser} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">User</p>
                        </a>
                    </div>
                </>
            )}
        </>
    )
}

export default NavBar