import React, {createContext, useContext, useState} from "react";

interface ItemsContextType {
    messages: number,
    setMessages: React.Dispatch<React.SetStateAction<number>>,
    followed: number,
    setFollowed: React.Dispatch<React.SetStateAction<number>>
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    profilePicChange: boolean;
    setProfilePicChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

//provides items
export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [messages, setMessages] = useState<number>(0);
    const [followed, setFollowed] = useState<number>(0);
    const [search, setSearch] = useState<string>("");   //checks input
    const [profilePicChange, setProfilePicChange] = useState<boolean>(false);  //to dynamically change profilePic in navbar

    return <ItemsContext.Provider value={{ messages, setMessages, followed, setFollowed, search, setSearch, profilePicChange, setProfilePicChange }}>
        {children}
    </ItemsContext.Provider>
}

export const useItems = (): ItemsContextType => {
    const context = useContext(ItemsContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within an ItemsProvider");
    }
    return context;
}