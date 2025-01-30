import {useState} from "react";
import {api} from "../Config/AxiosConfig/AxiosConfig.ts";
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
    const {checkAuth, isAuthenticated} = useAuth();

    const handleUsernameFetch = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await api.get('api/get-username');
            if (response.data.username) {
                setUserDetails(response.data.username);
            }
        } catch (error) {
            console.error("Error fetching username: ", error);
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
            console.error("Error fetching profilePic: ", error);
        } finally {
            setProfilePicFetched(true);
            setProfilePicChange(false);
        }
    } //fetches profile pic

    const logout= () => {
        setTimeout(async () => {
            try {
                const response: AxiosResponse = await api.get(`api/auth/logout`);
                if (response.data) {
                    await checkAuth();
                }
            } catch (error) {
                console.error("Error during logout: ", error);
            }
        }, 1000);
    }  //logout

    return {userDetails, usernameFetched, handleUsernameFetch, logout, profilePic, profilePicFetched, handleProfilePicFetch}
}