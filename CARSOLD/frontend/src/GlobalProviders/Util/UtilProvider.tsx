import React, {useEffect, useState} from "react";
import { UtilContext } from "./useUtil";
import {useLocation} from "react-router-dom";

//manages dark mode, lower bar presence, window size, creates debounced values and recognize device: mobile/PC
export const UtilProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {

    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });
    const [lowerBar, setLowerBar] = useState<boolean>(false);
    const [midBar, setMidBar] = useState<boolean>(false);
    const [mobileWidth, setMobileWidth] = useState<boolean>(window.innerWidth < 450);
    const [midWidth, setMidWidth] = useState<boolean>(window.innerWidth >= 450 && window.innerWidth < 1024);
    const [bigWidth, setBigWidth] = useState<boolean>(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState<boolean>("ontouchstart" in window || navigator.maxTouchPoints > 0);
    const location = useLocation();

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.body.style.transition = 'background-color 0.5s ease-in-out';
                document.body.style.backgroundColor = '#191a18';
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.style.transition = 'background-color 0.5s ease-in-out';
                document.body.style.backgroundColor = 'white';
                localStorage.setItem('theme', 'light');
            }

            return newMode;
        });
    };  //manages dark mode on click

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'theme') {
                const newMode: string | null = event.newValue;
                if (newMode === 'dark') {
                    setDarkMode(true);
                    document.body.style.backgroundColor = '#191a18';
                } else {
                    setDarkMode(false);
                    document.body.style.backgroundColor = 'white';
                }
            }
        }
        if (darkMode) {
            document.body.style.backgroundColor = '#191a18';
        } else {
            document.body.style.backgroundColor = 'white';
        }
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [darkMode]);  //manages dark mode on initial load

    const disableDarkMode = () => {
        localStorage.setItem('theme', 'light');
        setDarkMode(false);
    }; //used in logout

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setMobileWidth(width < 450);
            setMidWidth(width >= 450 && width < 1024);
            setBigWidth(width >= 1024);
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []); //manages width states

    //function which can set debounced value for useEffects to avoid too much requests be sent
    const CreateDebouncedValue = <T, >(value: T, delay: number): T => {
        const [debouncedValue, setDebouncedValue] = useState<T>(value);

        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(handler);
        }, [value, delay]);

        return debouncedValue;
    }

    useEffect(() => {
        const detectDeviceType = () => {
            const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth <= 450;
            setIsMobile(isTouchDevice || isSmallScreen);
        };

        const handlePointerChange = (event: PointerEvent) => {
            if (event.pointerType === "touch") {
                setIsMobile(true);
            } else if (event.pointerType === "mouse") {
                setIsMobile(false);
            }
        };

        let lastWidth = window.innerWidth;

        const handleResize = () => {
            const newWidth = window.innerWidth;
            if ((lastWidth > 450 && newWidth <= 450) || (lastWidth <= 450 && newWidth > 450)) {
                detectDeviceType();
            }
            lastWidth = newWidth;
        };

        window.addEventListener("pointerdown", handlePointerChange);
        window.addEventListener("resize", handleResize);

        detectDeviceType();

        return () => {
            window.removeEventListener("pointerdown", handlePointerChange);
            window.removeEventListener("resize", handleResize);
        };
    }, []); //checks if user is on mobile / PC

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);  //make sure that user is scrolled top during navigation

    return (
        <UtilContext.Provider
            value={{darkMode, toggleDarkMode, disableDarkMode, lowerBar, setLowerBar, midBar, setMidBar, mobileWidth, midWidth, bigWidth, CreateDebouncedValue, isMobile}}>
            {children}
        </UtilContext.Provider>
    );
};