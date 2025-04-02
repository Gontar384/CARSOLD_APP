import React, {useState} from "react";
import {ItemsContext} from "./useItems.ts"

export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [messages, setMessages] = useState<number>(22);
    const [profilePicChange, setProfilePicChange] = useState<boolean>(false);  //to dynamically change profilePic in navbar
    //for dynamic searching
    const [phrase, setPhrase] = useState<string>("");
    const [trigger, setTrigger] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    const [searched, setSearched] = useState<boolean>(false);

    return <ItemsContext.Provider value={{messages, setMessages, profilePicChange, setProfilePicChange, phrase, setPhrase, trigger, setTrigger, clicked, setClicked, searched, setSearched}}>
        {children}
    </ItemsContext.Provider>
}