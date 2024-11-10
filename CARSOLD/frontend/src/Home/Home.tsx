import NavBar from "../NavBar/NavBar.tsx";
import {ReactElement} from "react";
import {api} from "../Config/AxiosConfig.tsx";
import {useAuth} from '../Config/AuthProvider.tsx'

function Home(): ReactElement {
    const {checkAuth} = useAuth();
    //logging out
    const logout = async (): Promise<void> => {
        await api.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/logout`)
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