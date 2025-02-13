import React, {useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import TitleInput from "./Atomic/TitleInput/TitleInput.tsx";
import SelectInput from "./Atomic/SelectInput/SelectInput.tsx";
import ChooseInput from "./Atomic/ChooseButton/ChooseInput.tsx";

const OfferForm: React.FC = () => {
    document.title = "CARSOLD | Listing Offer";
    const [title, setTitle] = useState<string>("");
    const [rightTitle, setRightTitle] = useState<boolean>(false);
    const [wrongTitle, setWrongTitle] = useState<boolean>(false);
    const [brand, setBrand] = useState<string>("");
    const [rightBrand, setRightBrand] = useState<boolean>(false);
    const [wrongBrand, setWrongBrand] = useState<boolean>(false);
    const [techCondition, setTechCondition] = useState<boolean | null>(null);
    const [wrongTechCondition, setWrongTechCondition] = useState<boolean>(false);

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className={`flex flex-col items-center w-11/12 lg:w-10/12 max-w-[840px] lg:max-w-[1300px] h-[1000px]
                 bg-lowLime border border-black border-opacity-10 rounded-sm`}>
                    <p className="text-3xl m:text-4xl my-14 m:my-16 text-center">Listing Offer</p>
                    <TitleInput label={"Title"} value={title} setValue={setTitle} required={true} isRight={rightTitle}
                                isWrong={wrongTitle} setIsWrong={setWrongTitle} maxLength={40}/>
                    <br/>
                    <SelectInput label="Brand" setValue={setBrand} required={true} isRight={rightBrand} isWrong={wrongBrand} setIsWrong={setWrongBrand}
                                 options={[
                                     { value: "Volkswagen", label: "Volkswagen" },
                                     { value: "Audi", label: "Audi" },
                                     { value: "Mercedes", label: "Mercedes" },
                                     { value: "BMW", label: "BMW"},
                                     { value: "Porsche", label: "Porsche"},
                                     { value: "Cupra", label: "Cupra"}
                                 ]}/>
                    <br/>
                    <ChooseInput label="Technical condition" firstOption="Undamaged" secondOption="Damaged"
                                 value={techCondition} setValue={setTechCondition} required={true}
                                 isWrong={wrongTechCondition} setIsWrong={setWrongTechCondition}/>
                </div>
            </div>
        </LayOut>
    )
}

export default OfferForm