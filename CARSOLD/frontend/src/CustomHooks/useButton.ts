import {useState} from "react";


//highlights/changes color of buttons
export const useButton = () => {

    const [buttonColor, setButtonsColor] = useState<boolean[]>([
        false, false, false, false, false, false
    ]);  //changes lower bar buttons colors

    const handleStart = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? true : color)));
    };    //changes color

    const handleEnd = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? false : color)));
    };

    return { buttonColor, handleStart, handleEnd }
}