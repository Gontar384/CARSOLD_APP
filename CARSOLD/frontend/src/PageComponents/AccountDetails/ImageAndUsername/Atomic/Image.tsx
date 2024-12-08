import React, {useEffect, useRef, useState} from "react";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useUtil} from "../../../../GlobalProviders/UtilProvider.tsx";

const Image: React.FC = () => {

    const {isMobile} = useUtil();

    const [buttonActive, setButtonActive] = useState<boolean>(false);
    const [buttonHovered, setButtonHovered] = useState<boolean>(false);
    const {createDebouncedValue} = useUtil();
    const debouncedHover: boolean = createDebouncedValue(buttonHovered, 300)
    const [buttonAnimation, setButtonAnimation] = useState<"animate-shock" | null>(null);
    const [animationActive, setAnimationActive] = useState<boolean>(false);
    const [buttonClickable, setButtonClickable] = useState<boolean>(false);
    const componentRef = useRef<HTMLDivElement | null>(null);  //checks if clicked outside search bar

    const handleActivateButton = () => {
        setButtonActive(true);
        setButtonHovered(true);
        if (!animationActive) {
            setButtonAnimation("animate-shock");
            setAnimationActive(true);
            setButtonClickable(true);
        }
    }   //activates on mouse

    const handleDeactivateButton = () => {
        setButtonHovered(false);
        setButtonAnimation(null);
        setButtonClickable(false);
    }   //deactivates on mouse

    useEffect(() => {
        if (!debouncedHover && !buttonHovered) {
            setButtonActive(false);
            setAnimationActive(false);
        }
    }, [debouncedHover, buttonHovered]);   //delays deactivation

    const handleToggleButton = () => {
        setButtonActive(true);
        setButtonAnimation("animate-shock");   //activates on touch
    }

    const handleClickable = () => {
        setTimeout(() => {
            setButtonClickable(true);
        }, 100)
    }    //makes "clickable" delayed

    useEffect(() => {
        const handleClickOutside = (event: TouchEvent | MouseEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setButtonActive(false);
                setButtonAnimation(null);
                setButtonClickable(false);
            }
        };

        if (buttonActive) {
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [buttonActive]);  //adds event listener to deactivate button

    const handleButtonClick = () => {
        if (buttonClickable) {
            console.log("test")
        }
    }

    return (
        <div className={'absolute left-0 w-14 h-14 xs:w-16 xs:h-16 lg:w-[72px] lg:h-[72px] xl:w-[80px]' +
            ' xl:h-[80px] 2xl:w-[92px] 2xl:h-[92px] 3xl:w-[108px] 3xl:h-[108px] rounded-full overflow-hidden' +
            ` ${buttonActive ? "border-2 border-black" : ""}`} ref={componentRef}
             onMouseEnter={!isMobile ? handleActivateButton : undefined}
             onMouseLeave={!isMobile ? handleDeactivateButton : undefined}
             onTouchStart={isMobile ? handleToggleButton : undefined}
             onTouchEnd={isMobile ? handleClickable : undefined}
             style={{clipPath: 'circle(50%)'}}>
            <div className="relative w-full h-full">
                <img src="/kylo.jpg" alt="kylo" className="object-cover absolute inset-0 z-10"/>
                ${buttonActive && (
                <button className={`absolute inset-0 z-20 bg-lowLime rounded-full`}
                        onClick={handleButtonClick}>
                    <FontAwesomeIcon icon={faPlus}
                                     className={'text-[26px] xs:text-[30px] lg:text-[36px] xl:text-[40px]' +
                                         ` 2xl:text-[46px] 3xl:text-[52px] ${buttonAnimation}`}/>
                </button>)}
            </div>
        </div>
    )
}

export default Image