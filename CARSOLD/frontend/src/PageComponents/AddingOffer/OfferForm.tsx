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
import AnimatedBanner from "../../Additional/Banners/AnimatedBanner.tsx";
import {addOffer, deleteOffer, updateOffer} from "../../ApiCalls/Services/OfferService.ts";
import {AxiosError} from "axios";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import AddingOfferLoader from "../../Additional/Loading/AddingOfferLoader.tsx";
import {useOfferUtil} from "../../CustomHooks/useOfferUtil.ts";
import DeleteOfferButton from "./Atomic/Button/DeleteOfferButton.tsx";
import {ForbiddenError, NotFoundError} from "../../ApiCalls/Errors/CustomErrors.ts";

const OfferForm: React.FC = () => {
    document.title = "CARSOLD | Adding Offer";
    interface RawOffer {
        title: string;
        brand: string;
        model: string;
        bodyType: string;
        year: string;
        mileage: string;
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
        vin: string;
        plate: string;
        firstRegistration: string;
        description: string;
        photos: string[];
        price: string;
        currency: string;
    }
    const {section} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const {handleFetchOffer} = useOfferUtil();
    const [id, setId] = useState<number | null>(null);
    const [data, setData] = useState<RawOffer | null>(null);
    const [permission, setPermission] = useState<boolean | null>(null);
    const [offer, setOffer] = useState<RawOffer>({
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
        color: "",
        condition: "",
        seats: "",
        doors: "",
        steeringWheel: "",
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
        color: false,
        condition: false,
        seats: false,
        doors: false,
        steeringWheel: false,
        country: false,
        vin: false,
        plate: false,
        firstRegistration: false,
        description: false,
        price: false
    });
    const [message, setMessage] = useState({
        title: "At least 10 characters.",
        brand: "Choose car's brand.",
        model: "Choose car's model.",
        bodyType: "Choose car's body type.",
        year: "Choose year of production.",
        mileage: "Provide car's mileage in km.",
        fuel: "Choose fuel type.",
        capacity: "Provide engine capacity in cm3.",
        power: "Provide engine power in HP.",
        drive: "Choose car's drive.",
        transmission: "Choose car's transmission.",
        color: "Choose car's color.",
        condition: "Choose car's condition.",
        seats: "Choose number of seats.",
        steeringWheel: "Choose steering wheel side.",
        doors: "Choose number of doors.",
        country: "Choose car's origin country.",
        vin: "Provide car's VIN.",
        plate: "Provide license plate's number.",
        firstRegistration: "Provide date of first registration.",
        description: "At least 30 characters.",
        price: "Enter price of your offer."
    });
    const [toggled, setToggled] = useState({
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
        color: false,
        condition: false,
        seats: false,
        doors: false,
        steeringWheel: false,
        country: false,
        vin: false,
        plate: false,
        firstRegistration: false,
        description: false,
        price: false
    });
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [formErrorBanner, setFormErrorBanner] = useState<boolean>(false);
    const [inappropriateContentBanner, setInappropriateContentBanner] = useState<boolean>(false);
    const [waitBanner, setWaitBanner] = useState<boolean>(false);
    const [wentWrongBanner, setWentWrongBanner] = useState<boolean>(false);

    //if user redirects from /modifyingOffer/{id} to /addingOffer, it resets all states
    useEffect(() => {
        if (location.pathname === '/addingOffer') {
            setId(null);
            setData(null);
            setPermission(null);
            setOffer({
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
                color: "",
                condition: "",
                seats: "",
                doors: "",
                steeringWheel: "",
                country: "",
                vin: "",
                plate: "",
                firstRegistration: "",
                description: "",
                photos: Array(8).fill(""),
                price: "",
                currency: "PLN",
            });
            setError(Object.fromEntries(Object.keys(error).map((key) => [key, false])) as typeof error);
            setMessage({
                title: "At least 10 characters.",
                brand: "Choose car's brand.",
                model: "Choose car's model.",
                bodyType: "Choose car's body type.",
                year: "Choose year of production.",
                mileage: "Provide car's mileage in km.",
                fuel: "Choose fuel type.",
                capacity: "Provide engine capacity in cm3.",
                power: "Provide engine power in HP.",
                drive: "Choose car's drive.",
                transmission: "Choose car's transmission.",
                color: "Choose car's color.",
                condition: "Choose car's condition.",
                seats: "Choose number of seats.",
                steeringWheel: "Choose steering wheel side.",
                doors: "Choose number of doors.",
                country: "Choose car's origin country.",
                vin: "Provide car's VIN.",
                plate: "Provide license plate's number.",
                firstRegistration: "Provide date of first registration.",
                description: "At least 30 characters.",
                price: "Enter price of your offer."
            })
            setToggled(Object.fromEntries(Object.keys(toggled).map((key) => [key, false])) as typeof toggled);
            setIsDisabled(false);
            setLoading(false);
            setFormErrorBanner(false);
            setInappropriateContentBanner(false);
            setWaitBanner(false);
            setWentWrongBanner(false);
        }
    }, [location.pathname]);

    //those work when /modifyingOffer/{id}
    useEffect(() => {
        if (section) {
            const numericId = Number(section.replace(/,/g, ''));
            if (!isNaN(numericId)) setId(numericId);
        }
    }, [section]);  //gets id from section

    useEffect(() => {
        const handleFetchOfferData = async (id: number) => {
            const { offerData, userPermission } = await handleFetchOffer(id);
            setData(offerData);
            setPermission(userPermission);
        };
        if (id !== null) {
            handleFetchOfferData(id);
        }
    }, [id]); //fetches offer and user permission

    const formatNumber = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        if (data !== null && permission === true) {
            const transformedOffer: RawOffer = {
                title: data.title ?? "",
                brand: data.brand ?? "",
                model: data.model ?? "",
                bodyType: data.bodyType ?? "",
                year: String(data.year ?? ""),
                mileage: formatNumber(String(data.mileage ?? "")),
                fuel: data.fuel ?? "",
                capacity: formatNumber(String(data.capacity ?? "")),
                power: formatNumber(String(data.power ?? "")),
                drive: data.drive ?? "",
                transmission: data.transmission ?? "",
                color: data.color ?? "",
                condition: data.condition ?? "",
                seats: String(data.seats ?? ""),
                doors: String(data.doors ?? ""),
                steeringWheel: data.steeringWheel ?? "",
                country: data.country ?? "",
                vin: data.vin ?? "",
                plate: data.plate ?? "",
                firstRegistration: String(data.firstRegistration ?? ""),
                description: data.description ?? "",
                photos: ((data.photos as unknown as string)?.split(",") || []).concat(Array(8).fill("").slice(0, 8 - (data.photos as unknown as string)?.split(",")?.length)),
                price: formatNumber(String(data.price ?? "")),
                currency: data.currency ?? "",
            };
            setOffer(transformedOffer);
        } else if (permission === false) {
            navigate("/addingOffer");
        }
    }, [data, permission]);  //transfers data to object for updating offer purpose

    //helper methods
    const handleSetOffer = (key: keyof typeof offer) =>
        (setValue: React.SetStateAction<string> | React.SetStateAction<string[]>) => {
            setOffer(prev => ({
                ...prev,
                [key]: setValue
            }));
        };

    const setErrorField = (field: keyof typeof error, value: boolean) => {
        setError(prev => ({...prev, [field]: value}));
    };

    const setMessageField = (field: keyof typeof message, value: string) => {
        setMessage(prev => ({...prev, [field]: value}));
    };

    const setToggledField = (field: keyof typeof toggled, value: boolean) => {
        setToggled(prev => ({...prev, [field]: value}));
    };

    const handleSetToggled = (key: keyof typeof toggled) =>
        (setValue: React.SetStateAction<boolean>) => {
            setToggled(prev => ({
                ...prev,
                [key]: setValue
            }));
        };

    //user interactions (errors and messages)
    //title
    useEffect(() => {
        if (toggled.title) {
            if (offer.title === "") {
                setErrorField("title", true);
                setMessageField("title", "You have to provide title.");
            } else if (!/[a-zA-Z0-9]/.test(offer.title)) {
                setErrorField("title", true);
                setMessageField("title", "Incorrect title!");
            } else if (offer.title.length < 5) {
                setErrorField("title", true);
                setMessageField("title", "Title is too short.");
            }
            setToggledField("title", false);
        }
    }, [toggled.title]);

    useEffect(() => {
        if (offer.title.length <= 30) {
            if ((offer.title.match(/[A-Z]/g) || []).length > 10) {
                setErrorField("title", true);
                setMessageField("title", "Too many BIG LETTERS!");
            } else {
                setErrorField("title", false);
                setMessageField("title", "At least 10 characters.");
            }
        } else {
            setErrorField("title", true);
            setMessageField("title", "Title is too long.");
        }
    }, [offer.title]);

    //brand
    useEffect(() => {
        if (toggled.brand) {
            if (offer.brand === "") {
                setErrorField("brand", true);
                setMessageField("brand", "You have to choose brand.");
            } else {
                setErrorField("brand", false);
                setMessageField("brand", "Choose car's brand.");
            }
            setToggledField("brand", false);
        }
    }, [toggled.brand]);

    //model
    useEffect(() => {
        if (toggled.model) {
            if (offer.model === "") {
                setErrorField("model", true);
                setMessageField("model", "You have to choose model.");
            } else {
                setErrorField("model", false);
                setMessageField("model", "Choose car's model.");
            }
            setToggledField("model", false);
        }
    }, [toggled.model]);

    useEffect(() => {
        if (!carModels[offer.brand]?.includes(offer.model)) {
            setOffer(prev => ({...prev, model: ""}));
        }
    }, [offer.brand]);  //to reset model when brand changes

    //bodyType
    useEffect(() => {
        if (toggled.bodyType) {
            if (offer.bodyType === "") {
                setErrorField("bodyType", true);
                setMessageField("bodyType", "You have to choose body type.");
            } else {
                setErrorField("bodyType", false);
                setMessageField("bodyType", "Choose car's body type.");
            }
            setToggledField("bodyType", false);
        }
    }, [toggled.bodyType]);

    //year
    useEffect(() => {
        if (toggled.year) {
            if (offer.year === "") {
                setErrorField("year", true);
                setMessageField("year", "You have to choose year of production.");
            } else {
                setErrorField("year", false);
                setMessageField("year", "Choose year of production.");
            }
            setToggledField("year", false);
        }
    }, [toggled.year]);

    //mileage
    useEffect(() => {
        if (toggled.mileage) {
            if (offer.mileage === "") {
                setErrorField("mileage", true);
                setMessageField("mileage", "You have to provide car's mileage.");
            }
            setToggledField("mileage", false);
        }
    }, [toggled.mileage]);

    useEffect(() => {
        if (offer.mileage.length > 9) {
            setErrorField("mileage", true);
            setMessageField("mileage", "Mileage is incorrect!");
        } else {
            setErrorField("mileage", false);
            setMessageField("mileage", "Provide car's mileage in km.");
        }
    }, [offer.mileage]);

    //fuel
    useEffect(() => {
        if (toggled.fuel) {
            if (offer.fuel === "") {
                setErrorField("fuel", true);
                setMessageField("fuel", "You have to choose fuel type.");
            } else {
                setErrorField("fuel", false);
                setMessageField("fuel", "Choose fuel type.");
            }
            setToggledField("fuel", false);
        }
    }, [toggled.fuel]);

    //capacity
    useEffect(() => {
        if (toggled.capacity) {
            if (offer.capacity === "") {
                setErrorField("capacity", true);
                setMessageField("capacity", "You have to provide engine capacity.");
            } else if (offer.capacity.length < 3) {
                setErrorField("capacity", true);
                setMessageField("capacity", "Engine capacity is incorrect!");
            }
            setToggledField("capacity", false);
        }
    }, [toggled.capacity]);

    useEffect(() => {
        if (offer.capacity.length > 6) {
            setErrorField("capacity", true);
            setMessageField("capacity", "Engine capacity is incorrect!");
        } else {
            setErrorField("capacity", false);
            setMessageField("capacity", "Provide engine capacity in cm3.");
        }
    }, [offer.capacity]);

    //power
    useEffect(() => {
        if (toggled.power) {
            if (offer.power === "") {
                setErrorField("power", true);
                setMessageField("power", "You have to provide engine power.");
            }
            setToggledField("power", false);
        }
    }, [toggled.power]);

    useEffect(() => {
        if (offer.power.length > 5) {
            setErrorField("power", true);
            setMessageField("power", "Engine power is incorrect!");
        } else {
            setErrorField("power", false);
            setMessageField("power", "Provide engine power in HP.");
        }
    }, [offer.power]);

    //drive
    useEffect(() => {
        if (toggled.drive) {
            if (offer.drive === "") {
                setErrorField("drive", true);
                setMessageField("drive", "You have to choose drive.");
            } else {
                setErrorField("drive", false);
                setMessageField("drive", "Choose car's drive.");
            }
            setToggledField("drive", false);
        }
    }, [toggled.drive]);

    //transmission
    useEffect(() => {
        if (offer.transmission !== "") {
            setErrorField("transmission", false);
            setMessageField("transmission", "Choose car's transmission.")
        }
    }, [offer.transmission]);

    //color
    useEffect(() => {
        if (toggled.color) {
            if (offer.color === "") {
                setErrorField("color", true);
                setMessageField("color", "You have to choose color.");
            } else {
                setErrorField("color", false);
                setMessageField("color", "Choose car's color.");
            }
            setToggledField("color", false);
        }
    }, [toggled.color]);

    //condition
    useEffect(() => {
        if (offer.condition !== "") {
            setErrorField("condition", false);
            setMessageField("condition", "Choose car's condition.")
        }
    }, [offer.condition]);

    //vin
    useEffect(() => {
        if (toggled.vin) {
            if (offer.vin === "") {
                setToggledField("vin", false);
                setErrorField("vin", false);
                setMessageField("vin", "Provide car's VIN.");
                return;
            }
            const vinRegex = /^[A-Z0-9]{17}$/;
            if (vinRegex.test(offer.vin)) {
                setErrorField("vin", false);
                setMessageField("vin", "Provide car's VIN.");
            } else {
                setErrorField("vin", true);
                setMessageField("vin", "VIN is incorrect!");
            }
            setToggledField("vin", false);
        }
    }, [toggled.vin]);

    //plate
    useEffect(() => {
        if (toggled.plate) {
            if (offer.plate === "") {
                setToggledField("plate", false);
                setErrorField("plate", false);
                setMessageField("plate", "Provide license plate's number.");
                return;
            }
            const plateRegex = /^[A-Z0-9]{4,8}$/;
            if (plateRegex.test(offer.plate)) {
                setErrorField("plate", false);
                setMessageField("plate", "Provide license plate's number.");
            } else {
                setErrorField("plate", true);
                setMessageField("plate", "License plate number is incorrect!");
            }
            setToggledField("plate", false);
        }
    }, [toggled.plate]);

    //firstRegistration
    useEffect(() => {
        if (toggled.firstRegistration) {
            if (offer.firstRegistration === "") {
                setToggledField("firstRegistration", false);
                setErrorField("firstRegistration", false);
                setMessageField("firstRegistration", "Provide date of first registration.");
                return;
            }
            const year = Number(offer.firstRegistration.split("-")[0]);
            if (year >= 1900 && year <= 2025) {
                setErrorField("firstRegistration", false);
                setMessageField("firstRegistration", "Provide date of first registration.");
            } else {
                setErrorField("firstRegistration", true);
                setMessageField("firstRegistration", "Incorrect date!");
            }
            setToggledField("firstRegistration", false);
        }
    }, [toggled.firstRegistration]);

    //description
    useEffect(() => {
        if (toggled.description) {
            if (offer.description === "") {
                setErrorField("description", true);
                setMessageField("description", "You have to add description.");
            } else if (!/[a-zA-Z0-9]/.test(offer.description)) {
                setErrorField("description", true);
                setMessageField("description", "Incorrect description!");
            } else if (offer.description.length < 30) {
                setErrorField("description", true);
                setMessageField("description", "Description is too short.");
            }
            setToggledField("description", false);
        }
    }, [toggled.description]);

    useEffect(() => {
        if (offer.description.length > 2000) {
            setErrorField("description", true);
            setMessageField("description", "Description is too long!");
        } else {
            setErrorField("description", false);
            setMessageField("description", "At least 30 characters.");
        }
    }, [offer.description]);

    //price
    useEffect(() => {
        if (toggled.price) {
            if (offer.price === "") {
                setErrorField("price", true);
                setMessageField("price", "You have to set price.");
            } else if (offer.price.length < 3) {
                setErrorField("price", true);
                setMessageField("price", "Price is incorrect!");
            }
            setToggledField("price", false);
        }
    }, [toggled.price]);

    useEffect(() => {
        if (offer.price.length > 12) {
            setErrorField("price", true);
            setMessageField("price", "Price is incorrect!");
        } else {
            setErrorField("price", false);
            setMessageField("price", "Enter price of your offer.");
        }
    }, [offer.price]);

    //offer logic
    //checks if values are valid before commiting
    const checkValues= () => {
        let isValid = true;

        if (offer.title === "") {
            setErrorField("title", true);
            setMessageField("title", "You have to provide title.")
            isValid = false;
        } else if (!/[a-zA-Z0-9]/.test(offer.title)) {
            setErrorField("title", true);
            setMessageField("title", "Incorrect title!");
            isValid = false;
        } else if (offer.title.length < 5) {
            setErrorField("title", true);
            setMessageField("title", "Title is too short.");
            isValid = false;
        } else if (offer.title.length > 30) {
            setErrorField("title", true);
            setMessageField("title", "Title is too long.");
            isValid = false;
        } else if ((offer.title.match(/[A-Z]/g) || []).length > 10) {
            setErrorField("title", true);
            setMessageField("title", "Too many BIG LETTERS!");
            isValid = false;
        }
        if (offer.brand === "" || !carBrands.includes(offer.brand)) {
            setErrorField("brand", true);
            setMessageField("brand", "You have to choose brand.")
            isValid = false;
        }
        if (offer.model === "" && offer.brand !== "Other" || !carModels[offer.brand].includes(offer.model)) {
            setErrorField("model", true);
            setMessageField("model", "You have to choose model.");
            isValid = false;
        }
        if (offer.bodyType === "" || !carBodyTypes.includes(offer.bodyType)) {
            setErrorField("bodyType", true);
            setMessageField("bodyType", "You have to choose body type.");
            isValid = false;
        }
        if (offer.year === "" || !carYears.includes(offer.year)) {
            setErrorField("year", true);
            setMessageField("year", "You have to choose year of production.");
            isValid = false;
        }
        if (offer.mileage === "") {
            setErrorField("mileage", true);
            setMessageField("mileage", "You have to provide car's mileage.");
            isValid = false;
        } else if (offer.mileage.length > 9) {
            setErrorField("mileage", true);
            setMessageField("mileage", "Mileage is incorrect!");
            isValid = false;
        }
        if (offer.fuel === "" || !carFuels.includes(offer.fuel)) {
            setErrorField("fuel", true);
            setMessageField("fuel", "You have to choose fuel type.");
            isValid = false;
        }
        if (offer.capacity === "") {
            setErrorField("capacity", true);
            setMessageField("capacity", "You have to provide engine capacity.");
            isValid = false;
        } else if (offer.capacity.length < 3) {
            setErrorField("capacity", true);
            setMessageField("capacity", "Engine capacity is incorrect!");
            isValid = false;
        } else if (offer.capacity.length > 6) {
            setErrorField("capacity", true);
            setMessageField("capacity", "Engine capacity is incorrect!");
            isValid = false;
        }
        if (offer.power === "") {
            setErrorField("power", true);
            setMessageField("power", "You have to provide engine power.");
            isValid = false;
        } else if (offer.power.length > 5) {
            setErrorField("power", true);
            setMessageField("power", "Engine power is incorrect!");
            isValid = false;
        }
        if (offer.drive === "" || !carDrives.includes(offer.drive)) {
            setErrorField("drive", true);
            setMessageField("drive", "You have to choose drive.");
            isValid = false;
        }
        if (offer.transmission === "" || !["Manual", "Automatic"].includes(offer.transmission)) {
            setErrorField("transmission", true);
            setMessageField("transmission", "You have to choose car's transmission.");
            isValid = false;
        }
        if (offer.color === "" || !carColors.includes(offer.color)) {
            setErrorField("color", true);
            setMessageField("color", "You have to choose color.");
            isValid = false;
        }
        if (offer.condition === "" || !["Undamaged", "Damaged"].includes(offer.condition)) {
            setErrorField("condition", true);
            setMessageField("condition", "You have to choose car's condition.");
            isValid = false;
        }
        if (offer.seats !== "" && !carSeats.includes(offer.seats)) {
            setErrorField("seats", true);
            setMessageField("seats", "You have to choose seats.");
            isValid = false;
        }
        if (offer.doors !== "" && !carDoors.includes(offer.doors)) {
            setErrorField("doors", true);
            setMessageField("doors", "You have to choose doors.");
            isValid = false;
        }
        if (offer.steeringWheel !== "" && !["Left", "Right"].includes(offer.steeringWheel)) {
            setErrorField("steeringWheel", true);
            setMessageField("steeringWheel", "You have to choose steering wheel side.");
            isValid = false;
        }
        if (offer.country !== "" && !carCountries.includes(offer.country)) {
            setErrorField("country", true);
            setMessageField("country", "You have to choose country.");
            isValid = false;
        }
        if (offer.vin !== "" && !/^[A-Z0-9]{17}$/.test(offer.vin)) {
            setErrorField("vin", true);
            setMessageField("vin", "VIN is incorrect!");
            isValid = false;
        }
        if (offer.plate !== "" && !/^[A-Z0-9]{4,8}$/.test(offer.plate)) {
            setErrorField("plate", true);
            setMessageField("plate", "License plate number is incorrect!");
            isValid = false;
        }
        if (offer.firstRegistration !== "") {
            const year = Number(offer.firstRegistration.split("-")[0]);
            if (year < 1900 && year > 2025) {
                setErrorField("firstRegistration", true);
                setMessageField("firstRegistration", "Incorrect date!");
                isValid = false;
            }
        }
        if (offer.description === "") {
            setErrorField("description", true);
            setMessageField("description", "You have to add description.");
            isValid = false;
        } else if (!/[a-zA-Z0-9]/.test(offer.description)) {
            setErrorField("description", true);
            setMessageField("description", "Incorrect description!");
            isValid = false;
        } else if (offer.description.length < 30) {
            setErrorField("description", true);
            setMessageField("description", "Description is too short.");
            isValid = false;
        } else if (offer.description.length > 2000) {
            setErrorField("description", true);
            setMessageField("description", "Description is too long!");
            isValid = false;
        }
        if (offer.price === "") {
            setErrorField("price", true);
            setMessageField("price", "You have to set price.");
            isValid = false;
        } else if (offer.price.length < 3 || offer.price.length > 12) {
            setErrorField("price", true);
            setMessageField("price", "Price is incorrect!");
            isValid = false;
        }

        return isValid;
    };

    //fetch photos, convert photos and Offer object to formData
    const convertToOfferData = async (offer: RawOffer): Promise<FormData> => {
        const formData = new FormData();

        for (let index = 0; index < offer.photos.length; index++) {
            const photo = offer.photos[index];
            if (photo) {
                try {
                    const response = await fetch(photo);
                    const blob = await response.blob();
                    const filename = `photo${index}.${blob.type.split("/")[1]}`;
                    formData.append("photos", blob, filename);
                } catch (error) {
                    console.error(`Error converting blob URL to file: ${photo}`, error);
                }
            }
        }

        const parseNumber = (value: string): number | null => {
            const sanitizedValue = value.replace(/\./g, '');
            const parsed = Number(sanitizedValue);
            return isNaN(parsed) ? null : parsed;
        };

        const offerDto = {
            title: offer.title,
            brand: offer.brand,
            model: offer.model,
            bodyType: offer.bodyType,
            year: parseNumber(offer.year),
            mileage: parseNumber(offer.mileage),
            fuel: offer.fuel,
            capacity: parseNumber(offer.capacity),
            power: parseNumber(offer.power),
            drive: offer.drive,
            transmission: offer.transmission,
            seats: offer.seats ? parseNumber(offer.seats) : null,
            doors: offer.doors ? parseNumber(offer.doors) : null,
            steeringWheel: offer.steeringWheel || null,
            condition: offer.condition,
            color: offer.color,
            country: offer.country || null,
            vin: offer.vin || null,
            plate: offer.plate || null,
            firstRegistration: offer.firstRegistration || null,
            description: offer.description,
            price: parseNumber(offer.price),
            currency: offer.currency,
        };

        formData.append("offer", new Blob([JSON.stringify(offerDto)], { type: "application/json" }));

        return formData;
    };

    const handleAddOffer = async () => {
        if (isDisabled) return;

        if (!checkValues()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setFormErrorBanner(true);
            return;
        }
        setIsDisabled(true);
        setLoading(true);
        try {
            const offerData = await convertToOfferData(offer);
            const response = await addOffer(offerData);
            if (response.status === 201) {
                sessionStorage.setItem("offerAdded", "true");
                navigate('/details/myOffers');
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 422) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setInappropriateContentBanner(true);
                    console.error("Provided details are inappropriate")
                } else {
                    setWentWrongBanner(true);
                    console.error("Unexpected error during processing offer: ", error);
                }
            }
        } finally {
            setLoading(false);
            setIsDisabled(false);
        }
    };

    const handleUpdateOffer = async () => {
        if (isDisabled) return;

        if (!checkValues()) {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setFormErrorBanner(true);
            return;
        }
        setIsDisabled(true);
        setLoading(true);
        try {
            const offerData = await convertToOfferData(offer);
            const response = await updateOffer(id, offerData);
            if (response.status === 200) {
                sessionStorage.setItem("offerUpdated", "true");
                navigate("/details/myOffers");
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 422) {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setInappropriateContentBanner(true);
                } else if (error.response.status === 405) {
                    setWaitBanner(true);
                }  else if (error.response.status === 403) {
                    console.error("User has no permission to update offer");
                    navigate("/addingOffer");
                } else if (error.response.status === 404) {
                    console.error("Offer not found");
                    navigate("/addingOffer");
                } else {
                    setWentWrongBanner(true);
                    console.error("Unexpected error during processing offer: ", error);
                }
            }
        } finally {
            setLoading(false);
            setTimeout(() => setIsDisabled(false), 500);
        }
    };

    const handleDeleteOffer = async () => {
        if (isDisabled) return;
        setIsDisabled(true);
        setLoading(true);

        try {
            await deleteOffer(id);
            sessionStorage.setItem("offerDeleted", "true");
            navigate("/details/myOffers");
        } catch (error: unknown) {
            setWentWrongBanner(true);
            if (error instanceof ForbiddenError) {
                console.error("User has not permission to delete offer", error);
            } else if (error instanceof NotFoundError) {
                console.error("Offer not found", error);
            } else {
                console.error("Unexpected error during offer removal", error);
            }
        } finally {
            setLoading(false);
            setTimeout(() => setIsDisabled(false), 500);
        }
    };

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className={`flex flex-col items-center w-11/12 lg:w-10/12 max-w-[840px] lg:max-w-[1300px]
                 bg-lowLime border border-black border-opacity-10 rounded-sm`}>
                    <p className="text-3xl m:text-4xl mt-14 m:mt-16 mb-8 m:mb-10 text-center">
                        {id !== null && permission === true ? "Modifying offer" : "Adding offer"}
                    </p>
                    <div className="flex justify-center w-[90%] bg-white rounded-md border-2 border-gray-300">
                        <p className="w-full text-lg m:text-xl p-4 m:p-6">
                            We need some information about your car to interest possible customers!
                            You must fill fields marked with <FontAwesomeIcon className="mb-0.5 mr-1 m:mr-1.5 text-xs m:text-sm" icon={faAsterisk}/>
                            mark, but try to provide as many details as you can. Good luck!
                        </p>
                    </div>
                    <div className="flex flex-col items-center w-full max-w-[800px] m:pl-3 mt-20 m:mb-24">
                        <div className="flex justify-center m:block w-full mb-14 m:mb-16">
                            <BasicInput label="Title" type="text" value={offer.title} setValue={handleSetOffer("title")}
                                        required={true}
                                        error={error.title} message={message.title} maxLength={30} setToggled={handleSetToggled("title")}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label="Brand" options={carBrands} value={offer.brand} setValue={handleSetOffer("brand")}
                                         required={true} error={error.brand} message={message.brand} setToggled={handleSetToggled("brand")}/>
                            <SelectInput label="Model" options={carModels[offer.brand] ?? []} value={offer.model} setValue={handleSetOffer("model")}
                                         required={offer.brand !== "Other"} disabled={!carBrands.includes(offer.brand) || offer.brand === "Other"}
                                         error={error.model} message={message.model} setToggled={handleSetToggled("model")}/>
                            <SelectInput label="Body type" options={carBodyTypes} value={offer.bodyType} setValue={handleSetOffer("bodyType")}
                                         required={true} error={error.bodyType} message={message.bodyType} setToggled={handleSetToggled("bodyType")}/>
                            <SelectInput label="Year of production" options={carYears} value={offer.year} setValue={handleSetOffer("year")}
                                         required={true} error={error.year} message={message.year} setToggled={handleSetToggled("year")}/>
                            <BasicInput label="Mileage" type="number" value={offer.mileage} setValue={handleSetOffer("mileage")}
                                        required={true} error={error.mileage} message={message.mileage} symbol="km" setToggled={handleSetToggled("mileage")}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label="Fuel" options={carFuels} value={offer.fuel} setValue={handleSetOffer("fuel")} error={error.fuel}
                                         required={true} message={message.fuel} setToggled={handleSetToggled("fuel")}/>
                            <BasicInput label="Engine capacity" type="number" value={offer.capacity} setValue={handleSetOffer("capacity")}  error={error.capacity}
                                        required={true} message={message.capacity} symbol="cm3" setToggled={handleSetToggled("capacity")}/>
                            <BasicInput label="Engine power" type="number" value={offer.power} setValue={handleSetOffer("power")} error={error.power}
                                        required={true} message={message.power} symbol="HP" setToggled={handleSetToggled("power")}/>
                            <SelectInput label="Drive" options={carDrives} value={offer.drive} setValue={handleSetOffer("drive")} error={error.drive}
                                         required={true} message={message.drive} setToggled={handleSetToggled("drive")}/>
                            <ChooseInput label="Transmission" firstOption="Manual" secondOption="Automatic" value={offer.transmission} setValue={handleSetOffer("transmission")}
                                         error={error.transmission} required={true} message={message.transmission}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label="Color" options={carColors} value={offer.color} setValue={handleSetOffer("color")} error={error.color}
                                         required={true} message={message.color} setToggled={handleSetToggled("color")}/>
                            <ChooseInput label="Condition" firstOption="Undamaged" secondOption="Damaged" value={offer.condition} setValue={handleSetOffer("condition")}
                                         error={error.condition} required={true} message={message.condition}/>
                            <SelectInput label="Seats" options={carSeats} value={offer.seats} setValue={handleSetOffer("seats")}
                                         error={error.seats} message={message.seats}/>
                            <ChooseInput label="Steering wheel" firstOption="Left" secondOption="Right" value={offer.steeringWheel} setValue={handleSetOffer("steeringWheel")}
                                         error={error.steeringWheel} message={message.steeringWheel}/>
                            <SelectInput label="Doors" options={carDoors} value={offer.doors} setValue={handleSetOffer("doors")}
                                         error={error.doors} message={message.doors}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-10 m:mb-12">
                            <SelectInput label="Origin country" options={carCountries} value={offer.country}
                                         setValue={handleSetOffer("country")} error={error.country} message={message.country}/>
                            <BasicInput label="VIN" type="text" value={offer.vin} setValue={handleSetOffer("vin")}
                                        error={error.vin} message={message.vin} setToggled={handleSetToggled("vin")}/>
                            <BasicInput label="License plate" type="text" value={offer.plate} setValue={handleSetOffer("plate")}
                                        error={error.plate} message={message.plate} setToggled={handleSetToggled("plate")}/>
                            <BasicInput label="First registration" type="date" value={offer.firstRegistration} setValue={handleSetOffer("firstRegistration")}
                                        error={error.firstRegistration} message={message.firstRegistration} setToggled={handleSetToggled("firstRegistration")}/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-12 m:mb-14">
                            <DescriptionInput value={offer.description} setValue={handleSetOffer("description")}
                                              error={error.description} message={message.description} setToggled={handleSetToggled("description")}/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-8 m:mb-10">
                            <ImageInput photos={offer.photos} setPhotos={handleSetOffer("photos")}/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-20 m:mb-24">
                            <BasicInput label="Price" type="number" value={offer.price} setValue={handleSetOffer("price")} error={error.price}
                                        symbol={offer.currency} firstOtherSymbol="PLN" secondOtherSymbol="EURO" setSymbol={handleSetOffer("currency")}
                                        required={true} message={message.price} setToggled={handleSetToggled("price")}/>
                        </div>
                        <div className="flex justify-center m:block w-full mb-24 m:mb-28">
                            <ContactDetails/>
                        </div>
                        <div className="flex flex-row flex-wrap justify-center m:justify-start w-[97%] m:w-full gap-3 m:gap-4 mb-20 m:mb-24">
                            <SubmitOfferButton onClick={id !== null && permission === true ? handleUpdateOffer : handleAddOffer}
                                               type={id !== null && permission === true}/>
                            {id !== null && permission === true &&
                                <DeleteOfferButton onClick={handleDeleteOffer}/>
                            }
                        </div>
                    </div>
                </div>
                {formErrorBanner &&
                    <AnimatedBanner text={"Fill fields correctly"} onAnimationEnd={() => setFormErrorBanner(false)}
                                    delay={2000} color={"bg-coolRed"} z={"z-10"}/>}
                {inappropriateContentBanner &&
                    <AnimatedBanner text={"Title or description contains inappropriate content"}
                                    onAnimationEnd={() => setInappropriateContentBanner(false)} delay={4000} color={"bg-coolRed"} z={"z-10"}/>}
                {waitBanner && <AnimatedBanner text={"You need to wait a while before modifying offer again"} onAnimationEnd={() => setWaitBanner(false)}
                                               delay={4000} color={"bg-coolYellow"} z={"z-10"}/>}
                {wentWrongBanner && <AnimatedBanner text={"Something went wrong..."} onAnimationEnd={() => setWentWrongBanner(false)}
                                              delay={3000} color={"bg-coolYellow"} z={"z-10"}/>}
                {loading && <AddingOfferLoader/>}
            </div>
        </LayOut>
    );
}

export default OfferForm