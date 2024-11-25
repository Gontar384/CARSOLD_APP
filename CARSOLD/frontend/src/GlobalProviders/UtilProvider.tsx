import React, {createContext, useContext, useEffect, useState} from "react";

//provides util globally, e.g. dark mode and lowerBar, isWide states, which adapt display

//defines structure
interface UtilContextType {
    darkMode: boolean;
    toggleDarkMode: () => void;
    lowerBar: boolean,
    setLowerBar: React.Dispatch<React.SetStateAction<boolean>>,
    isWide: boolean,
}

//creates DarkMode context
const UtilContext = createContext<UtilContextType | undefined>(undefined);

//creates provider-component which is then used in 'App' and wraps other components
export const UtilProvider: React.FC<{children : React.ReactNode}> = ({ children }) => {
    //initializes dark mode state based on localStorage value
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const [lowerBar, setLowerBar] = useState<boolean>(false);
    const [isWide, setIsWide] = useState<boolean>(window.innerWidth >= 640);

    //checks window size, which defines if there will be margin bottom under the footer
    useEffect(() => {
        const handleResize = () => setIsWide(window.innerWidth >= 640);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize)

    }, [])

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

    //makes values accessible for all UtilProvider children
    return (
        <UtilContext.Provider value={{ darkMode, toggleDarkMode, lowerBar, setLowerBar, isWide }}>
            {children}
        </UtilContext.Provider>
    );
};

//custom hook to use context
export const useUtil = (): UtilContextType => {
    const context = useContext(UtilContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a UtilProvider');
    }
    return context;
};