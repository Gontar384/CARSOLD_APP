import React from "react";

interface RegisterAndSearchLoadingProps {
    usage: "register" | "search"
}

const RegisterAndSearchLoading: React.FC<RegisterAndSearchLoadingProps> = ({ usage }) => {
    return (
        <div className={`flex flex-row justify-center items-center gap-1.5 m:gap-2 absolute inset-0 w-full h-full
        ${usage === "register" ? "rounded-sm" : "rounded-b-[10px]"} bg-black bg-opacity-20 z-20`}>
            <span className="w-4 h-4 m:w-5 m:h-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-4 h-4 m:w-5 m:h-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-4 h-4 m:w-5 m:h-5 bg-white rounded-full animate-bounce"></span>
        </div>
    );
};

export default RegisterAndSearchLoading