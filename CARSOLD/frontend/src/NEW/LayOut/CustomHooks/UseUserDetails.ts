import {useAuth} from "../../../GlobalProviders/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {api} from "../../../Config/AxiosConfig/AxiosConfig.tsx";

//manages username fetch and logout function
export const useUserDetails = () => {

    const { checkAuth, isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState<string>("");   //username fetched

    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);

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
    } //fetches username

    const logout = async () => {
        await api.get(`api/auth/logout`)
        setTimeout(async () => {
            await checkAuth();
            navigate('/authenticate');
        }, 1000);
    }  //logout


    return { userDetails, usernameFetched, handleUsernameFetch, logout }
}