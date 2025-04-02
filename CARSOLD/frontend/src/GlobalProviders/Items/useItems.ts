import React, {createContext, useContext} from "react";

interface ItemsContextType {
    messages: number,
    setMessages: React.Dispatch<React.SetStateAction<number>>,
    profilePicChange: boolean;
    setProfilePicChange: React.Dispatch<React.SetStateAction<boolean>>;
    phrase: string;
    setPhrase: React.Dispatch<React.SetStateAction<string>>;
    trigger: boolean;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
    clicked: boolean;
    setClicked: React.Dispatch<React.SetStateAction<boolean>>;
    searched: boolean;
    setSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export const useItems = (): ItemsContextType => {

    const context = useContext(ItemsContext);

    if (context === undefined) throw new Error("useItems must be used within an ItemsProvider");

    return context;
}