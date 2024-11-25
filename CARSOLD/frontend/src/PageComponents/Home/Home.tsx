import {ReactElement} from "react";
import NavBar from "../../NavBar/NavBar.tsx";
import Footer from "../../NavBar/Footer.tsx";

//'/home' page
function Home(): ReactElement {

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar/>
            <div className="flex-grow flex flex-col">

            </div>
            <Footer/>
        </div>
    )
}

export default Home;