import React, {createContext, useContext} from "react";

interface SearchContextType {
    phrase: string;
    setPhrase: React.Dispatch<React.SetStateAction<string>>;
    trigger: boolean;
    setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
    clicked: boolean;
    setClicked: React.Dispatch<React.SetStateAction<boolean>>;
    searched: boolean;
    setSearched: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = (): SearchContextType => {

    const context = useContext(SearchContext);

    if (context === undefined) throw new Error("useSearch must be used within an SearchProvider");

    return context;
}