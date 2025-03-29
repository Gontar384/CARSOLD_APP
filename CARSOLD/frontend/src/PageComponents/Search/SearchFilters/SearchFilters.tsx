import React, {useEffect, useState} from "react";
import SelectInput from "../../AddingOffer/Atomic/SelectInput/SelectInput.tsx";
import {carBrands} from "../../AddingOffer/Atomic/SelectInput/SelectData/carBrands.ts";
import {useSearchParams} from "react-router-dom";
import {carModels} from "../../AddingOffer/Atomic/SelectInput/SelectData/carModels.ts";
import {carBodyTypes} from "../../AddingOffer/Atomic/SelectInput/SelectData/carBodyTypes.ts";
import {carYears} from "../../AddingOffer/Atomic/SelectInput/SelectData/carYears.ts";
import {carMileage} from "./AdditionalData/carMileage.ts";
import {carFuels} from "../../AddingOffer/Atomic/SelectInput/SelectData/carFuels.ts";
import {carCapacity} from "./AdditionalData/carCapacity.ts";

const SearchFilters: React.FC = () => {
    interface Filter {
        brand: string;
        model: string;
        bodyType: string;
        minYear: string;
        maxYear: string;
        minMileage: string;
        maxMileage: string;
        fuel: string;
        minCapacity: string;
        maxCapacity: string;
        minPower: string;
        maxPower: string;
        drive: string;
        transmission: string;
        color: string;
        condition: string;
        seats: string;
        doors: string;
        steeringWheel: string;
        country: string;
        minPrice: string;
        maxPrice: string;
    }
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState<Filter>({
        brand: searchParams.get("brand") || "",
        model: searchParams.get("model") || "",
        bodyType: searchParams.get("bodyType") || "",
        minYear: searchParams.get("minYear") || "",
        maxYear: searchParams.get("maxYear") || "",
        minMileage: searchParams.get("minMileage") || "",
        maxMileage: searchParams.get("maxMileage") || "",
        fuel: searchParams.get("fuel") || "",
        minCapacity: searchParams.get("minCapacity") || "",
        maxCapacity: searchParams.get("maxCapacity") || "",
        minPower: searchParams.get("minPower") || "",
        maxPower: searchParams.get("maxPower") || "",
        drive: searchParams.get("drive") || "",
        transmission: searchParams.get("transmission") || "",
        color: searchParams.get("color") || "",
        condition: searchParams.get("condition") || "",
        seats: searchParams.get("seats") || "",
        doors: searchParams.get("doors") || "",
        steeringWheel: searchParams.get("steeringWheel") || "",
        country: searchParams.get("country") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
    });

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filter).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        setSearchParams(params);
    }, [filter]);

    const handleSetFilter = (key: keyof Filter) =>
        (setValue: React.SetStateAction<string> | React.SetStateAction<string[]>) => {
            setFilter(prev => ({
                ...prev,
                [key]: setValue
            }));
        };

    useEffect(() => {
        if (!carModels[filter.brand]?.includes(filter.model)) {
            setFilter(prev => ({...prev, model: ""}));
        }
    }, [filter.brand]);  //to reset model when brand changes

    const handleResetFilter = () => {
        setFilter({
            brand: "",
            model: "",
            bodyType: "",
            minYear: "",
            maxYear: "",
            minMileage: "",
            maxMileage: "",
            fuel: "",
            minCapacity: "",
            maxCapacity: "",
            minPower: "",
            maxPower: "",
            drive: "",
            transmission: "",
            color: "",
            condition: "",
            seats: "",
            doors: "",
            steeringWheel: "",
            country: "",
            minPrice: "",
            maxPrice: "",
        });
    };

    console.log(filter)
    return (
        <div className="flex flex-col justify-center items-center w-full border-b border-black border-opacity-20">
            <SelectInput label="Brand" value={filter.brand} setValue={handleSetFilter("brand")} options={carBrands} shrinked={true}/>
            <SelectInput label="Model" value={filter.model} setValue={handleSetFilter("model")} options={carModels[filter.brand] ?? []}
                         disabled={!carBrands.includes(filter.brand) || filter.brand === "Other"} shrinked={true}/>
            <SelectInput label="Body type" value={filter.bodyType} setValue={handleSetFilter("bodyType")} options={carBodyTypes} shrinked={true}/>
            <SelectInput label="From year" value={filter.minYear} setValue={handleSetFilter("minYear")} shrinked={true}
                         options={filter.maxYear === "" ? carYears : carYears.filter(year => Number(year) < Number(filter.maxYear))}/>
            <SelectInput label="To year" value={filter.maxYear} setValue={handleSetFilter("maxYear")} shrinked={true}
                         options={carYears.filter(year => Number(year) > Number(filter.minYear))}/>
            <SelectInput label="From mileage" value={filter.minMileage} setValue={handleSetFilter("minMileage")}
                         options={filter.maxMileage === "" ? carMileage : carMileage.filter(mileage => Number(mileage) < Number(filter.maxMileage))}
                         shrinked={true} symbol="km"/>
            <SelectInput label="To mileage" value={filter.maxMileage} setValue={handleSetFilter("maxMileage")} shrinked={true}
                         options={carMileage.filter(mileage => Number(mileage) > Number(filter.minMileage))} symbol="km"/>
            <SelectInput label="Fuel" value={filter.fuel} setValue={handleSetFilter("fuel")} options={carFuels} shrinked={true}/>
            <SelectInput label="From capacity" value={filter.minCapacity} setValue={handleSetFilter("minCapacity")} shrinked={true} symbol="cm3"
                         options={filter.maxCapacity === "" ? carCapacity : carCapacity.filter(capacity => Number(capacity) < Number(filter.maxCapacity))}/>
            <SelectInput label="To capacity" value={filter.maxCapacity} setValue={handleSetFilter("maxCapacity")} shrinked={true} symbol="cm3"
                         options={carCapacity.filter(capacity => Number(capacity) > Number(filter.minCapacity))}/>
            <button onClick={handleResetFilter}>Reset</button>
        </div>
    )
};

export default SearchFilters