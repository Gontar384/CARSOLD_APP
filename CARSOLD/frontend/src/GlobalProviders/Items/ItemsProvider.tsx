import React, {useState} from "react";
import {ItemsContext} from "./useItems.ts"

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [messages, setMessages] = useState<number>(22);
    const [profilePicChange, setProfilePicChange] = useState<boolean>(false);  //to dynamically change profilePic in navbar

    return <ItemsContext.Provider value={{messages, setMessages, profilePicChange, setProfilePicChange}}>
        {children}
    </ItemsContext.Provider>
}