import React, {createContext, useContext} from "react";

interface UserUtilContextType {
    username: string;
    profilePic: string;
    usernameFetched: boolean;
    profilePicFetched: boolean;
    setProfilePicChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserUtilContext = createContext<UserUtilContextType | undefined>(undefined);

export const useUserUtil = (): UserUtilContextType => {

    const context = useContext(UserUtilContext);

    if (context === undefined) throw new Error("useUserUtil must be used within an UserUtilProvider");

    return context;
}