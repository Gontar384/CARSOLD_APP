import React, {useEffect, useState} from "react";
import SelectInput from "../../AddingOffer/Atomic/SelectInput/SelectInput.tsx";
import {carBrands} from "../../AddingOffer/Atomic/SelectInput/SelectData/carBrands.ts";
import {useSearchParams} from "react-router-dom";
import {carModels} from "../../AddingOffer/Atomic/SelectInput/SelectData/carModels.ts";
import {carBodyTypes, carBodyTypesPl} from "../../AddingOffer/Atomic/SelectInput/SelectData/carBodyTypes.ts";
import {carYears} from "../../AddingOffer/Atomic/SelectInput/SelectData/carYears.ts";
import {carMileages} from "./AdditionalData/carMileages.ts";
import {carFuels, carFuelsPl} from "../../AddingOffer/Atomic/SelectInput/SelectData/carFuels.ts";
import {carCapacities} from "./AdditionalData/carCapacities.ts";
import {carPowers} from "./AdditionalData/carPowers.ts";
import {carDrives, carDrivesPl} from "../../AddingOffer/Atomic/SelectInput/SelectData/carDrives.ts";
import {carTransmissions, carTransmissionsPl} from "./AdditionalData/carTransmissions.ts";
import {carColors, carColorsPl} from "../../AddingOffer/Atomic/SelectInput/SelectData/carColors.ts";
import {carConditions, carConditionsPl} from "./AdditionalData/carConditions.ts";
import {carSeats} from "../../AddingOffer/Atomic/SelectInput/SelectData/carSeats.ts";
import {carDoors} from "../../AddingOffer/Atomic/SelectInput/SelectData/carDoors.ts";
import {carPrices} from "./AdditionalData/carPrices.ts";
import SearchFiltersButton from "./Atomic/SearchFiltersButton.tsx";
import {fetchFilteredOffers} from "../../../ApiCalls/Services/OfferService.ts";
import {useUtil} from "../../../GlobalProviders/Util/useUtil.ts";
import {FetchedOffer, UpdatedOffer} from "../../AccountDetails/Content/MyOffers/MyOffers.tsx";
import {sortBy, sortByPl} from "./AdditionalData/sortBy.ts";
import {useSearch} from "../../../GlobalProviders/Search/useSearch.ts";
import {useLanguage} from "../../../GlobalProviders/Language/useLanguage.ts";
import RegisterAndSearchLoading from "../../../Additional/Loading/RegisterAndSearchLoading.tsx";

interface SearchFiltersProps {
    setOffers: React.Dispatch<React.SetStateAction<UpdatedOffer[]>>;
    setFetched: React.Dispatch<React.SetStateAction<boolean>>;
    itemsPerPage: number;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setTotalElements: React.Dispatch<React.SetStateAction<number>>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ setOffers, setFetched, itemsPerPage, currentPage, setCurrentPage, setTotalPages, setTotalElements }) => {
    interface Filter {
        phrase: string;
        brand: string;
        model: string;
        bodyType: string;
        minPrice: string;
        maxPrice: string;
        minYear: string;
        maxYear: string;
        fuel: string;
        minMileage: string;
        maxMileage: string;
        color: string;
        transmission: string;
        minPower: string;
        maxPower: string;
        minCapacity: string;
        maxCapacity: string;
        drive: string;
        condition: string;
        seats: string;
        doors: string;
        sortBy: string;
    }
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState<Filter>({
        phrase: searchParams.get("phrase") || "",
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
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        sortBy: searchParams.get("sortBy") || ""
    });
    const [moreFilters, setMoreFilters] = useState<boolean>(false);
    const [animation, setAnimation] = useState<"animate-slideDownShow" | "animate-slideUpShow" | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);
    const {isMobile} = useUtil();
    const [searchTrigger, setSearchTrigger] = useState<boolean>(false);
    const {phrase, setPhrase, trigger, setClicked} = useSearch();
    const {t, language, translate, translateForBackend} = useLanguage();
    const [loading, setLoading] = useState<boolean>(false);
    const [searched, setSearched] = useState<boolean>(false);

    useEffect(() => {
        if (!searched) return;
        const params = new URLSearchParams();
        if (filter.phrase) params.set("phrase", filter.phrase.trim());
        if (filter.brand) params.set("brand", filter.brand);
        if (filter.model) params.set("model", filter.model);
        if (filter.bodyType) params.set("bodyType", translateForBackend("bodyType", filter.bodyType));
        if (filter.minYear) params.set("minYear", filter.minYear);
        if (filter.maxYear) params.set("maxYear", filter.maxYear);
        if (filter.minMileage) params.set("minMileage", filter.minMileage);
        if (filter.maxMileage) params.set("maxMileage", filter.maxMileage);
        if (filter.fuel) params.set("fuel", translateForBackend("fuel", filter.fuel));
        if (filter.minCapacity) params.set("minCapacity", filter.minCapacity);
        if (filter.maxCapacity) params.set("maxCapacity", filter.maxCapacity);
        if (filter.minPower) params.set("minPower", filter.minPower);
        if (filter.maxPower) params.set("maxPower", filter.maxPower);
        if (filter.drive) params.set("drive", translateForBackend("drive", filter.drive));
        if (filter.transmission) params.set("transmission", translateForBackend("transmission", filter.transmission));
        if (filter.color) params.set("color", translateForBackend("color", filter.color));
        if (filter.condition) params.set("condition", translateForBackend("condition", filter.condition));
        if (filter.seats) params.set("seats", filter.seats);
        if (filter.doors) params.set("doors", filter.doors);
        if (filter.minPrice) params.set("minPrice", filter.minPrice);
        if (filter.maxPrice) params.set("maxPrice", filter.maxPrice);
        if (filter.sortBy) params.set("sortBy", translateForBackend("sortBy", filter.sortBy));
        params.set("page", String(currentPage));
        params.set("size", String(itemsPerPage));
        if (params.toString() !== searchParams.toString()) {
            setSearchParams(params, { replace: true });
        }
        setSearched(false);
    }, [searched]); //sets filter in URL

    useEffect(() => {
        setFilter(prev => ({
            ...prev,
            bodyType: translate("bodyType", filter.bodyType),
            fuel: translate("fuel", filter.fuel),
            color: translate("color", filter.color),
            transmission: translate("transmission", filter.transmission),
            drive: translate("drive", filter.drive),
            condition: translate("condition", filter.condition),
            sortBy: translate("sortBy", filter.sortBy)
        }));
    }, [language]); //updates filter when language changes

    const handleSetFilter = (key: keyof Filter) => (setValue: React.SetStateAction<string> | React.SetStateAction<string[]>) => {
        setFilter(prev => ({
            ...prev,
            [key]: setValue
        }));
    };

    useEffect(() => {
        setFilter(prev => ({...prev, phrase: phrase}));
    }, [phrase]); //updates filter with phrase

    useEffect(() => {
        if (!carModels[filter.brand]?.includes(filter.model)) {
            setFilter(prev => ({...prev, model: ""}));
        }
    }, [filter.brand]);  //to reset model when brand changes

    const handleResetFilter = () => {
        setFilter({
            phrase: "",
            brand: "",
            model: "",
            bodyType: "",
            minPrice: "",
            maxPrice: "",
            minYear: "",
            maxYear: "",
            fuel: "",
            minMileage: "",
            maxMileage: "",
            color: "",
            transmission: "",
            minPower: "",
            maxPower: "",
            minCapacity: "",
            maxCapacity: "",
            drive: "",
            condition: "",
            seats: "",
            doors: "",
            sortBy: "",
        });
        setPhrase("");
        setTimeout(() => setClicked(false), 0);
        setCurrentPage(0);
        setSearchTrigger(true);
    };

    const handleMoreFilters = () => {
        if (!moreFilters) {
            setAnimation("animate-slideDownShow");
            setMoreFilters(true);
        } else {
            setAnimation("animate-slideUpShow");
            setTimeout(() => setMoreFilters(false), 200);
        }
    };

    const handleSearch = async () => {
        if (disabled) return;
        setDisabled(true);
        setFetched(false);

        type ObjectOnlyKeys = "fuel" | "drive" | "transmission" | "bodyType" | "color" | "condition" | "sortBy";
        const fieldsToTranslate: ObjectOnlyKeys[] = ["fuel", "drive", "transmission", "bodyType", "color", "condition", "sortBy"];
        const fieldsToNumber = ["minPrice", "maxPrice", "minYear", "maxYear", "minMileage", "maxMileage", "minPower", "maxPower", "minCapacity", "maxCapacity", "seats", "doors"];

        const formattedFilter = Object.entries(filter).reduce((acc, [key, value]) => {
            if (value !== "") {
                if (fieldsToNumber.includes(key)) {
                    acc[key] = Number(value);
                } else if (fieldsToTranslate.includes(key as ObjectOnlyKeys)) {
                    acc[key] = translateForBackend(key as ObjectOnlyKeys, value);
                } else if (key === "phrase") {
                    acc[key] = value.trim();
                } else {
                    acc[key] = value;
                }
            }
            return acc;
        }, {} as Record<string, string | number>);

        const queryParams = new URLSearchParams({
            ...Object.entries(formattedFilter).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>),
            page: String(currentPage),
            size: String(itemsPerPage),
        }).toString();

        setSearchParams(queryParams);
        setLoading(true);
        try {
            const offers = await fetchFilteredOffers(queryParams);
            if (offers.data) {
                const partialList = offers.data._embedded?.partialOfferDtoList ?? [];
                const formattedOffers: UpdatedOffer[] = partialList.map((offer: FetchedOffer) => ({
                    id: offer.id ?? "",
                    title: offer.title ?? "",
                    photoUrl: offer.photoUrl ?? "",
                    price: String(offer.price ?? ""),
                    currency: offer.currency ?? "",
                    power: String(offer.power ?? ""),
                    capacity: String(offer.capacity ?? ""),
                    transmission: offer.transmission ?? "",
                    fuel: offer.fuel ?? "",
                    mileage: String(offer.mileage ?? ""),
                    year: String(offer.year ?? ""),
                }));
                setOffers(formattedOffers);
                setTotalPages(offers.data.page.totalPages);
                setTotalElements(offers.data.page.totalElements);
            }
        } catch (error) {
            console.error("Unexpected error occurred when searching offers:", error);
            setOffers([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setSearched(true);
            setFetched(true);
            setDisabled(false);
            setTimeout(() => setLoading(false), 200);
        }
    };

    useEffect(() => {
        setSearchTrigger(true);
    }, [currentPage]); //searches after changing page

    useEffect(() => {
        setCurrentPage(0);
        setSearchTrigger(true);
    }, [trigger]); //searches by using phrase

    const handleManageSearch = () => {
        setCurrentPage(0);
        setSearchTrigger(true);
    };

    useEffect(() => {
        if (searchTrigger) {
            handleSearch();
            setSearchTrigger(false);
        }
    }, [searchTrigger]); //to activate searching when all states are properly updated, especially currentPage

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-[1200px] pb-7 m:pb-8 pt-10 m:pt-12 gap-3 border-x-2 border-b-2 border-gray-300 bg-white rounded-b-xl relative">
            <h2 className="hidden">Filters</h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 bg-white z-20">
                <SelectInput label={t("search3")} value={filter.brand} setValue={handleSetFilter("brand")} options={carBrands} shrinked={true}/>
                <SelectInput label="Model" value={filter.model} setValue={handleSetFilter("model")} options={carModels[filter.brand] ?? []}
                             disabled={!carBrands.includes(filter.brand)} shrinked={true}/>
                <SelectInput label={t("search4")} value={filter.bodyType} setValue={handleSetFilter("bodyType")} options={language === "ENG" ? carBodyTypes : carBodyTypesPl} shrinked={true}/>
                {isMobile && <SelectInput label={t("search5")} value={filter.fuel} setValue={handleSetFilter("fuel")} options={language === "ENG" ? carFuels : carFuelsPl} shrinked={true}/>}
                <SelectInput label={t("search6")} value={filter.minPrice} setValue={handleSetFilter("minPrice")} shrinked={true} symbol="PLN" numericOnly={true}
                             options={filter.maxPrice === "" ? carPrices : carPrices.filter(price => Number(price) < Number(filter.maxPrice))}/>
                <SelectInput label={t("search7")} value={filter.maxPrice} setValue={handleSetFilter("maxPrice")} shrinked={true} symbol="PLN" numericOnly={true}
                             options={carPrices.filter(price => Number(price) > Number(filter.minPrice))}/>
                <SelectInput label={t("search8")} value={filter.minYear} setValue={handleSetFilter("minYear")} shrinked={true} numericOnly={true}
                             options={filter.maxYear === "" ? carYears : carYears.filter(year => Number(year) < Number(filter.maxYear))}/>
                <SelectInput label={t("search9")} value={filter.maxYear} setValue={handleSetFilter("maxYear")} shrinked={true} numericOnly={true}
                             options={carYears.filter(year => Number(year) > Number(filter.minYear))}/>
                {!isMobile && <SelectInput label={t("search5")} value={filter.fuel} setValue={handleSetFilter("fuel")} options={language === "ENG" ? carFuels : carFuelsPl} shrinked={true}/>}
                <SelectInput label={t("search10")} value={filter.minMileage} setValue={handleSetFilter("minMileage")} shrinked={true} symbol="km" numericOnly={true}
                             options={filter.maxMileage === "" ? carMileages : carMileages.filter(mileage => Number(mileage) < Number(filter.maxMileage))}/>
                <SelectInput label={t("search11")} value={filter.maxMileage} setValue={handleSetFilter("maxMileage")} shrinked={true} symbol="km" numericOnly={true}
                             options={carMileages.filter(mileage => Number(mileage) > Number(filter.minMileage))}/>
            </div>
            <div className={`${moreFilters ? `grid grid-cols-2 lg:grid-cols-5 gap-3 ${animation} z-10` : "hidden"}`}>
                <SelectInput label={t("search12")} value={filter.color} setValue={handleSetFilter("color")} shrinked={true} options={language === "ENG" ? carColors : carColorsPl}/>
                {isMobile && <SelectInput label={t("search13")} value={filter.transmission} setValue={handleSetFilter("transmission")} shrinked={true} options={language === "ENG" ? carTransmissions : carTransmissionsPl}/>}
                <SelectInput label={t("search14")} value={filter.minPower} setValue={handleSetFilter("minPower")} shrinked={true} symbol={t("search27")} numericOnly={true}
                             options={filter.maxPower === "" ? carPowers : carPowers.filter(power => Number(power) < Number(filter.maxPower))}/>
                <SelectInput label={t("search15")} value={filter.maxPower} setValue={handleSetFilter("maxPower")} shrinked={true} symbol={t("search27")} numericOnly={true}
                             options={carPowers.filter(power => Number(power) > Number(filter.minPower))}/>
                <SelectInput label={t("search16")} value={filter.minCapacity} setValue={handleSetFilter("minCapacity")} shrinked={true} symbol="cm3" numericOnly={true}
                             options={filter.maxCapacity === "" ? carCapacities : carCapacities.filter(capacity => Number(capacity) < Number(filter.maxCapacity))}/>
                <SelectInput label={t("search17")} value={filter.maxCapacity} setValue={handleSetFilter("maxCapacity")} shrinked={true} symbol="cm3" numericOnly={true}
                             options={carCapacities.filter(capacity => Number(capacity) > Number(filter.minCapacity))}/>
                {!isMobile && <SelectInput label={t("search18")} value={filter.transmission} setValue={handleSetFilter("transmission")} shrinked={true} options={language === "ENG" ? carTransmissions : carTransmissionsPl}/>}
                <SelectInput label={t("search19")} value={filter.drive} setValue={handleSetFilter("drive")} shrinked={true} options={language === "ENG" ? carDrives : carDrivesPl}/>
                <SelectInput label={t("search20")} value={filter.condition} setValue={handleSetFilter("condition")} shrinked={true} options={language === "ENG" ? carConditions : carConditionsPl}/>
                <SelectInput label={t("search21")} value={filter.seats} setValue={handleSetFilter("seats")} shrinked={true} options={carSeats} numericOnly={true}/>
                <SelectInput label={t("search22")} value={filter.doors} setValue={handleSetFilter("doors")} shrinked={true} options={carDoors} numericOnly={true}/>
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-1 m:gap-3 mt-6 mb-4 m:mb-5">
                <SearchFiltersButton label={t("search23")} onClick={handleResetFilter} color="gray-200"/>
                <SearchFiltersButton label={t("search24")} onClick={handleMoreFilters} color="white"/>
                <SearchFiltersButton label={t("search25")} onClick={handleManageSearch} color="lowLime"/>
            </div>
            <SelectInput label={t("search26")} value={filter.sortBy} setValue={handleSetFilter("sortBy")} shrinked={true} options={language === "ENG" ? sortBy : sortByPl} typingBlocked={true}/>
            {loading && <RegisterAndSearchLoading usage="search"/>}
        </div>
    )
};

export default SearchFilters