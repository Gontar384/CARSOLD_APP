import {useState} from "react";


//highlights/changes color of buttons
export const useButton = () => {

    const [buttonColor, setButtonsColor] = useState<("black" | "white")[]>([
        "black", "black", "black", "black", "black", "black"
    ]);  //changes lower bar buttons colors

    const handleStart = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "white" : color)));
    };    //changes color

    const handleEnd = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "black" : color)));
    };

    return { buttonColor, handleStart, handleEnd }
}