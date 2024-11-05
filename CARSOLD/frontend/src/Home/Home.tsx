import NavBar from "../NavBar/NavBar.tsx";
import {ReactElement} from "react";
import api from "../Config/AxiosConfig.tsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from '../Config/AuthProvider.tsx'

function Home(): ReactElement {
    const {checkAuth} = useAuth();
    const navigate = useNavigate();
    //logging out
    const logout = async (): Promise<void> => {
        await api.get(`${import.meta.env.VITE_BACKEND_URL}api/auth/logout`)
        setTimeout(async () => {
            await checkAuth();
            navigate('/authenticate');
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