import React from "react";

interface MessageProps {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Message: React.FC<MessageProps> = ({message, setMessage}) => {

    return (
        <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50">
            <div className="min-w-[300px] p-5 m:p-6 text-lg m:text-xl bg-white text-center rounded-sm shadow-lg">
                <p>{message}</p>
                <button onClick={() => setMessage("")} className="border border-black mt-3 m:mt-4
                        px-3 m:px-4 m:py-[2px] rounded-sm bg-black text-white">
                    OK
                </button>
            </div>
        </div>
    )
}

export default Message