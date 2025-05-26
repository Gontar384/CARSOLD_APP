import React from "react";

const RegisterLoading: React.FC = () => {
    return (
        <div className="flex flex-row justify-center items-center gap-1.5 m:gap-2 absolute inset-0 w-full h-full
        rounded-sm bg-black bg-opacity-20 z-10">
            <span className="w-4 h-4 m:w-5 m:h-5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-4 h-4 m:w-5 m:h-5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-4 h-4 m:w-5 m:h-5 bg-white rounded-full animate-bounce"></span>
        </div>
    );
};

export default RegisterLoading