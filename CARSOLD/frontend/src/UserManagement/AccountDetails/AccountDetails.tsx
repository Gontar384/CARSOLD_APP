import {ReactElement, useState} from "react";
import NavBar from "../../NavBar/NavBar.tsx";
import Footer from "../../NavBar/Footer.tsx";

//'/myAccount' page
function AccountDetails(): ReactElement{

    const [lowerBar, setLowerBar] = useState<boolean>(false);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar setLowerBar={setLowerBar}/>
            <div className="flex-grow flex flex-col">

            </div>
            <Footer lowerBar={lowerBar}/>
        </div>
    )
}

export default AccountDetails