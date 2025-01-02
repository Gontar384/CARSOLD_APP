import {useState} from "react";


//changes color of button, highlights etc.
export const useButton = () => {

    const [buttonColor, setButtonsColor] = useState<boolean>(false);  //changes lower bar buttons colors

    const handleStart = () => {
        setButtonsColor(true);
    };

    const handleEnd = () => {
        setButtonsColor(false);
    };

    return { buttonColor, handleStart, handleEnd }
}