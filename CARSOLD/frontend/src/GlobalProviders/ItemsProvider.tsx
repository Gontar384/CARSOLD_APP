import React, {createContext, useContext, useState} from "react";

interface ItemsContextType {
    messages: number,
    setMessages: React.Dispatch<React.SetStateAction<number>>,
    followed: number,
    setFollowed: React.Dispatch<React.SetStateAction<number>>
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

//provides items
export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [messages, setMessages] = useState<number>(1);
    const [followed, setFollowed] = useState<number>(1);

    return <ItemsContext.Provider value={{messages, setMessages, followed, setFollowed}}>
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