import React, {useEffect, useState} from "react";
import {SearchContext} from "./useSearch.ts"
import {useLocation, useSearchParams} from "react-router-dom";

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [phrase, setPhrase] = useState<string>("");
    const [trigger, setTrigger] = useState<boolean>(false);
    const [clicked, setClicked] = useState<boolean>(false);
    const [searched, setSearched] = useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const location = useLocation();

    useEffect(() => {
        if (!location.pathname.includes("/search")) {
            setPhrase("");
            setTimeout(() => setClicked(false), 0);
        }
    }, [location]);

    useEffect(() => {
        setPhrase(searchParams.get("phrase") || "");
        setSearched(true);
    }, []);

    return <SearchContext.Provider value={{phrase, setPhrase, trigger, setTrigger, clicked, setClicked, searched, setSearched}}>
        {children}
    </SearchContext.Provider>
}