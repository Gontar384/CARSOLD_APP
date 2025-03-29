import React, {useState} from "react";
import SelectInput from "../../AddingOffer/Atomic/SelectInput/SelectInput.tsx";
import {carBrands} from "../../AddingOffer/Atomic/SelectInput/SelectData/carBrands.ts";

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
        capacity: string;
        power: string;
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
    const [filter, setFilter] = useState<Filter>({
        brand: "",
        model: "",
        bodyType: "",
        minYear: "",
        maxYear: "",
        minMileage: "",
        maxMileage: "",
        fuel: "",
        capacity: "",
        power: "",
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
    const handleSetFilter = (key: keyof typeof filter) =>
        (setValue: React.SetStateAction<string> | React.SetStateAction<string[]>) => {
            setFilter(prev => ({
                ...prev,
                [key]: setValue
            }));
        };
    console.log(filter)
    return (
      <div className="flex flex-col justify-center items-center w-full border-b border-black border-opacity-20">
          <SelectInput label="Brand" value={filter.brand} setValue={handleSetFilter("brand")} options={carBrands}/>
      </div>
  )
};

export default SearchFilters
