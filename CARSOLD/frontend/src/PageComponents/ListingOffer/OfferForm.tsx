import React, {useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import TitleInput from "./Atomic/TitleInput.tsx";

const OfferForm: React.FC = () => {
    document.title = "CARSOLD | Listing Offer";

    const [title, setTitle] = useState<string>("asdasdsa");

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className={`flex flex-col items-center w-11/12 lg:w-10/12 max-w-[840px] lg:max-w-[1300px] h-[1000px]
                 bg-lowLime border border-black border-opacity-10 rounded-sm`}>
                    <p className="text-3xl m:text-4xl my-14 m:my-16 text-center">Listing Offer</p>
                    <TitleInput label={"Title"} value={title} onChange={setTitle} required={true} filled={true}/>
                </div>
            </div>
        </LayOut>
    )
}

export default OfferForm