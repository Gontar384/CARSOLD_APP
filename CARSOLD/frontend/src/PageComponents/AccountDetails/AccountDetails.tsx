import {ReactElement, useState} from "react";
import NavBar from "../../NavBar/NavBar.tsx";
import Footer from "../../NavBar/Footer.tsx";
import {useItems} from "../../GlobalProviders/ItemsProvider.tsx";
import {useUtil} from "../../GlobalProviders/UtilProvider.tsx";

//'/myAccount' page
function AccountDetails(): ReactElement {

    //global items
    const {followed, messages} = useItems();

    //global window size state to adapt display
    const {isWide} = useUtil();

    //state which defines what is displayed
    const [choice, setChoice] = useState<"myOffers" | "followed" | "messages" | "settings">("myOffers");

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
                <div className={`flex ${isWide ? "flex-row justify-between w-11/12 gap-5" : 
                    "flex-col w-11/12 gap-2"}`}>
                    {/*buttons container*/}
                    <div className={`flex ${isWide ? "flex-col justify-evenly" : "flex-row justify-evenly"}`}>
                        <button className="text-sm xs:text-lg border border-black py-[2px] px-[6px] rounded-sm bg-lime whitespace-nowrap
                         hover:text-white" onClick={() => setChoice("myOffers")}>
                            My offers
                        </button>
                        <button className="text-sm xs:text-lg border border-black py-[2px] px-[6px] rounded-sm bg-lime
                         hover:text-white" onClick={() => setChoice("followed")}>
                            Followed
                        </button>
                        <button className="text-sm xs:text-lg border border-black py-[2px] px-[6px] rounded-sm bg-lime
                     hover:text-white" onClick={() => setChoice("messages")}>
                            Messages
                        </button>
                        <button className="text-sm xs:text-lg border border-black py-[2px] px-[6px] rounded-sm bg-lime
                     hover:text-white" onClick={() => setChoice("settings")}>
                            Settings
                        </button>
                    </div>
                    {/*'choice' content*/}
                    <div className={`flex flex-col w-full
                     ${isWide ? "justify-center items-center min-h-96 border border-black" : 
                        "justify-center items-center min-h-96 border border-black"}`}>
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