import React, {useEffect, useState} from "react";
import { UserUtilContext } from "./useUserUtil.ts";
import {useAuth} from "../Auth/useAuth.ts";
import {fetchProfilePic, fetchUsername} from "../../ApiCalls/Services/UserService.ts";

export const UserUtilProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [username, setUsername] = useState<string>(""); 
    const [usernameFetched, setUsernameFetched] = useState<boolean>(false);
    const [profilePic, setProfilePic] = useState<string>("");
    const [profilePicFetched, setProfilePicFetched] = useState<boolean>(false);
    const [profilePicChanged, setProfilePicChanged] = useState<boolean>(false);
    const {isAuthenticated, preventFetch} = useAuth();

    const handleFetchUsername = async () => {
        if (preventFetch || !isAuthenticated) return;
        try {
            const response = await fetchUsername();
            if (response.data.value) setUsername(response.data.value);
            else setUsername("");
        } catch (error) {
            setUsername("");
            console.error("Error fetching username: ", error);
        } finally {
            setUsernameFetched(true);
        }
    }

    const handleFetchProfilePic = async () => {
        if (preventFetch || !isAuthenticated) return;
        try {
            const response = await fetchProfilePic();
            if (response.data.value) setProfilePic(response.data.value);
            else setProfilePic("");
        } catch (error) {
            setProfilePic("");
            console.error("Error fetching profilePic: ", error);
        } finally {
            setProfilePicFetched(true);
            setProfilePicChanged(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated) handleFetchUsername();
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) handleFetchProfilePic();
    }, [isAuthenticated, profilePicChanged]);

    return <UserUtilContext.Provider value={{username, profilePic, usernameFetched, profilePicFetched, setProfilePicChanged}}>
        {children}
    </UserUtilContext.Provider>
}