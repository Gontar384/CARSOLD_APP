import React, {useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

//highlights buttons
export const useButton = () => {

    const [buttonColor, setButtonsColor] = useState<("black" | "white")[]>([
        "black", "black", "black", "black", "black", "black", "black", "black", "black", "black"
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

interface ButtonProps {
    onClick: () => void;
    serial: number;
    icon: IconProp;
    label: string;
    count?: number;
}

const MobileButton: React.FC<ButtonProps> = ({serial, onClick, icon, label, count}) => {

    const { buttonColor, handleTouchStart, handleTouchEnd, handleMouseEnter, handleMouseLeave } = useButton();

    return (
        <button className="flex flex-col items-center w-1/6 h-full p-1 relative"
                onClick={onClick} onTouchStart={() => handleTouchStart(serial)} onTouchEnd={() => handleTouchEnd(serial)}
                onMouseEnter={() => handleMouseEnter(serial)} onMouseLeave={() => handleMouseLeave(serial)}>
            <FontAwesomeIcon icon={icon} style={{ color: buttonColor[serial] }} className="text-xl xs:text-[22px]"/>
            {count && count > 0 ? (
                <p className="text-[9px] xs:text-[10px] top-[7px] text-white absolute">
                    {count}
                </p>
            ) : null}
            <p className={`text-[9px] xs:text-[10px] ${label.length > 12 ? "ml-[6px]" : ""}`}>{label}</p>
        </button>
    )
}

export default MobileButton