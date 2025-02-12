import React from "react";

interface SuggestionsBarProps {
    citySuggestions: string[] | null;
    setCitySuggestions: React.Dispatch<React.SetStateAction<string[] | null>>;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    setClickedSuggestion: React.Dispatch<React.SetStateAction<string | null>>;
}

const SuggestionsBar: React.FC<SuggestionsBarProps> = ({citySuggestions, setCitySuggestions, setValue, setClickedSuggestion}) => {

    const handleClickSuggestion = (index: number) => {
        if (citySuggestions) {
            setValue(citySuggestions[index]);
            setCitySuggestions(null);
            setClickedSuggestion(citySuggestions[index]);
        }
    }

    return (
        <div>
            {citySuggestions && citySuggestions.slice(0, 5).map((citySuggestion: string, index: number ) => (
                <button key={index} className="w-full px-[3px] lg:px-[4px] xl:px-[5px] 2xl:px-[6px] 3xl:px-[7px]
                text-left bg-white border-y border-gray-300 whitespace-nowrap overflow-hidden"
                        title={citySuggestions[index]} onClick={() => handleClickSuggestion(index)}>
                    {citySuggestion}
                </button>
            ))}
        </div>
    )
}

export default SuggestionsBar