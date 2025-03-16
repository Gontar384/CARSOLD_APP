import React, {useState} from "react";

interface SubmitButtonProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({label, onClick, disabled}) => {

    const [isClicked, setIsClicked] = useState<boolean>(false);
    const [debounce, setDebounce] = useState<boolean>(false);
    const [wavePosition, setWavePosition] = useState<{ x: number; y: number } | null>(null);

    //handles wave effect
    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>) => {
        if (debounce) return;

        const button = event.currentTarget;
        const rect = button.getBoundingClientRect();

        let x, y;
        const scaleFactor = rect.width / button.offsetWidth;

        if ("touches" in event) {
            const touch = event.touches[0];
            x = (touch.clientX - rect.left) / scaleFactor - 40;
            y = (touch.clientY - rect.top) / scaleFactor - 40;
        } else {
            x = (event.clientX - rect.left) / scaleFactor - 40;
            y = (event.clientY - rect.top) / scaleFactor - 40;
        }

        setWavePosition({ x, y });

        setDebounce(true);
        setIsClicked(true);
        onClick();
        setTimeout(() => {
            setDebounce(false);
            setIsClicked(false);
        }, 600);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (debounce) return;

        if (event.key === "Enter") {
            const button = event.currentTarget;
            const x = button.offsetWidth / 2 - 40;
            const y = button.offsetHeight / 2 - 40;

            setWavePosition({ x, y });
            setDebounce(true);
            setIsClicked(true);
            onClick();
            setTimeout(() => {
                setDebounce(false);
                setIsClicked(false);
            }, 600);
        }
    };

    return (
        <button
            className={`relative flex justify-center items-center w-24 m:w-28 h-9 m:h-10 text-lg m:text-xl
            rounded-sm shadow-xl overflow-hidden m:mt-1`}
            onClick={handleClick} onTouchStart={handleClick} onKeyDown={handleKeyDown} disabled={disabled}>
            <span className="z-10">{label}</span>
            {isClicked && wavePosition &&
                <div className={`absolute w-20 h-20 bg-black opacity-0 rounded-full animate-wave`}
                     style={{
                         top: wavePosition.y,
                         left: wavePosition.x
                     }}>
                </div>
            }
        </button>
    )
}

export default SubmitButton