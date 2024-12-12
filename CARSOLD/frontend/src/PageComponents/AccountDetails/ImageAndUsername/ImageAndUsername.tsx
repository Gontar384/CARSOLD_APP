import React, {useState} from "react";
import Image from "./Atomic/Image.tsx";
import Username from "./Atomic/Username.tsx";

const ImageAndUsername: React.FC = () => {

    const [message, setMessage] = useState<string>('');

    return (
        <div className="flex items-center w-7/12 h-14 xs:h-16 lg:h-[72px] xl:h-[80px] 2xl:h-[92px]
        3xl:h-[108px] min-w-[250px] sm:max-w-[445px] lg:max-w-[600px] xl:max-w-[700px] 2xl:max-w-[850px]
        3xl:max-w-[920px] relative bg-lowLime rounded-l-full">
            <Image setMessage={setMessage}/>
            <Username/>
            {/* Message Overlay */}
            {message !== "" && (
                <div className="fixed flex items-center justify-center inset-0 bg-black bg-opacity-50 z-50">
                    <div className="p-3 xs:p-4 2xl:p-5 3xl:p-6 bg-white text-center text-sm sm:text-base 2xl:text-lg 3xl:text-xl rounded-sm shadow-lg">
                        <p>{message}</p>
                        <button onClick={() => setMessage("")} className="border border-black mt-3 2xl:mt-4 3xl:mt-5
                        px-[10px] sm:px-3 2xl:px-4 3xl:px-[20px] xl:py-[1px] 2xl:py-[2px] 3xl:py-[3px] rounded-sm bg-black text-white">
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ImageAndUsername