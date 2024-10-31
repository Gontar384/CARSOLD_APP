import NavBar from "../NavBar/NavBar.tsx";
import {ReactElement} from "react";

function Home(): ReactElement {

    //logging out
    const logout = (): void => {
        localStorage.removeItem('token')
        console.log("Logging out..")
    }

    //simple info (shows token)
    const handleInfo = (): void => {
        console.log(localStorage.getItem('token'))
    }

    return (
        <>
            <NavBar/>
            <div className="p-32">
                <button onClick={logout}>logout</button>
                <button onClick={handleInfo}>info</button>
            </div>
        </>
    )
}

export default Home;