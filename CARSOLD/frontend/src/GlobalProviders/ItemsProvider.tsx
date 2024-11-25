import React, {createContext, useContext, useState} from "react";

//provides items globally, will be expanded in the future

//defines structure
interface ItemsContextType {
    messages: number,
    setMessages: React.Dispatch<React.SetStateAction<number>>,
    followed: number,
    setFollowed: React.Dispatch<React.SetStateAction<number>>
}

//creates notifications context
const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

//creates provider-component which is then used in 'App' and wraps other components
export const ItemsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [messages, setMessages] = useState<number>(0);
    const [followed, setFollowed] = useState<number>(0);

    //makes values accessible for all ItemsProvider children
    return <ItemsContext.Provider value={{messages, setMessages, followed, setFollowed}}>
        {children}
    </ItemsContext.Provider>
}

//custom hook to use context
export const useItems = (): ItemsContextType => {
    const context = useContext(ItemsContext);
    if (context === undefined) {
        throw new Error("useNotifications must be used within an ItemsProvider");
    }
    return context;
}