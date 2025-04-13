import React, {useState} from "react";
import {SearchContext} from "./useSearch.ts"

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [phrase, setPhrase] = useState<string>("");
    const [trigger, setTrigger] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    const [searched, setSearched] = useState<boolean>(false);

    return <SearchContext.Provider value={{phrase, setPhrase, trigger, setTrigger, clicked, setClicked, searched, setSearched}}>
        {children}
    </SearchContext.Provider>
}