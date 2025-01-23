import React, {useState} from "react";
import Image from "./Atomic/Image.tsx";
import Username from "./Atomic/Username.tsx";
import Message from "./Atomic/Message.tsx";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";

const ImageAndUsername: React.FC = () => {

    const [message, setMessage] = useState<string>('');
    const {bigWidth} = useUtil();

    return (
        <div className={`flex items-center w-11/12 ${bigWidth ? "max-w-[700px]" : "max-w-[550px]"} 
        min-h-[70px] m:min-h-[80px] relative bg-lowLime rounded-l-full`}>
            <Image setMessage={setMessage}/>
            <Username/>
            {message !== "" && (
                <Message message={message} setMessage={setMessage}/>
            )}
        </div>
    )
}

export default ImageAndUsername