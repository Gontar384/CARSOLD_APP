import {useState} from "react";
import {api} from "../Config/AxiosConfig/AxiosConfig.ts";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../GlobalProviders/Auth/useAuth.ts";
import {useItems} from "../GlobalProviders/Items/useItems.ts";
import {AxiosResponse} from "axios";

//manages username fetch and logout function
export const useUserDetails = () => {

    const [userDetails, setUserDetails] = useState<string>("");   //username fetched
    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);
    const [profilePic, setProfilePic] = useState<string>("");
    const [profilePicFetched, setProfilePicFetched] = useState<boolean>(false);
    const {setProfilePicChange} = useItems();
    const navigate = useNavigate();
    const {checkAuth, isAuthenticated} = useAuth();

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

    const handleProfilePicFetch = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await api.get('api/get-profilePic');
            if (response.data.profilePic) {
                setProfilePic(response.data.profilePic);
            } else {
                setProfilePic("");
            }
        } catch (error) {
            console.log("Error fetching profilePic: ", error);
        } finally {
            setProfilePicFetched(true);
            setProfilePicChange(false);
        }
    } //fetches profile pic

    const logout = async () => {
        try {
            setTimeout( async () => {
                const response: AxiosResponse = await api.get(`api/auth/logout`);
                if (response.data) {
                    navigate("/authenticate/login");
                    await checkAuth();
                } else {
                    console.log("Logout failed")
                }
            }, 1000)
        } catch (error) {
            console.log("Error during logout: ", error);
        }
    }  //logout

    return {userDetails, usernameFetched, handleUsernameFetch, logout, profilePic, profilePicFetched, handleProfilePicFetch}
}