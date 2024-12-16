import React, {useState} from "react";
import {ItemsContext} from "./useItems.ts"

//provides items
export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [messages, setMessages] = useState<number>(0);
    const [followed, setFollowed] = useState<number>(0);
    const [search, setSearch] = useState<string>("");   //checks input
    const [profilePicChange, setProfilePicChange] = useState<boolean>(false);  //to dynamically change profilePic in navbar

    return <ItemsContext.Provider value={{
        messages,
        setMessages,
        followed,
        setFollowed,
        search,
        setSearch,
        profilePicChange,
        setProfilePicChange
    }}>
        {children}
    </ItemsContext.Provider>
}
