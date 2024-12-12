import {useState} from "react";
import {useAuth} from "../../GlobalProviders/AuthProvider.tsx";
import {api} from "../../Config/AxiosConfig/AxiosConfig.tsx";
import {useNavigate} from "react-router-dom";

//manages username fetch and logout function
export const useUserDetails = () => {

    const {checkAuth, isAuthenticated} = useAuth();

    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState<string>("");   //username fetched

    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);

    const handleUsernameFetch = async () => {
        if (!isAuthenticated) return;
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

    const [profilePic, setProfilePic] = useState<string>("");
    const [profilePicFetched, setProfilePicFetched] = useState<boolean>(false);

    const handleProfilePicFetch = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await api.get('api/get-profilePic');
            if (response.data.profilePic) {
                setProfilePic(response.data.profilePic);
            }
        } catch (error) {
            console.log("Error fetching profilePic: ", error);
        } finally {
            setProfilePicFetched(true);
        }
    } //fetches profile pic

    const logout = async () => {
        try {
            setTimeout( async () => {
                await api.get(`api/auth/logout`);
                navigate("/authenticate/login");
                await checkAuth();
            }, 1000)
        } catch (error) {
            console.log("Error during logout: ", error);
        }
    }  //logout


    return {userDetails, usernameFetched, handleUsernameFetch, logout, profilePic, profilePicFetched, handleProfilePicFetch}
}