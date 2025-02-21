import React, {useEffect, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {carModels} from "./Atomic/SelectInput/SelectData/carModels.ts";
import {carBrands} from "./Atomic/SelectInput/SelectData/carBrands.ts";
import {carBodyTypes} from "./Atomic/SelectInput/SelectData/carBodyTypes.ts";
import {carYears} from "./Atomic/SelectInput/SelectData/carYears.ts";
import {carFuels} from "./Atomic/SelectInput/SelectData/carFuels.ts";
import {carDrives} from "./Atomic/SelectInput/SelectData/carDrives.ts";
import {carColors} from "./Atomic/SelectInput/SelectData/carColors.ts";
import {carCountries} from "./Atomic/SelectInput/SelectData/carCountries.ts";
import BasicInput from "./Atomic/BasicInput/BasicInput.tsx";
import ImageInput from "./Atomic/ImageInput/ImageInput.tsx";
import SelectInput from "./Atomic/SelectInput/SelectInput.tsx";
import ChooseInput from "./Atomic/ChooseInput/ChooseInput.tsx";
import {carSeats} from "./Atomic/SelectInput/SelectData/carSeats.ts";
import {carDoors} from "./Atomic/SelectInput/SelectData/carDoors.ts";
import DescriptionInput from "./Atomic/DescriptionInput/DescriptionInput.tsx";
import ContactDetails from "./Atomic/ContactDetails/ContactDetails.tsx";
import SubmitOfferButton from "./Atomic/Button/SubmitOfferButton.tsx";

const OfferForm: React.FC = () => {
    document.title = "CARSOLD | Listing Offer";

    interface Offer {
        title: string;
        brand: string;
        model: string;
        bodyType: string;
        year: string;
        mileage: string;
        fuel: string;
        capacity: number;
        power: number;
        drive: string;
        transmission: string;
        seats: string | null;
        doors: number | null;
        steeringWheel: string | null;
        condition: string;
        color: string;
        country: string | null;
        vin: string | null;
        plate: string | null;
        firstRegistration: string | null;
        description: string;
        photos: (string)[] | null;
        price: string;
    }

    const [offer, setOffer] = useState({
        title: "",
        brand: "",
        model: "",
        bodyType: "",
        year: "",
        mileage: "",
        fuel: "",
        capacity: "",
        power: "",
        drive: "",
        transmission: "",
        seats: "",
        doors: "",
        steeringWheel: "",
        condition: "",
        color: "",
        country: "",
        vin: "",
        plate: "",
        firstRegistration: "",
        description: "",
        photos: Array(8).fill(""),
        price: "",
        currency: "PLN",
    });

    const [error, setError] = useState({
        title: false,
        brand: false,
        model: false,
        bodyType: false,
        year: false,
        mileage: false,
        fuel: false,
        capacity: false,
        power: false,
        drive: false,
        transmission: false,
        seats: false,
        doors: false,
        steeringWheel: false,
        condition: false,
        color: false,
        country: false,
        vin: false,
        plate: false,
        firstRegistration: false,
        description: false,
        price: false
    });

    const handleSetOffer = (key: keyof typeof offer) =>
        (setValue: React.SetStateAction<string> | React.SetStateAction<string[]>) => {
            setOffer(prev => ({
                ...prev,
                [key]: setValue
            }));
        };

    const handleSetError = (key: keyof typeof error) =>
        (setValue: React.SetStateAction<boolean>) => {
            setError(prev => ({ ...prev, [key]: setValue }));
        };

    useEffect(() => {
        setOffer(prev => ({...prev, model: ""}));
    }, [offer.brand]);

    const handleClick = () => {
        console.log("test")
    };

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className={`flex flex-col items-center w-11/12 lg:w-10/12 max-w-[840px] lg:max-w-[1300px]
                 bg-lowLime border border-black border-opacity-10 rounded-sm`}>
                    <p className="text-3xl m:text-4xl mt-14 m:mt-16 mb-8 m:mb-10 text-center">Listing Offer</p>
                    <div className="flex justify-center w-[90%] mb-20 m:mb-24 bg-white rounded-md border-2 border-gray-300">
                        <p className="w-full text-lg m:text-xl p-4 m:p-6">
                            We need some information about your car to interest possible customers!
                            You must fill fields marked with <FontAwesomeIcon className="text-base m:text-lg" icon={faAsterisk}/>,
                            but try to provide as many details as you can. Good luck!
                        </p>
                    </div>
                    <div className="flex flex-col items-center w-full max-w-[800px] m:ml-6">
                        <div className="flex justify-center m:block w-full mb-14 m:mb-16">
                            <BasicInput label="Title" type="text" value={offer.title} setValue={handleSetOffer("title")}
                                        required={true}
                                        error={error.title} setError={handleSetError("title")}
                                        message="At least 10 characters." maxLength={40}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label="Brand" options={carBrands} value={offer.brand}
                                         setValue={handleSetOffer("brand")} required={true}
                                         error={error.brand} setError={handleSetError("brand")}
                                         message="Choose car's brand."/>
                            <SelectInput label="Model" options={carModels[offer.brand] ?? []} value={offer.model}
                                         setValue={handleSetOffer("model")} required={offer.brand !== "Other"}
                                         disabled={!carBrands.includes(offer.brand) || offer.brand === "Other"}
                                         error={error.model} setError={handleSetError("model")}
                                         message={"Choose car's model."}/>
                            <SelectInput label="Body type" options={carBodyTypes} value={offer.bodyType}
                                         setValue={handleSetOffer("bodyType")} required={true}
                                         error={error.bodyType} setError={handleSetError("bodyType")}
                                         message="Choose car's body type."/>
                            <SelectInput label="Year of production" options={carYears} value={offer.year}
                                         setValue={handleSetOffer("year")} required={true}
                                         error={error.year} setError={handleSetError("year")}
                                         message="Choose year of production."/>
                            <BasicInput label="Mileage" type="number" value={offer.mileage}
                                        setValue={handleSetOffer("mileage")} required={true}
                                        error={error.mileage} setError={handleSetError("mileage")}
                                        message="Provide car's mileage in km." symbol="km"/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label="Fuel" options={carFuels} value={offer.fuel}
                                         setValue={handleSetOffer("fuel")} required={true}
                                         error={error.fuel} setError={handleSetError("fuel")}
                                         message="Choose fuel type."/>
                            <BasicInput label="Capacity" type="number" value={offer.capacity}
                                        setValue={handleSetOffer("capacity")} required={true}
                                        error={error.capacity} setError={handleSetError("capacity")}
                                        message="Provide engine capacity in cm3." symbol="cm3"/>
                            <BasicInput label="Power" type="number" value={offer.power}
                                        setValue={handleSetOffer("power")} required={true}
                                        error={error.power} setError={handleSetError("power")}
                                        message="Provide engine power in HP." symbol="HP"/>
                            <SelectInput label="Drive" options={carDrives} value={offer.drive}
                                         setValue={handleSetOffer("drive")} required={true}
                                         error={error.drive} setError={handleSetError("drive")}
                                         message="Choose car's drive."/>
                            <ChooseInput label="Transmission" firstOption="Manual" secondOption="Automatic"
                                         value={offer.transmission} setValue={handleSetOffer("transmission")}
                                         required={true} error={error.transmission}
                                         setError={handleSetError("transmission")}
                                         message="Choose car's transmission."/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label="Seats" options={carSeats} value={offer.seats}
                                         setValue={handleSetOffer("seats")}
                                         error={error.seats} setError={handleSetError("seats")}
                                         message="Choose number of seats."/>
                            <SelectInput label="Doors" options={carDoors} value={offer.doors}
                                         setValue={handleSetOffer("doors")}
                                         error={error.doors} setError={handleSetError("doors")}
                                         message="Choose number of doors."/>
                            <ChooseInput label="Steering wheel" firstOption="Left" secondOption="Right"
                                         value={offer.steeringWheel} setValue={handleSetOffer("steeringWheel")}
                                         error={error.steeringWheel} setError={handleSetError("steeringWheel")}
                                         message="Choose steering wheel side."/>
                            <ChooseInput label="Condition" firstOption="Undamaged" secondOption="Damaged"
                                         value={offer.condition} setValue={handleSetOffer("condition")}
                                         error={error.condition} setError={handleSetError("condition")} required={true}
                                         message="Choose car's condition."/>
                            <SelectInput label="Color" options={carColors} value={offer.color}
                                         setValue={handleSetOffer("color")}
                                         error={error.color} setError={handleSetError("color")} required={true}
                                         message="Choose car's color."/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-10 m:mb-12">
                            <SelectInput label="Country" options={carCountries} value={offer.country}
                                         setValue={handleSetOffer("country")}
                                         error={error.country} setError={handleSetError("country")}
                                         message="Choose country of car's origin."/>
                            <BasicInput label="VIN" type="text" value={offer.vin} setValue={handleSetOffer("vin")}
                                        error={error.vin} setError={handleSetError("vin")}
                                        message="Provide car's VIN."/>
                            <BasicInput label="License plate" type="text" value={offer.plate}
                                        setValue={handleSetOffer("plate")} error={error.plate}
                                        setError={handleSetError("plate")}
                                        message="Provide license plate's number."/>
                            <BasicInput label="First registration" type="date" value={offer.firstRegistration}
                                        setValue={handleSetOffer("firstRegistration")}
                                        error={error.firstRegistration} setError={handleSetError("firstRegistration")}
                                        message="Provide date of first registration."/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-12 m:mb-14">
                            <DescriptionInput value={offer.description} setValue={handleSetOffer("description")}
                                              error={error.description} setError={handleSetError("description")}/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-8 m:mb-10">
                            <ImageInput photos={offer.photos} setPhotos={handleSetOffer("photos")}/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-20 m:mb-24">
                            <BasicInput label="Price" type="number" value={offer.price}
                                        setValue={handleSetOffer("price")} error={error.price}
                                        setError={handleSetError("price")}
                                        symbol={offer.currency} firstOtherSymbol="PLN" secondOtherSymbol="EURO"
                                        setSymbol={handleSetOffer("currency")} required={true}
                                        message="Enter price of your offer."/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-24 m:mb-28">
                            <ContactDetails/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-20 m:mb-24">
                            <SubmitOfferButton onClick={handleClick} disabled={false}/>
                        </div>
                    </div>
                </div>
            </div>
        </LayOut>
);
}

export default OfferForm