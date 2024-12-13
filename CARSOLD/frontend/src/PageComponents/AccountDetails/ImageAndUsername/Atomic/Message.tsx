import React from "react";

interface MessageProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Message: React.FC<MessageProps> = ({message, setMessage}) => {
    return (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50">
            <div
                className="p-3 xs:p-4 2xl:p-5 3xl:p-6 bg-white text-center text-sm sm:text-base 2xl:text-lg 3xl:text-xl rounded-sm shadow-lg">
                <p>{message}</p>
                <button onClick={() => setMessage("")} className="border border-black mt-3 2xl:mt-4 3xl:mt-5
                        px-[10px] sm:px-3 2xl:px-4 3xl:px-[20px] xl:py-[1px] 2xl:py-[2px] 3xl:py-[3px] rounded-sm bg-black text-white">
                    OK
                </button>
            </div>
        </div>
    )
}

export default Message