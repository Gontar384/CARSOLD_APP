import React, {Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle as faRegularCircle} from '@fortawesome/free-regular-svg-icons';
import {
    faAddressCard, faBars, faHeart, faMagnifyingGlass, faMessage, faPlus, faRightFromBracket,
    faSquarePlus, faUser, faCircleUser, faCircle, faMoon, faSun
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useDarkMode} from "../Config/DarkMode/DarkModeProvider.tsx";
import {useAuth} from "../Config/AuthConfig/AuthProvider.tsx";
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";
import {useDebouncedValue} from "../UserManagement/AuthenticationPage/Form.tsx";

//specifies props
interface NavBarProps {
    setLowerBar?: Dispatch<SetStateAction<boolean>>; // Optional prop
}

//navigation bar for big screens and mobile screens, passes info about lower bar 'presence' to 'Authentication' component
function NavBar({setLowerBar}: NavBarProps ): ReactElement {

    //state defining window size
    const [isWide, setIsWide] = useState<boolean>(window.innerWidth >= 640);

    //checks window size, which defines, how navbar will look like: mobile or big screen
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

    //magnifier icon animation
    const [magnifierAnimation, setMagnifierAnimation] = useState<"animate-disappear" | "animate-disappearRev" | null>(null)

    //button animation
    const [buttonAnimation, setButtonAnimation] = useState<"animate-slideUp" | "animate-slideDown" | null>(null);

    //ref to make 'search' state accessible all over all time for component
    const searchRef = useRef<string>("");

    //updates ref whenever `search` changes and sets 'isClicked' when search changes
    //its solution for activating input by Tab
    useEffect(() => {
        searchRef.current = search;
        if (search) {
            setIsClicked(true);
        }
    }, [search]);

    //checks if search button is supposed to appear and disappear
    useEffect(() => {
        if (search) {
            setButtonAnimation("animate-slideDown");
        } else {
            setButtonAnimation("animate-slideUp")
        }
    }, [search]);

    //handles input click
    const handleClick = () => {
        setMagnifierAnimation("animate-disappear");
        setTimeout(() => {
            setMagnifierAnimation(null)
            setIsClicked(true);
        }, 100)
        if (search) {
            setButtonAnimation("animate-slideDown");
        }
    }

    //offs input backlight
    const handleClickOutside = (event: MouseEvent) => {
        if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            if (isClicked) {
                setMagnifierAnimation("animate-disappearRev");
                setTimeout(() => {
                    setMagnifierAnimation(null)
                }, 100)
                // Use the ref to access the latest `search` value
                if (searchRef.current) {
                    setButtonAnimation("animate-slideUp");
                }
                setIsClicked(false);
            }
        }
    }

    //checks if user click outside input and then uses handleClickOutside function
    useEffect(() => {
        if (!isClicked) return;
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isClicked])

    //navigate to change paths when clicking buttons
    const navigate = useNavigate();

    //state which make mobile lower bar visible or not
    const [isVisible, setIsVisible] = useState<"hidden" | "flex">("hidden");

    //state which animates mobile lower bar
    const [barAnimation, setBarAnimation] = useState<"animate-slideDown" | "animate-slideUp">("animate-slideDown");

    //state which animates bar icon
    const [iconAnimation, setIconAnimation] = useState<"animate-flip" | "animate-flipRev" | null>(null);

    //state which prevents user from spamming 'bar' button
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    //states which animates dark mode icons
    const [modeIconAnimation, setModeIconAnimation] = useState<"animate-fill" | "animate-empty" | null>(null);
    const [modeIcon1Animation, setModeIcon1Animation] = useState<"animate-fill" | "animate-empty" | null>(null);

    //state which says if user is authenticated or not
    const {isAuthenticated} = useAuth();

    //handles mobile lower bar pop
    const handleLowerBar = () => {
        if (isDisabled) return;
        setIconAnimation((prev) =>
            prev === "animate-flip" ? "animate-flipRev" : "animate-flip");
        setBarAnimation((prev) =>
            prev === "animate-slideDown" ? "animate-slideUp" : "animate-slideDown");
        if (isVisible === "hidden") {
            setIsVisible("flex");
        } else {
            setTimeout(() => {
                setIsVisible("hidden");
            }, 300)
        }
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 300)
        setModeIconAnimation(null);
        setModeIcon1Animation(null);
        if (!isAuthenticated) {   //if user isn't authenticated it sets info about lower bar 'presence' info for animated bars
            setLowerBar?.((prev) => !prev);
        }
    }

    //resets iconAnimation and buttonAnimation states
    useEffect(() => {
        if (isWide) {
            setIconAnimation(null);
            setButtonAnimation(null);
        } else {
            setButtonAnimation(null);
        }
    }, [isWide]);

    //globally shared state and function to toggle dark mode
    const {darkMode, toggleDarkMode} = useDarkMode();

    //handles dark mode change
    const handleDarkMode = () => {
        toggleDarkMode();
        setModeIconAnimation(!darkMode ? "animate-fill" : "animate-empty");
        setModeIcon1Animation(!darkMode ? "animate-empty" : "animate-fill");
    }

    //resets modeIconAnimation state
    useEffect(() => {
        setModeIconAnimation(null);
        setModeIcon1Animation(null);
    }, [isWide]);

    //globally shared state to check authentication
    const {checkAuth} = useAuth();

    //logs out
    const logout = async () => {
        await api.get(`api/auth/logout`)
        setTimeout(async () => {
            await checkAuth();
            navigate('/authenticate');
        }, 1000);
    }

    //state for user details (username fetching)
    const [userDetails, setUserDetails] = useState<string>("");

    //state which monitors if username is fetched
    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);

    //fetches username to user details
    useEffect(() => {
        const handleUsernameFetch = async () => {
            if (!isAuthenticated) return;
            setUsernameFetched(false);
            try {
                const response = await api.get('api/get-username');
                if (response.data.username) {
                    setUserDetails(response.data.username);
                }
            } catch (error) {
                console.log("Error fetching username: ", error);
            } finally {
                setUsernameFetched(true);
            }
        }
        handleUsernameFetch();
    }, [isAuthenticated]);

    //state for user icon animation
    const [userIconAnimation, setUserIconAnimation] = useState<"animate-pop" | null>(null);

    //state to activate bar
    const [barActive, setBarActive] = useState<boolean>(false);

    //state to monitor bar hover
    const [barHovered, setBarHovered] = useState<boolean>(false);

    //debounce value to delay deactivation
    const debouncedHover: boolean = useDebouncedValue(barHovered, 300)

    //state which prevents icon animating too many times
    const [animationActive, setAnimationActive] = useState<boolean>(false);

    //shows big screen bar, triggers animation
    const handleActivateBar = () => {
        if (!animationActive) {
            setUserIconAnimation("animate-pop");
            setAnimationActive(true);
        }
        setBarActive(true);
        setBarHovered(true);
    }

    //shows big screen user bar (basically for keyboard usage to activate bar by clicking enter)
    const handleActivateBarKeyboard = () => {
        setBarActive(prev => !prev);
    }

    //deactivates big screen bar
    const handleDisactivateBar = () => {
        setUserIconAnimation(null);
        setBarHovered(false);
    }

    //sets bar deactivated, delayed by 'debouncedHover'
    useEffect(() => {
        if (!debouncedHover && !barHovered) {
            setBarActive(false);
            setAnimationActive(false);
            setModeIconAnimation(null);
            setModeIcon1Animation(null);
        }
    }, [debouncedHover, barHovered]);

    //toggles bar activation for mobile devices
    const handleToggleBar = () => {
        setBarActive((prev) => !prev);
        if (!barActive && !animationActive) {
            setUserIconAnimation("animate-pop");
            setAnimationActive(true);
        } else {
            setUserIconAnimation(null);
            setAnimationActive(false);
        }
    };

    //prevents closing when interacting with the dropdown buttons
    const handleDropdownInteraction = (
        event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation(); //prevents closing the dropdown buttons when clicking on them
    };

    //states to monitor and display messages and followed count
    const [followedCount, setFollowedCount] = useState<number>(0);
    const [messageCount, setMessageCount] = useState<number>(0);

    //spontaneous only
    useEffect(() => {
        setFollowedCount(0);
        setMessageCount(0);
    }, []);

    return (
        <>
            {isWide ? (
                <>{/*big screen*/}
                    <div className="flex flex-row items-center justify-evenly fixed left-0 top-0 right-0
                     w-full h-9 lg:h-10 xl:h-12 2xl:h-[52px] 3xl:h-14 shadow-bottom bg-lime z-40">
                        {/*logo*/}
                        <button className="flex flex-row justify-center text-2xl lg:text-3xl xl:text-4xl
                         2xl:text-[44px] 3xl:text-[50px]" onClick={() => navigate('/home')}>
                            <p className="text-white">CAR</p>
                            <p className="text-black">$</p>
                            <p className="text-white">OLD</p>
                        </button>
                        {/*search bar*/}
                        <div className="flex justify-center relative" ref={componentRef}>
                            {!isClicked && search === "" ?
                                <FontAwesomeIcon icon={faMagnifyingGlass}
                                                 className={'absolute top-[5px] lg:top-[5px] xl:top-[5px] 2xl:top-[6px] 3xl:top-[7px]' +
                                                     ' left-[8px] lg:left-[9px] xl:left-xs 2xl:left-sm 3xl:left-lg text-[16px] lg:text-[20px] ' +
                                                     ` xl:text-[25px] 2xl:text-[31px] 3xl:text-[34px] z-30 ${magnifierAnimation}`}/>
                                : null}
                            <input onClick={handleClick} value={search} className={`w-64 lg:w-72 xl:w-80 2xl:w-96 3xl:w-[450px] h-6 lg:h-7 xl:h-8
                                 2xl:h-10 3xl:h-11 p-1 lg:p-2 text-base lg:text-[19px] xl:text-2xl 2xl:text-[25px] 3xl:text-[32px] border border-solid 
                                 border-black relative z-20 ${isClicked ? 'bg-white rounded-sm' : 'bg-lime rounded-full'}`}
                                   onChange={e => setSearch(e.target.value)}/>
                            <button
                                className={`absolute top-0 right-0 px-[6px] lg:px-2 xl:px-[9px] 2xl:px-3 3xl:px-4 bg-lime border border-black h-6 lg:h-7 xl:h-8 
                                2xl:h-10 3xl:h-11 text-base lg:text-[19px] xl:text-2xl z-10 2xl:text-[25px] 3xl:text-[32px] 
                                ${buttonAnimation} ${isClicked ? 'rounded-sm' : 'rounded-r-full z-30'}
                                ${!search ? "opacity-0 pointer-events-none delay-300" : "opacity-100 pointer-events-auto"}`}>
                                Search
                            </button>
                        </div>
                        {/*add button*/}
                        <div className="flex flex-row items-center p-[1px] gap-1 border-2 border-solid border-black
                         cursor-pointer hover:bg-white hover:rounded-sm">
                            <FontAwesomeIcon icon={faPlus}
                                             className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"/>
                            <p className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl truncate">
                                Add Offer</p>
                        </div>
                        {/*user details / login button*/}
                        {isAuthenticated ? (
                            usernameFetched ? (
                                <div className="relative h-full"
                                     onMouseEnter={handleActivateBar}
                                     onMouseLeave={handleDisactivateBar}
                                     onTouchStart={handleToggleBar}
                                     onKeyDown={(event) => {
                                         if (event.key === "Enter") handleActivateBarKeyboard()
                                     }}>
                                    <button className="flex flex-row items-center h-full gap-[6px]">
                                        <FontAwesomeIcon icon={faCircleUser}
                                                         className={`mb-[2px] lg:mt-[2px] xl:mt-[2px] 2xl:mt-1 3xl:mt-[1px] text-sm lg:text-[18px] 
                                                     xl:text-[22px] 2xl:text-[28px] 3xl:text-[34px] ${userIconAnimation}`}/>
                                        <div
                                            className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl pb-1 3xl:pb-2 truncate cursor-pointer">
                                            {userDetails}
                                        </div>
                                    </button>
                                    <div
                                        onTouchStart={handleDropdownInteraction}
                                        className={`${barActive ? "flex" : "hidden"} flex-col items-center justify-center w-[93px] lg:w-[109px] xl:w-[124px] 
                                        2xl:w-[148px] 3xl:w-[170px] absolute -left-[14px] bg-lime shadow-bottom`}>
                                        <button className="flex items-center justify-center w-full h-[22px] lg:h-[28px] xl:h-[32px] 2xl:h-[39px] 3xl:h-[47px] text-[13px] lg:text-[17px] xl:text-[20px]
                                         2xl:text-[25px] 3xl:text-[30px] hover:bg-white"
                                                onClick={() => navigate('/myAccount')}>
                                            My account
                                        </button>
                                        <button className="flex items-center justify-center w-full h-[20px] lg:h-[26px] xl:h-[30px] 2xl:h-[37px] 3xl:h-[45px] text-[11px] lg:text-[15px] xl:text-[18px]
                                         2xl:text-[23px] 3xl:text-[28px] hover:bg-white">My ads
                                        </button>
                                        <button className="flex flex-row items-center justify-center gap-1 w-full h-[22px] lg:h-[26px] xl:h-[30px] 2xl:h-[37px] 3xl:h-[45px]
                                         text-[11px] lg:text-[15px] xl:text-[18px] 2xl:text-[23px] 3xl:text-[28px] hover:bg-white">Followed
                                            <div
                                                className={`relative mt-[1px] ${followedCount === 0 ? "hidden" : ""}`}>
                                                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000",}}
                                                                 className="text-[13px] lg:text-[18px] xl:text-[21px] 2xl:text-[25px] 3xl:text-[30px]"/>
                                                <p className="inset-0 m-auto lg:top-[2px] xl:top-[1px] 2xl:top-[3px] 3xl:top-[5px] text-[8px] lg:text-[11px] xl:text-[13px]
                                                 2xl:text-[16px] 3xl:text-[20px] text-white absolute">{followedCount}</p>
                                            </div>
                                        </button>
                                        <button className="flex flex-row items-center justify-center gap-1 w-full h-[20px] lg:h-[26px] xl:h-[30px] 2xl:h-[37px] 3xl:h-[45px]
                                         text-[11px] lg:text-[15px] xl:text-[18px] 2xl:text-[23px] 3xl:text-[28px] hover:bg-white">Messages
                                            <div
                                                className={`relative mt-[1px] ${messageCount === 0 ? "hidden" : ""}`}>
                                                <FontAwesomeIcon icon={faCircle} style={{color: "#ff0000",}}
                                                                 className="text-[13px] lg:text-[18px] xl:text-[21px] 2xl:text-[25px] 3xl:text-[30px]"/>
                                                <p className="inset-0 m-auto lg:top-[2px] xl:top-[1px] 2xl:top-[3px] 3xl:top-[5px] text-[8px] lg:text-[11px] xl:text-[13px]
                                                 2xl:text-[16px] 3xl:text-[20px] text-white absolute">{messageCount}</p>
                                            </div>
                                        </button>
                                        <button className="flex items-center justify-center w-full h-[20px] lg:h-[26x] xl:h-[30px] 2xl:h-[37px] 3xl:h-[45px] text-[11px] lg:text-[15px] xl:text-[18px]
                                         2xl:text-[23px] 3xl:text-[28px] hover:bg-white">Settings
                                        </button>
                                        <button
                                            className={`flex flex-row items-center justify-center w-full h-[20px] lg:h-[26px] xl:h-[30px] 2xl:h-[37px] 3xl:h-[45px] 
                                            text-[11px] lg:text-[15px] xl:text-[18px] 2xl:text-[23px] 3xl:text-[28px] gap-1 lg:gap-[6px] xl:gap-2 2xl:gap-[10px] 3xl:gap-3 hover:bg-white`}
                                            onClick={handleDarkMode}>Mode
                                            <div className="relative">
                                                <FontAwesomeIcon icon={faMoon}
                                                                 className={`text-[12px] lg:text-[16px] xl:text-[19px] 2xl:text-[24px] 3xl:text-[29px] -top-[7px]
                                                             lg:-top-[9px] xl:-top-[10px] 2xl:-top-[13px] 3xl:-top-[15px] ${darkMode ? "" : "opacity-0"} ${modeIconAnimation} absolute`}/>
                                                <FontAwesomeIcon icon={faSun}
                                                                 className={`text-[11px] lg:text-[15px] xl:text-[18px] 2xl:text-[23px] 3xl:text-[28px] -top-[7px]
                                                             lg:-top-[9px] xl:-top-[10px] 2xl:-top-[13px] 3xl:-top-[15px] ${darkMode ? "opacity-0" : ""} ${modeIcon1Animation} absolute`}/>
                                            </div>
                                        </button>
                                        <button className="flex items-center justify-center w-full h-[21px] lg:h-[27px] xl:h-[28px] 2xl:h-[38px] 3xl:h-[46px] hover:bg-white text-[12px] lg:text-[16px]
                                         xl:text-[19px] 2xl:text-[24px] 3xl:text-[29px]"
                                                onClick={logout}>Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-[65px] lg:w-[81px] xl:w-[96px] 2xl:w-[119px] 3xl:w-[142px] h-6 lg:h-7 xl:h-8 2xl:h-9 3xl:h-10
                                     bg-darkLime animate-pulse rounded-sm"></div>
                            )
                        ) : (
                            <button onClick={() => navigate('/authenticate')}
                                    className="text-[15px] lg:text-[18px] xl:text-[22px] 2xl:text-[27px] 3xl:text-[31px] truncate cursor-pointer">
                                <p>Login | Register</p>
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <> {/*mobile*/}
                    {/*upper bar*/}
                    <div
                        className="flex flex-row items-center h-7 xs:h-8 fixed left-0 top-0 right-0 bg-lime shadow-bottom z-40">
                        <button onClick={handleLowerBar} className="w-1/12 text-base xs:text-xl">
                            <FontAwesomeIcon icon={faBars} className={`${iconAnimation}`}/>
                        </button>
                        {/*logo*/}
                        <button className="flex flex-row justify-center w-5/12 text-xl xs:text-2xl"
                                onClick={() => navigate('/home')}>
                            <p className="text-white">CAR</p>
                            <p className="text-black">$</p>
                            <p className="text-white">OLD</p>
                        </button>
                        {/*search bar*/}
                        <div className="relative flex justify-center w-6/12 max-w-[210px] xs:max-w-[250px] pr-1"
                             ref={componentRef}>
                            {!isClicked && search === "" ?
                                <FontAwesomeIcon icon={faMagnifyingGlass}
                                                 className={`absolute top-1 xs:top-[5px] left-2 text-[13px] xs:text-[16px] z-30 ${magnifierAnimation}`}/>
                                : null}
                            <input onClick={handleClick} value={search} className={`w-full h-5 xs:h-6 p-[2px] text-xs xs:text-base border border-solid
                                 border-black z-20 ${isClicked ? 'bg-white rounded-1xl' : 'bg-lime rounded-full'}`}
                                   onChange={e => setSearch(e.target.value)}/>
                            <button
                                className={`absolute top-0 right-0 px-1 xs:px-[6px] bg-lime border border-black h-5 xs:h-6 text-xs xs:text-base z-10 
                                ${buttonAnimation} ${isClicked ? 'rounded-sm' : 'rounded-r-full z-30'}
                                ${!search ? "opacity-0 pointer-events-none delay-300" : "opacity-100 pointer-events-auto"}`}>
                                Search
                            </button>
                        </div>
                    </div>
                    {/*lower bar*/}
                    <div
                        className={`${isVisible} flex-row items-center justify-evenly h-10 xs:h-11 fixed left-0 bottom-0 right-0 bg-lime shadow-top z-40 ${barAnimation}`}>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime">
                            <FontAwesomeIcon icon={faSquarePlus} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Add Offer</p>
                        </button>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime relative">
                            <FontAwesomeIcon icon={faHeart} className="text-xl xs:text-[22px]"/>
                            <p className={`text-[9px] xs:text-[10px] top-[7px] xs:top-[8px] ${followedCount === 0 ? "hidden" : ""} text-white  absolute`}>{followedCount}</p>
                            <p className="text-[9px] xs:text-[10px]">Followed</p>
                        </button>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime relative">
                            <FontAwesomeIcon icon={faMessage} className="text-xl xs:text-[22px]"/>
                            <p className={`text-[9px] xs:text-[10px] top-[6px] ${messageCount === 0 ? "hidden" : ""} text-white  absolute`}>{messageCount}</p>
                            <p className="text-[9px] xs:text-[10px]">Messages</p>
                        </button>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime"
                                onClick={() => navigate('/myAccount')}>
                            <FontAwesomeIcon icon={faUser} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Account</p>
                        </button>
                        <button
                            className={`${isAuthenticated ? "flex" : "hidden"} flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime relative`}
                            onClick={handleDarkMode}>
                            <FontAwesomeIcon icon={faMoon}
                                             className={`text-[13px] xs:text-[15px] top-[7px] ${darkMode ? "" : "opacity-0"} ${modeIconAnimation} absolute`}/>
                            <FontAwesomeIcon icon={faSun}
                                             className={`text-[12px] xs:text-[14px] top-[8px] ${darkMode ? "opacity-0" : ""} ${modeIcon1Animation} absolute`}/>
                            <FontAwesomeIcon icon={faRegularCircle}
                                             className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Mode</p>
                        </button>
                        {/*base on 'isAuthenticated' shows user logout button or login button*/}
                        {isAuthenticated ? (
                            <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime"
                                    onClick={logout}>
                                <FontAwesomeIcon icon={faRightFromBracket} className="text-xl xs:text-[22px]"/>
                                <p className="text-[9px] xs:text-[10px]">Logout</p>
                            </button>) : (
                            <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime"
                                    onClick={() => navigate('/authenticate')}>
                                <FontAwesomeIcon icon={faAddressCard} className="text-xl xs:text-[22px]"/>
                                <p className="text-[9px] xs:text-[10px]">Login</p>
                            </button>
                        )}
                    </div>
                </>
            )}
        </>
    )
}

export default NavBar