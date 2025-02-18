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

const OfferForm: React.FC = () => {
    document.title = "CARSOLD | Listing Offer";

    interface Offer {
        title: string;
        brand: string;
        model: string;
        bodyType: string;
        year: number;
        mileage: number;
        fuel: string;
        capacity: number;
        power: number;
        drive: string;
        transmission: string;
        doors: number | null;
        steeringWheel: string | null;
        condition: string;
        color: string;
        country: string | null;
        vin: string | null;
        plate: string | null;
        firstRegistration: string | null;
        description: string;
        images: (string | null)[];
        price: string;
    }

    const [title, setTitle] = useState<string | null>(null);
    const [brand, setBrand] = useState<typeof carBrands | null>(null)
    const [model, setModel] = useState<typeof carModels | null>(null);
    const [bodyType, setBodyType] = useState<typeof carBodyTypes | null>(null);
    const [year, setYear] = useState<typeof carYears | null>(null);
    const [mileage, setMileage] = useState<number | null>(null);
    const [fuel, setFuel] = useState<typeof carFuels | null>(null);
    const [capacity, setCapacity] = useState<number | null>(null);
    const [power, setPower] = useState<number | null>(null);
    const [drive, setDrive] = useState<typeof carDrives | null>(null);
    const [transmission, setTransmission] = useState<"Manual" | "Automatic" | null>(null);
    const [doors, setDoors] = useState<"2" | "3" | "4" | "5" | "6" | null>(null);
    const [steeringWheel, setSteeringWheel] = useState<"Left" | "Right" | null>(null);
    const [condition, setCondition] = useState<"Damaged" | "Undamaged" | null>(null);
    const [color, setColor] = useState<typeof carColors | null>(null);
    const [country, setCountry] = useState<typeof carCountries | null>(null);
    const [vin, setVin] = useState<string | null>(null);
    const [plate, setPlate] = useState<string | null>(null);
    const [firstRegistration, setFirstRegistration] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [images, setImages] = useState<(string | null)[]>(Array(8).fill(null));
    const [price, setPrice] = useState<number | null>(null);
    const [error, setError] = useState({
        title: false, brand: false, model: false, bodyType: false, year: false, mileage: false,
        fuel: false, capacity: false, power: false, drive: false, transmission: false,
        doors: false, steeringWheel: false, condition: false, color: false, country: false,
        vin: false, plate: false, firstRegistration: false, description: false, price: false,
    });


    useEffect(() => {
        setModel(null);
    }, [brand]);

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className={`flex flex-col items-center w-11/12 lg:w-10/12 max-w-[840px] lg:max-w-[1300px]
                 bg-lowLime border border-black border-opacity-10 rounded-sm`}>
                    <p className="text-3xl m:text-4xl mt-14 m:mt-16 mb-8 m:mb-10 text-center">Listing Offer</p>
                    <div className="flex justify-center w-full bg-white border-y-2 border-gray-300 shadow mb-20 m:mb-24">
                        <p className="w-[95%] text-lg m:text-xl">
                            We need some information about your car to interest possible customers!
                            You must fill fields marked with <FontAwesomeIcon className="text-base m:text-lg" icon={faAsterisk}/>,
                            but try to provide as much details as you can. Good luck!
                        </p>
                    </div>
                </div>
            </div>
        </LayOut>
    )
}

export default OfferForm