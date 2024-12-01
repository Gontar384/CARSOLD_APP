import React, {useEffect, useRef, useState} from "react";
import {useUtil} from "../../../GlobalProviders/UtilProvider.tsx";
import Logo from "./Atomic/Logo.tsx";
import {useNavigate} from "react-router-dom";
import SearchBar from "./Atomic/SearchBar.tsx";
import {useAuth} from "../../../GlobalProviders/AuthProvider.tsx";
import {api} from "../../../Config/AxiosConfig/AxiosConfig.tsx";
import AddButton from "./Atomic/AddButton.tsx";
import UserDetails from "./Atomic/UserDetails/UserDetails.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import LowerBar from "./Atomic/LowerBar/LowerBar.tsx";
import {useDebouncedValue} from "../../../PageComponents/Authentication/Form.tsx";
import {useItems} from "../../../GlobalProviders/ItemsProvider.tsx";

const NavBar: React.FC = () => {

    //global states for util, items and auth

    const {lowerBar, setLowerBar, isWide, darkMode, toggleDarkMode} = useUtil();
    const {followed, messages} = useItems();
    const {isAuthenticated, checkAuth} = useAuth();

    const navigate = useNavigate();

    //SEARCH BAR

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

    //USER DETAILS

    const [userDetails, setUserDetails] = useState<string>("");   //username fetched

    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);

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
    }, [isAuthenticated]);   //fetches username

    const [userIconAnimation, setUserIconAnimation] = useState<"animate-pop" | null>(null);

    const [barActive, setBarActive] = useState<boolean>(false);

    const [barHovered, setBarHovered] = useState<boolean>(false);

    const debouncedHover: boolean = useDebouncedValue(barHovered, 300)

    const [animationActive, setAnimationActive] = useState<boolean>(false);   //prevents too many animations

    const handleActivateBar = () => {
        if (!animationActive) {
            setUserIconAnimation("animate-pop");
            setAnimationActive(true);
        }
        setBarActive(true);
        setBarHovered(true);
    }    //activates bar

    const handleDeactivateBar = () => {
        setUserIconAnimation(null);
        setBarHovered(false);
    }   //deactivates on mouseLeave

    useEffect(() => {
        if (!debouncedHover && !barHovered) {
            setBarActive(false);
            setAnimationActive(false);
            setModeIconAnimation(null);
            setModeIcon1Animation(null);
        }
    }, [debouncedHover, barHovered]);  //for user-friendly delay

    const handleActivateBarKeyboard = () => {
        setBarActive(prev => !prev);
    }    //for keyboard

    const handleToggleBar = () => {
        setBarActive((prev) => !prev);
        if (!barActive && !animationActive) {
            setUserIconAnimation("animate-pop");
            setAnimationActive(true);
        } else {
            setUserIconAnimation(null);
            setAnimationActive(false);
        }
    };   //activates for mobile

    const handleDropdownInteraction = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        event.stopPropagation(); //prevents closing the dropdown buttons when clicking on them
    };  //prevent closing

    //LOWER BAR

    const [barAnimation, setBarAnimation] = useState<"animate-slideDown" | "animate-slideUp" | null>(null);

    const [iconAnimation, setIconAnimation] = useState<"animate-flip" | "animate-flipRev" | null>(null);

    const [isDisabled, setIsDisabled] = useState<boolean>(false);  //prevents from spamming button

    const [modeIconAnimation, setModeIconAnimation] = useState<"animate-fill" | "animate-empty" | null>(null);   //dark mode icons
    const [modeIcon1Animation, setModeIcon1Animation] = useState<"animate-fill" | "animate-empty" | null>(null); //animations

    const handleLowerBar = () => {
        if (isDisabled) return;
        setIconAnimation((prev) =>
            prev === "animate-flip" ? "animate-flipRev" : "animate-flip");
        if (!lowerBar) {
            setBarAnimation("animate-slideUp")
            setLowerBar(true);
        } else {
            setBarAnimation("animate-slideDown")
            setLowerBar(false)
        }
        setIsDisabled(true);
        setTimeout(() => {
            setIsDisabled(false);
        }, 300)
        setModeIconAnimation(null);
        setModeIcon1Animation(null);
    }   //activates and hides lower bar

    const [lowerBarActive, setLowerBarActive] = useState<boolean>(false);

    useEffect(() => {
        if (lowerBar) {
            setLowerBarActive(true);
        } else {
            const timeout = setTimeout(() => {
                setLowerBarActive(false);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [lowerBar]);    //for delay to make lower bar more smooth (not relying on global state)

    useEffect(() => {
        setModeIconAnimation(null);
        setModeIcon1Animation(null);
        setButtonAnimation(null);
        setIconAnimation(null);
        setBarAnimation(null);
    }, [isWide]);   //resets animations when resizing

    const handleDarkMode = () => {
        toggleDarkMode();
        setModeIconAnimation(!darkMode ? "animate-fill" : "animate-empty");
        setModeIcon1Animation(!darkMode ? "animate-empty" : "animate-fill");
    }   //handles dark mode

    const logout = async () => {
        await api.get(`api/auth/logout`)
        setTimeout(async () => {
            await checkAuth();
            navigate('/authenticate');
        }, 1000);
    }  //logs out

    const [buttonColor, setButtonsColor] = useState<("black" | "white")[]>([
        "black", "black", "black", "black", "black", "black", "black"
    ]);  //changes lower bar buttons colors

    const [touchActive, setTouchActive] = useState<boolean>(false);   //helps not to mix mouse/touch events

    const handleTouchStart = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "white" : color)));
        setTouchActive(true);
    };    //changes color

    const handleTouchEnd = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "black" : color)));
    };

    const handleMouseEnter = (index: number) => {
        if (!touchActive) {
            setButtonsColor((prev) =>
                prev.map((color, i) => (i === index ? "white" : color)));
        }
    };

    const handleMouseLeave = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "black" : color)));
        setTouchActive(false);
    };

    return (
        <>
            {isWide ? (
                <div className="flex flex-row items-center justify-evenly fixed left-0 top-0 right-0
                     w-full h-9 lg:h-10 xl:h-12 2xl:h-[52px] 3xl:h-14 shadow-bottom bg-lime z-50">
                    <Logo navigate={() => navigate("/home")}/>
                    <SearchBar search={search} setSearch={setSearch} isClicked={isClicked}
                               buttonAnimation={buttonAnimation} magnifierAnimation={magnifierAnimation}
                               componentRef={componentRef} handleClick={handleClick}/>
                    <AddButton/>
                    <UserDetails userDetails={userDetails} usernameFetched={usernameFetched}
                                 userIconAnimation={userIconAnimation}
                                 barActive={barActive} handleActivateBar={handleActivateBar}
                                 handleDeactivateBar={handleDeactivateBar}
                                 handleToggleBar={handleToggleBar} handleActivateBarKeyboard={handleActivateBarKeyboard}
                                 handleDropdownInteraction={handleDropdownInteraction} handleDarkMode={handleDarkMode}
                                 logout={logout} messages={messages} followed={followed} isAuthenticated={isAuthenticated} darkMode={darkMode}
                                 modeIconAnimation={modeIconAnimation} setModeIconAnimation={setModeIconAnimation}
                                 modeIcon1Animation={modeIcon1Animation} setModeIcon1Animation={setModeIcon1Animation}
                                 navigate={() => navigate("/authenticate/login")}/>
                </div>
            ) : (
                <>
                    <div
                        className="flex flex-row items-center justify-evenly h-7 xs:h-8 fixed left-0 top-0 right-0 bg-lime shadow-bottom z-50">
                        <button onClick={handleLowerBar} className="text-base xs:text-xl">
                            <FontAwesomeIcon icon={faBars} className={`${iconAnimation}`}/>
                        </button>
                        <Logo navigate={navigate}/>
                        <SearchBar search={search} setSearch={setSearch} isClicked={isClicked}
                                   buttonAnimation={buttonAnimation} magnifierAnimation={magnifierAnimation}
                                   componentRef={componentRef} handleClick={handleClick}/>
                    </div>
                    {lowerBarActive &&
                        <LowerBar navigate={navigate} isAuthenticated={isAuthenticated} followed={followed}
                                  messages={messages} handleDarkMode={handleDarkMode} logout={logout} barAnimation={barAnimation}
                                  modeIconAnimation={modeIconAnimation} modeIcon1Animation={modeIcon1Animation}
                                  handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave}
                                  handleTouchStart={handleTouchStart} handleTouchEnd={handleTouchEnd}
                                  buttonColor={buttonColor}
                        />}
                </>
            )}
        </>
    )
}

export default NavBar