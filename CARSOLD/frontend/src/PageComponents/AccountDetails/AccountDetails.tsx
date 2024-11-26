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
    const [choice, setChoice] = useState<"myOffers" | "followed" | "messages" | "settings">("myOffers");

    //checks for section change and navigates user
    useEffect(() => {
        const validSections: Array<"myOffers" | "followed" | "messages" | "settings"> = [
            "myOffers", "followed", "messages", "settings"];
        if (section && validSections.includes(section as never)) {
            setChoice(section as "myOffers" | "followed" | "messages" | "settings");
        } else {
            navigate("/myAccount/myOffers", {replace: true});
        }
    }, [section, navigate])

    //navigates to new route and updates 'choice'
    const handleNavigation = (destination: "myOffers" | "followed" | "messages" | "settings") => {
        navigate(`/myAccount/${destination}`);
        setChoice(destination);
    }

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            {/*page content*/}
            <div className="flex-grow flex flex-col items-center mt-16 xs:mt-[76px]
             sm:mt-[88px] lg:mt-[100px] xl:mt-[120px] 2xl:mt-[140px] 3xl:mt-[155px]">
                <div>
                    image and username
                </div>
                {/*display container*/}
                <div
                    className={`flex ${isWide ? "flex-row justify-between w-11/12 gap-5 sm:max-w-[800px] lg:max-w-[900px] " +
                        "xl:max-w-[1000px] 2xl:max-w-[1200px] 3xl:max-w-[1350px]" : "flex-col w-11/12 max-w-[530px] gap-2"} mb-36`}>
                    {/*buttons container*/}
                    <div className={`flex ${isWide ? "flex-col gap-10" : "flex-row justify-evenly"} text-sm xs:text-lg lg:text-xl 
                     xl:text-[22px] 2xl:text-[26px] 3xl:text-3xl`}>
                        <button className="py-[2px] px-[6px] rounded-sm bg-lime shadow-xl whitespace-nowrap
                         hover:text-white" onClick={() => handleNavigation("myOffers")}>
                            My offers
                        </button>
                        <button className="py-[2px] px-[6px] rounded-sm bg-lime shadow-xl
                         hover:text-white" onClick={() => handleNavigation("followed")}>
                            Followed
                        </button>
                        <button className="py-[2px] px-[6px] rounded-sm bg-lime shadow-xl
                     hover:text-white" onClick={() => handleNavigation("messages")}>
                            Messages
                        </button>
                        <button className="py-[2px] px-[6px] rounded-sm bg-lime shadow-xl
                     hover:text-white" onClick={() => handleNavigation("settings")}>
                            Settings
                        </button>
                    </div>
                    {/*'choice' content*/}
                    <div className={`flex flex-col w-full bg-lime rounded-sm
                     ${isWide ? "justify-center items-center min-h-[350px] lg:min-h-[400px] xl:min-h-[450px] 2xl:min-h-[500px] " +
                        "3xl:min-h-[540px]" : "justify-center items-center min-h-72 xs:min-h-80 mb-32"}`}>
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
                        ) : null}
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default AccountDetails