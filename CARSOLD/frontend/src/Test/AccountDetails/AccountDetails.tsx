import {ReactElement, useEffect, useState} from "react";
import NavBar from "../../NavBar/NavBar.tsx";
import Footer from "../../NavBar/Footer.tsx";
import {useItems} from "../../GlobalProviders/ItemsProvider.tsx";
import {useUtil} from "../../GlobalProviders/UtilProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";

//'/myAccount' page
function AccountDetails(): ReactElement {

    //global items
    const {followed, messages} = useItems();

    //global window size state to adapt display
    const {isWide} = useUtil();

    //state that retrieves params from URL
    const {section} = useParams();

    //navigates user
    const navigate = useNavigate();

    //state which defines what is displayed
    //if section is likely extracted from url - it sets choice to that value, if not - defaults 'myOffers'
    const [choice, setChoice] = useState<"myOffers" | "followed" | "messages" | "settings" | "info">("myOffers");

    //checks for section change and navigates user
    useEffect(() => {
        const validSections: Array<"myOffers" | "followed" | "messages" | "settings" | "info"> = [
            "myOffers", "followed", "messages", "settings", "info"];
        if (section && validSections.includes(section as never)) {
            setChoice(section as "myOffers" | "followed" | "messages" | "settings" | "info");
        } else {
            navigate("/myAccount/myOffers", {replace: true});
        }
    }, [section, navigate])

    //navigates to new route and updates 'choice'
    const handleNavigation = (destination: "myOffers" | "followed" | "messages" | "settings" | "info") => {
        navigate(`/myAccount/${destination}`);
        setChoice(destination);
    }

    //array state to change lower bar buttons color
    const [textColor, setTextColor] = useState<("black" | "white")[]>([
        "black", "black", "black", "black", "black"
    ]);

    //state to monitor touch activation
    const [touchActive, setTouchActive] = useState<boolean>(false);

    //changes lower bar buttons color on touchStart, touchEnd, mouseEnter and mouseLeave
    const handleTouchStart = (index: number) => {
        setTextColor((prev) =>
            prev.map((color, i) => (i === index ? "white" : color)));
        setTouchActive(true);
    };

    const handleTouchEnd = (index: number) => {
        setTextColor((prev) =>
            prev.map((color, i) => (i === index ? "black" : color)));
    };

    const handleMouseEnter = (index: number) => {
        if (!touchActive) {
            setTextColor((prev) =>
                prev.map((color, i) => (i === index ? "white" : color)));
        }
    };

    const handleMouseLeave = (index: number) => {
        setTextColor((prev) =>
            prev.map((color, i) => (i === index ? "black" : color)));
        setTouchActive(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            {/*page content*/}
            <div className="flex-grow flex flex-col items-center mt-16 xs:mt-[76px]
             sm:mt-[88px] lg:mt-[100px] xl:mt-[120px] 2xl:mt-[140px] 3xl:mt-[155px] mb-32">
                <div>
                    image and username
                </div>
                {/*display container*/}
                <div
                    className={`flex bg-lowLime ${isWide ? "flex-row justify-between w-11/12 sm:max-w-[850px]" +
                        "lg:max-w-[950px] xl:max-w-[1050px] 2xl:max-w-[1300px] 3xl:max-w-[1400px]" : "flex-col w-11/12 max-w-[530px]"} mb-24`}>
                    {/*buttons container*/}
                    <div
                        className={`flex flex-col bg-lime ${isWide ? "px-4 lg:px-5 xl:px-6 2xl:px-7 3xl:px-8 gap-9 lg:gap-[48px] xl:gap-[58px] 2xl:gap-[64px] 3xl:gap-[68px] justify-center"
                            : "py-4 gap-2"} text-sm xs:text-lg lg:text-xl xl:text-[22px] 2xl:text-[26px] 3xl:text-3xl`}>
                        <div
                            className={`flex ${isWide ? "flex-col gap-9 lg:gap-[48px] xl:gap-[58px] 2xl:gap-[64px] 3xl:gap-[68px]"
                                : "flex-row justify-evenly"}`}>
                            <button
                                className={'py-[2px] px-[6px] w-[90px] xs:w-32 lg:w-[138px] xl:w-[146px] 2xl:w-[164px] 3xl:w-[186px] h-6 xs:h-8 sm:h-9 lg:h-10 xl:h-[42px] 2xl:h-[48px] 3xl:h-[56px]' +
                                    ` rounded-sm bg-lowLime shadow whitespace-nowrap text-${textColor[0]}`}
                                onClick={() => handleNavigation("myOffers")}
                                onTouchStart={() => handleTouchStart(0)}
                                onTouchEnd={() => handleTouchEnd(0)}
                                onMouseEnter={() => handleMouseEnter(0)}
                                onMouseLeave={() => handleMouseLeave(0)}>
                                My offers
                            </button>
                            <button
                                className={'py-[2px] px-[6px] w-[90px] xs:w-32 lg:w-[138px] xl:w-[146px] 2xl:w-[164px] 3xl:w-[186px] h-6 xs:h-8 sm:h-9 lg:h-10 xl:h-[42px] 2xl:h-[48px] 3xl:h-[56px] ' +
                                    `rounded-sm bg-lowLime shadow text-${textColor[1]}`}
                                onClick={() => handleNavigation("followed")}
                                onTouchStart={() => handleTouchStart(1)}
                                onTouchEnd={() => handleTouchEnd(1)}
                                onMouseEnter={() => handleMouseEnter(1)}
                                onMouseLeave={() => handleMouseLeave(1)}>
                                Followed
                            </button>
                            <button
                                className={'py-[2px] px-[6px] w-[90px] xs:w-32 lg:w-[138px] xl:w-[146px] 2xl:w-[164px] 3xl:w-[186px] h-6 xs:h-8 sm:h-9 lg:h-10 xl:h-[42px] 2xl:h-[48px] 3xl:h-[56px] ' +
                                    `rounded-sm bg-lowLime shadow text-${textColor[2]}`}
                                onClick={() => handleNavigation("messages")}
                                onTouchStart={() => handleTouchStart(2)}
                                onTouchEnd={() => handleTouchEnd(2)}
                                onMouseEnter={() => handleMouseEnter(2)}
                                onMouseLeave={() => handleMouseLeave(2)}>
                                Messages
                            </button>
                        </div>
                        <div
                            className={`flex ${isWide ? "flex-col gap-9 lg:gap-[48px] xl:gap-[58px] 2xl:gap-[64px] 3xl:gap-[68px]"
                                : "flex-row justify-evenly mx-[52px] xs:mx-[72px]"}`}>
                            <button
                                className={'py-[2px] px-[6px] w-[90px] xs:w-32 lg:w-[138px] xl:w-[146px] 2xl:w-[164px] 3xl:w-[186px] h-6 xs:h-8 sm:h-9 lg:h-10 xl:h-[42px] 2xl:h-[48px] 3xl:h-[56px] ' +
                                    `rounded-sm bg-lowLime shadow text-${textColor[3]}`}
                                onClick={() => handleNavigation("settings")}
                                onTouchStart={() => handleTouchStart(3)}
                                onTouchEnd={() => handleTouchEnd(3)}
                                onMouseEnter={() => handleMouseEnter(3)}
                                onMouseLeave={() => handleMouseLeave(3)}>
                                Settings
                            </button>
                            <button
                                className={'py-[2px] px-[6px] w-[90px] xs:w-32 lg:w-[138px] xl:w-[146px] 2xl:w-[164px] 3xl:w-[186px] h-6 xs:h-8 sm:h-9 lg:h-10 xl:h-[42px] 2xl:h-[48px] 3xl:h-[56px]' +
                                    `rounded-sm bg-lowLime shadow text-${textColor[4]}`}
                                onClick={() => handleNavigation("info")}
                                onTouchStart={() => handleTouchStart(4)}
                                onTouchEnd={() => handleTouchEnd(4)}
                                onMouseEnter={() => handleMouseEnter(4)}
                                onMouseLeave={() => handleMouseLeave(4)}>
                                Info
                            </button>
                        </div>
                    </div>
                    {/*'choice' content*/}
                    <div className={`flex flex-col w-full rounded-sm 
                     ${isWide ? "justify-center items-center min-h-[400px] lg:min-h-[480px] xl:min-h-[550px] 2xl:min-h-[620px] " +
                        "3xl:min-h-[680px]" : "justify-center items-center min-h-72 xs:min-h-80"}`}>
                        {choice === "myOffers" ? (
                            <div className="">
                                My offers
                            </div>
                        ) : choice === "followed" ? (
                            <div className="">
                                {followed === 0 ? (
                                    <p className="">
                                        You haven't followed any car yet...
                                    </p>
                                ) : (
                                    <p>
                                        {/* Add content here for when there are followed cars */}
                                    </p>
                                )}
                            </div>
                        ) : choice === "messages" ? (
                            <div className="">
                                {messages === 0 ? (
                                    <p className="">
                                        You don't have any messages...
                                    </p>
                                ) : (
                                    <p>
                                        {/* Add content here for when there are messages */}
                                    </p>
                                )}
                            </div>
                        ) : choice === "settings" ? (
                            <div className="">
                                settings
                            </div>
                        ) : choice === "info" ? (
                            <div className="">
                                info
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default AccountDetails