import React, {createContext, useContext} from "react";

interface ItemsContextType {
    messages: number,
    setMessages: React.Dispatch<React.SetStateAction<number>>,
    profilePicChange: boolean;
    setProfilePicChange: React.Dispatch<React.SetStateAction<boolean>>;
    phrase: string;
    setPhrase: React.Dispatch<React.SetStateAction<string>>;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const useItems = (): ItemsContextType => {

    const context = useContext(ItemsContext);

    if (context === undefined) throw new Error("useItems must be used within an ItemsProvider");

    return context;
}