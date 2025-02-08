import {useState} from "react";
import {useAuth} from "../GlobalProviders/Auth/useAuth.ts";
import {useItems} from "../GlobalProviders/Items/useItems.ts";
import {fetchProfilePic, fetchUsername} from "../ApiCalls/Services/UserService.ts";

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
            if (response.data.value) {
                setUsername(response.data.value);
            } else {
                setUsername("");
            }
        } catch (error) {
            setUsername("");
            console.error("Error fetching username: ", error);
        } finally {
            setUsernameFetched(true);
        }
    }

    const handleFetchProfilePic = async () => {
        if (!isAuthenticated) return;
        try {
            const response = await fetchProfilePic();
            if (response.data.value) {
                setProfilePic(response.data.value);
            } else {
                setProfilePic("");
            }
        } catch (error) {
            setProfilePic("");
            console.error("Error fetching profilePic: ", error);
        } finally {
            setProfilePicFetched(true);
            setProfilePicChange(false);
        }
    }

    return {username, usernameFetched, handleFetchUsername, profilePic, profilePicFetched, handleFetchProfilePic}
}