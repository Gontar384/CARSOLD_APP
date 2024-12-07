import {useState} from "react";


//highlights/changes color of buttons
export const useButton = () => {

    const [buttonColor, setButtonsColor] = useState<("black" | "white")[]>([
        "black", "black", "black", "black", "black", "black"
    ]);  //changes lower bar buttons colors

    const [touchActive, setTouchActive] = useState<boolean>(false);   //helps not to mix mouse/touch events

    const handleTouchStart = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "white" : color)));
        setTouchActive(true);
    };    //changes color

    const handleTouchEnd = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "black" : color)));
    };

    const handleMouseEnter = (index: number) => {
        if (!touchActive) {
            setButtonsColor((prev) =>
                prev.map((color, i) => (i === index ? "white" : color)));
        }
    };

    const handleMouseLeave = (index: number) => {
        setButtonsColor((prev) =>
            prev.map((color, i) => (i === index ? "black" : color)));
        setTouchActive(false);
    };


    return { buttonColor, handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave }
}