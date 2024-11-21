import React, {createContext, useContext, useEffect, useState} from "react";

//defines structure of DarkModeContext
interface DarkModeContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

//creates DarkMode context
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

//creates provider-component which is then used in 'App' and wraps other components
export const DarkModeProvider: React.FC<{children : React.ReactNode}> = ({ children }) => {
    //initializes dark mode state based on localStorage value
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    //toggles dark mode and stores it on localStorage
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            //changes background color based on the new mode
            if (newMode) {
                document.body.style.transition = 'background-color 0.7s ease-in-out'; //enables transition
                document.body.style.backgroundColor = '#191a18'; //dark
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.style.transition = 'background-color 0.7s ease-in-out'; //enables transition
                document.body.style.backgroundColor = 'white'; //light
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };

    //checks localStorage for mode on initial
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent)=> {
            if (event.key === 'theme'){
                const newMode: string | null = event.newValue;
                if (newMode === 'dark') {
                    setDarkMode(true);
                    document.body.style.backgroundColor = '#191a18'; //dark
                } else {
                    setDarkMode(false);
                    document.body.style.backgroundColor = 'white'; //light
                }
            }
        }

        //initializes background color on initial load
        if (darkMode) {
            document.body.style.backgroundColor = '#191a18'; // dark
        } else {
            document.body.style.backgroundColor = 'white'; // light
        }

        //monitors localstorage change
        window.addEventListener('storage', handleStorageChange);

        //cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    //makes values accessible for all DarkModeProvider children
    return (
        <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};

//custom hook to access the dark mode context
export const useDarkMode = (): DarkModeContextType => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};