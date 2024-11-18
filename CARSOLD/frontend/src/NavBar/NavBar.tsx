import {Dispatch, ReactElement, SetStateAction, useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAddressCard,
    faBars,
    faCircleHalfStroke,
    faHeart,
    faMagnifyingGlass,
    faMessage,
    faPlus,
    faRightFromBracket,
    faSquarePlus,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom";
import {useDarkMode} from "../Config/DarkMode/DarkModeProvider.tsx";
import {useAuth} from "../Config/AuthConfig/AuthProvider.tsx";
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";
import {useLoading} from "../Config/LoadingConfig/LoadingProvider.tsx";

//navigation bar for big screens and mobile screens, passes info about lower bar 'presence' to 'authentication'
function NavBar({setLowerBar}: { setLowerBar?: Dispatch<SetStateAction<boolean>> }): ReactElement {

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

    //state which animates dark mode icon
    const [modeIconAnimation, setModeIconAnimation] = useState<"animate-flip" | "animate-flipRev" | null>(null);

    //state which says if user is authenticated or not
    const {isAuthenticated} = useAuth();

    //handles mobile lower bar pop
    const handleLowerBar = () => {
        if (isDisabled) return;
        setIconAnimation((prev) =>
            prev === null ? "animate-flip" : prev === "animate-flip" ? "animate-flipRev" : "animate-flip");
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
        if (!isAuthenticated) {   //if user isn't authenticated it sets info about lower bar 'presence' info for animated bars
            setLowerBar?.((prev) => !prev);
        }
    }

    //globally shared state and function to toggle dark mode
    const {darkMode, toggleDarkMode} = useDarkMode();

    //handles dark mode change
    const handleDarkMode = () => {
        toggleDarkMode();
        setModeIconAnimation(!darkMode ? "animate-flip" : "animate-flipRev");
    }

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

    //state for user details (basically username fetched)
    const [userDetails, setUserDetails] = useState<string>("");

    //global state used for loading, when fetching data
    const {setAppLoading} = useLoading();

    //fetches username to user details
    useEffect(() => {
        const handleUsernameFetch = async () => {
            if (!isAuthenticated) return;
            setAppLoading(true);     //starts loading before auth
            try {
                const response = await api.get('api/get-username');
                if (response.data.username) {
                    setUserDetails(response.data.username);
                }
            } catch (error) {
                console.log("Error fetching username: ", error);
            } finally {
                setAppLoading(false);
            }
        }
        handleUsernameFetch();
    }, [isAuthenticated]);

    return (
        <>
            {isWide ? (
                <>{/*big screen*/}
                    <div className="flex flex-row items-center justify-evenly fixed left-0 top-0 right-0
                     w-full h-8 sm:h-9 lg:h-10 xl:h-12 2xl:h-[52px] 3xl:h-14 border-b-2 border-black bg-lime z-50">
                        {/*logo*/}
                        <button className="flex flex-row justify-center text-xl sm:text-2xl lg:text-3xl xl:text-4xl
                         2xl:text-[44px] 3xl:text-[50px]" onClick={() => navigate('/home')}>
                            <p className="text-white">CAR</p>
                            <p className="text-black">$</p>
                            <p className="text-white">OLD</p>
                        </button>
                        {/*search bar*/}
                        <div className="flex justify-center">
                            <div className="relative" ref={componentRef}>
                                {!isClicked && search === "" ?
                                    <FontAwesomeIcon icon={faMagnifyingGlass}
                                                     className="absolute top-[6px] sm:top-[5px] lg:top-[5px] xl:top-[5px] 2xl:top-[6px] 3xl:top-[7px]
                                                     left-[7px] sm:left-[8px] lg:left-[9px] xl:left-xs 2xl:left-sm 3xl:left-lg text-[13px]
                                                     sm:text-[16px] lg:text-[20px] xl:text-[25px] 2xl:text-[31px] 3xl:text-[34px]"/>
                                    : null}
                                <input onClick={handleClick} className={`xs:w-52 sm:w-56 lg:w-72 xl:w-80 2xl:w-96 3xl:w-[450px] h-5 sm:h-6 lg:h-7 xl:h-8
                                 2xl:h-10 3xl:h-11 p-2 text-base sm:text-[18px] lg:text-[19px] xl:text-2xl 2xl:text-[25px] 3xl:text-[32px] border border-solid 
                                 border-black transition-all duration-200 ease-in-out 
                                 ${isClicked ? 'bg-white rounded' : 'bg-lime rounded-full'}`}
                                       onChange={e => setSearch(e.target.value)}/>
                            </div>
                        </div>
                        {/*add button*/}
                        <div className="flex flex-row items-center p-[1px] gap-1 border-2 border-solid border-black
                         cursor-pointer hover:bg-white hover:rounded-sm">
                            <FontAwesomeIcon icon={faPlus}
                                             className="text-xs sm:text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl"/>
                            <p className="text-xs sm:text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl truncate">Add
                                Offer</p>
                        </div>
                        {/*user details / login button*/}
                        {isAuthenticated ? (
                            <button className="flex flex-row items-center gap-[6px]">
                                <FontAwesomeIcon icon={faUser} className="sm:mb-[2px] lg:mt-[3px] xl:mt-[2px] 2xl:mt-[5px] 3xl:mt-[2px] text-xs
                                 lg:text-sm xl:text-base 2xl:text-xl 3xl:text-2xl"/>
                                <div
                                    className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl pb-1 3xl:pb-2 truncate cursor-pointer">
                                    {userDetails}
                                </div>
                            </button>
                        ) : (
                            <button onClick={() => navigate('/authenticate')}
                                    className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl pb-1 3xl:pb-2 truncate cursor-pointer">
                                <p>Log in | Register</p>
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <> {/*mobile only*/}
                    {/*upper bar*/}
                    <div
                        className="flex flex-row items-center h-7 xs:h-8 fixed left-0 top-0 right-0 bg-lime z-50">
                        <button onClick={handleLowerBar} className="w-1/6 text-base xs:text-xl ">
                            <FontAwesomeIcon icon={faBars} className={`${iconAnimation}`}/>
                        </button>
                        {/*logo*/}
                        <button className="flex flex-row justify-center w-2/6 text-xl xs:text-2xl"
                                onClick={() => navigate('/home')}>
                            <p className="text-white">CAR</p>
                            <p className="text-black">$</p>
                            <p className="text-white">OLD</p>
                        </button>
                        {/*search bar*/}
                        <div className="flex justify-center w-3/6">
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
                    {/*lower bar*/}
                    <div
                        className={`${isVisible} flex-row items-center justify-evenly h-10 xs:h-11 fixed left-0 bottom-0 right-0 bg-lime z-50 ${barAnimation}`}>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime">
                            <FontAwesomeIcon icon={faSquarePlus} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Add Offer</p>
                        </button>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime">
                            <FontAwesomeIcon icon={faHeart} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Followed</p>
                        </button>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime">
                            <FontAwesomeIcon icon={faMessage} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Messages</p>
                        </button>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime">
                            <FontAwesomeIcon icon={faUser} className="text-xl xs:text-[22px]"/>
                            <p className="text-[9px] xs:text-[10px]">Account</p>
                        </button>
                        <button className="flex flex-col items-center w-1/6 h-full p-1 hover:bg-darkLime"
                                onClick={handleDarkMode}>
                            <FontAwesomeIcon icon={faCircleHalfStroke}
                                             className={`text-xl xs:text-[22px] ${darkMode ? "rotate-180" : ""} ${modeIconAnimation}`}/>
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