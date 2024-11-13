import NavBar from "../NavBar/NavBar.tsx";
import {ReactElement} from "react";
import {api} from "../Config/AxiosConfig/AxiosConfig.tsx";
import {useAuth} from '../Config/AuthConfig/AuthProvider.tsx'

function Home(): ReactElement {
    const {checkAuth} = useAuth();
    //logging out function
    const logout = async () => {
        await api.get(`api/auth/logout`)
        setTimeout(async () => {
            await checkAuth();
        }, 1000);
    }

    return (
        <>
            <NavBar/>
            <div className="p-32">
                <button onClick={logout}>logout</button>
                <br/>
            </div>
        </>
    )
}

export default Home;