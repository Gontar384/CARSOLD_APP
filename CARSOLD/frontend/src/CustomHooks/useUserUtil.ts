import {useState} from "react";
import {api} from "../Config/AxiosConfig/AxiosConfig.ts";
import {useAuth} from "../GlobalProviders/Auth/useAuth.ts";
import {useItems} from "../GlobalProviders/Items/useItems.ts";
import {fetchUsername} from "../ApiCalls/Service/UserService.ts";

//manages username fetch and logout function
export const useUserUtil = () => {

    const [username, setUsername] = useState<string>("");   //username fetched
    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);
    const [profilePic, setProfilePic] = useState<string>("");
    const [profilePicFetched, setProfilePicFetched] = useState<boolean>(false);
    const {setProfilePicChange} = useItems();
    const {isAuthenticated} = useAuth();

    const handleFetchUsername = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await fetchUsername();
            if (response.data.username) {
                setUsername(response.data.username);
            }
        } catch (error) {
            console.error("Error fetching username: ", error);
        } finally {
            setUsernameFetched(true);
        }
    }

    const fetchProfilePic = async () => {
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

    return {username, usernameFetched, handleFetchUsername, profilePic, profilePicFetched, fetchProfilePic}
}