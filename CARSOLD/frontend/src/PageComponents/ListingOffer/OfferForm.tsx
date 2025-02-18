import React, {useEffect, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
// import TitleInput from "./Atomic/TitleInput/TitleInput.tsx";
import SelectInput from "./Atomic/SelectInput/SelectInput.tsx";
// import ChooseInput from "./Atomic/ChooseInput/ChooseInput.tsx";
// import DescriptionInput from "./Atomic/DescriptionInput/DescriptionInput.tsx";
// import ImageInput from "./Atomic/ImageInput/ImageInput.tsx";
import {carBrands, carModels} from "./Atomic/SelectInput/CarBrands/carBrands.ts";

const OfferForm: React.FC = () => {
    document.title = "CARSOLD | Listing Offer";
    // const [title, setTitle] = useState<string>("");
    // const [wrongTitle, setWrongTitle] = useState<boolean>(false);
    //
    // const [techCondition, setTechCondition] = useState<boolean | null>(null);
    // const [wrongTechCondition, setWrongTechCondition] = useState<boolean>(false);
    // const [description, setDescription] = useState<string>("");
    // const [wrongDescription, setWrongDescription] = useState<boolean>(false);
    // const [photos, setPhotos] = useState<(string | null)[]>(Array(8).fill(null));
    // const [wrongPhotos, setWrongPhotos] = useState<boolean>(false);

    const [brand, setBrand] = useState<string | null>(null);
    const [model, setModel] = useState<string | null>(null);
    const [wrongBrand, setWrongBrand] = useState<boolean>(false);
    const [wrongModel, setWrongModel] = useState<boolean>(false);

    useEffect(() => {
        setModel(null);
        console.log("test");
    }, [brand]);

    console.log("brand: ", brand);
    console.log("model: ", model);

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className={`flex flex-col items-center w-11/12 lg:w-10/12 max-w-[840px] lg:max-w-[1300px]
                 bg-lowLime border border-black border-opacity-10 rounded-sm`}>
                    <p className="text-3xl m:text-4xl my-14 m:my-16 text-center">Listing Offer</p>
                    {/*<TitleInput label={"Title"} value={title} setValue={setTitle} required={true} isRight={rightTitle}*/}
                    {/*            isWrong={wrongTitle} setIsWrong={setWrongTitle} maxLength={40}/>*/}
                    {/*<br/>*/}
                    <SelectInput label="Brand" options={carBrands} value={brand} setValue={setBrand} active={true}
                                 required={true} isWrong={wrongBrand} setIsWrong={setWrongBrand}/>
                    <br/>
                    <SelectInput label="Model" options={carModels[brand ?? ""] || []} value={model} setValue={setModel} active={!!brand}
                                 required={true} isWrong={wrongModel} setIsWrong={setWrongModel}/>
                    <br/>
                    {/*<br/>*/}
                    {/*<ChooseInput label="Technical condition" firstOption="Undamaged" secondOption="Damaged"*/}
                    {/*             value={techCondition} setValue={setTechCondition} required={true}*/}
                    {/*             isWrong={wrongTechCondition} setIsWrong={setWrongTechCondition}/>*/}
                    {/*<br/>*/}
                    {/*<DescriptionInput label="Description" value={description} setValue={setDescription} isWrong={wrongDescription}*/}
                    {/*                  setIsWrong={setWrongDescription} maxLength={2000}/>*/}
                    {/*<br/>*/}
                    {/*<ImageInput photos={photos} setPhotos={setPhotos} isWrong={wrongPhotos} setIsWrong={setWrongPhotos}/>*/}
                </div>
            </div>
        </LayOut>
    )
}

export default OfferForm