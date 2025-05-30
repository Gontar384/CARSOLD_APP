import React, {useEffect, useRef, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import {carModels} from "./Atomic/SelectInput/SelectData/carModels.ts";
import {carBrands} from "./Atomic/SelectInput/SelectData/carBrands.ts";
import {carBodyTypes, carBodyTypesPl} from "./Atomic/SelectInput/SelectData/carBodyTypes.ts";
import {carYears} from "./Atomic/SelectInput/SelectData/carYears.ts";
import {carFuels, carFuelsPl} from "./Atomic/SelectInput/SelectData/carFuels.ts";
import {carDrives, carDrivesPl} from "./Atomic/SelectInput/SelectData/carDrives.ts";
import {carColors, carColorsPl} from "./Atomic/SelectInput/SelectData/carColors.ts";
import {carCountries, carCountriesPl} from "./Atomic/SelectInput/SelectData/carCountries.ts";
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
import {NotFoundError} from "../../ApiCalls/Errors/CustomErrors.ts";
import {useLanguage} from "../../GlobalProviders/Language/useLanguage.ts";
import {carTransmissions, carTransmissionsPl} from "../Search/SearchFilters/AdditionalData/carTransmissions.ts";
import {carConditions, carConditionsPl} from "../Search/SearchFilters/AdditionalData/carConditions.ts";
import {carSteeringWheel, carSteeringWheelPl} from "./Atomic/SelectInput/SelectData/carSteeringWheel.ts";
import * as nsfwjs from 'nsfwjs';
import OfferFormLoader from "../../Additional/Loading/OfferFormLoader.tsx";
import {useUtil} from "../../GlobalProviders/Util/useUtil.ts";

const OfferForm: React.FC = () => {
    const {t, language, translate, translateForBackend} = useLanguage();
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
        title: t("offerForm4"),
        brand: t("offerForm5"),
        model: t("offerForm6"),
        bodyType: t("offerForm7"),
        year: t("offerForm8"),
        mileage: t("offerForm9"),
        fuel: t("offerForm10"),
        capacity: t("offerForm11"),
        power: t("offerForm12"),
        drive: t("offerForm13"),
        transmission: t("offerForm14"),
        color: t("offerForm15"),
        condition: t("offerForm16"),
        seats: t("offerForm17"),
        steeringWheel: t("offerForm18"),
        doors: t("offerForm19"),
        country: t("offerForm20"),
        vin: t("offerForm21"),
        plate: t("offerForm22"),
        firstRegistration: t("offerForm23"),
        description: t("offerForm24"),
        price: t("offerForm25"),
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
    const [tooManyBanner, setTooManyBanner] = useState<boolean>(false);
    document.title = `CARSOLD | ${(id !== null && permission === true) ? t("tabTitle12") : t("tabTitle11")}`
    const {isMobile} = useUtil();
    const nsfwModelRef = useRef<nsfwjs.NSFWJS | null>(null);
    const [modelLoading, setModelLoading] = useState<boolean>(true);
    const [tooLarge, setTooLarge] = useState<boolean>(false);

    useEffect(() => {
        const loadModel = async () => {
            setModelLoading(true);
            const originalConsoleInfo = console.info;
            console.info = () => {};

            const loadPromise = nsfwjs.load().then(model => {
                nsfwModelRef.current = model;
            });
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Model loading timeout")), 7000);
            });
            try {
                await Promise.race([loadPromise, timeoutPromise]);
            } catch (error) {
                console.error("Failed to load NSFW model:", error);
            } finally {
                console.info = originalConsoleInfo;
                setModelLoading(false);
            }
        };
        loadModel();
    }, []);  //loading NSFW model to check images before upload

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
                title: t("offerForm4"),
                brand: t("offerForm5"),
                model: t("offerForm6"),
                bodyType: t("offerForm7"),
                year: t("offerForm8"),
                mileage: t("offerForm9"),
                fuel: t("offerForm10"),
                capacity: t("offerForm11"),
                power: t("offerForm12"),
                drive: t("offerForm13"),
                transmission: t("offerForm14"),
                color: t("offerForm15"),
                condition: t("offerForm16"),
                seats: t("offerForm17"),
                steeringWheel: t("offerForm18"),
                doors: t("offerForm19"),
                country: t("offerForm20"),
                vin: t("offerForm21"),
                plate: t("offerForm22"),
                firstRegistration: t("offerForm23"),
                description: t("offerForm24"),
                price: t("offerForm25"),
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

    useEffect(() => {
        setMessage({
            title: t("offerForm4"),
            brand: t("offerForm5"),
            model: t("offerForm6"),
            bodyType: t("offerForm7"),
            year: t("offerForm8"),
            mileage: t("offerForm9"),
            fuel: t("offerForm10"),
            capacity: t("offerForm11"),
            power: t("offerForm12"),
            drive: t("offerForm13"),
            transmission: t("offerForm14"),
            color: t("offerForm15"),
            condition: t("offerForm16"),
            seats: t("offerForm17"),
            steeringWheel: t("offerForm18"),
            doors: t("offerForm19"),
            country: t("offerForm20"),
            vin: t("offerForm21"),
            plate: t("offerForm22"),
            firstRegistration: t("offerForm23"),
            description: t("offerForm24"),
            price: t("offerForm25"),
        });
        setOffer(prev => ({
            ...prev,
            bodyType: translate("bodyType", offer.bodyType) ?? "",
            fuel: translate("fuel", offer.fuel) ?? "",
            drive: translate("drive", offer.drive) ?? "",
            transmission: translate("transmission", offer.transmission) ?? "",
            color: translate("color", offer.color) ?? "",
            condition: translate("condition", offer.condition) ?? "",
            steeringWheel: translate("steeringWheel", offer.steeringWheel) ?? "",
            country: translate("country", offer.country) ?? ""
        }));
    }, [language]) //changes messages when language changes

    //those work when /modifyingOffer/{id}
    useEffect(() => {
        if (section) {
            const numericId = Number(section.replace(/,/g, ''));
            if (!isNaN(numericId)) setId(numericId);
        }
    }, [section]);  //gets id from section

    useEffect(() => {
        const handleFetchOfferData = async (id: number) => {
            const offerData = await handleFetchOffer(id);
            setData(offerData);
            setPermission(offerData.permission ?? false);
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
                bodyType: language === "POL" && data.bodyType ? translate("bodyType", data.bodyType) : data.bodyType ?? "",
                year: String(data.year ?? ""),
                mileage: formatNumber(String(data.mileage ?? "")),
                fuel: language === "POL" && data.fuel ? translate("fuel", data.fuel) : data.fuel ?? "",
                capacity: formatNumber(String(data.capacity ?? "")),
                power: formatNumber(String(data.power ?? "")),
                drive: language === "POL" && data.drive ? translate("drive", data.drive) : data.drive ?? "",
                transmission: language === "POL" && data.transmission ? translate("transmission", data.transmission) : data.transmission ?? "",
                color: language === "POL" && data.color ? translate("color", data.color) : data.color ?? "",
                condition: language === "POL" && data.condition ? translate("condition", data.condition) : data.condition ?? "",
                seats: String(data.seats ?? ""),
                doors: String(data.doors ?? ""),
                steeringWheel: language === "POL" && data.steeringWheel ? translate("steeringWheel", data.steeringWheel) : data.steeringWheel ?? "",
                country: language === "POL" && data.country ? translate("country", data.country) : data.country ?? "",
                vin: data.vin ?? "",
                plate: data.plate ?? "",
                firstRegistration: String(data.firstRegistration ?? ""),
                description: data.description ?? "",
                photos: (data.photos || [])
                    .concat(Array(8).fill(""))
                    .slice(0, 8),
                price: formatNumber(String(data.price ?? "")),
                currency: data.currency ?? "",
            };
            setOffer(transformedOffer);
        } else if (permission === false) {
            navigate("/addingOffer");
        }
    }, [data, permission]);  //transfers data to object for updating offer purpose

    //helper methods
    const handleSetOffer = (key: keyof typeof offer) => (setValue: React.SetStateAction<string> | React.SetStateAction<string[]>) => {
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

    const handleSetToggled = (key: keyof typeof toggled) => (setValue: React.SetStateAction<boolean>) => {
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
                setMessageField("title", t("offerForm27"));
            } else if (!/[a-zA-Z0-9]/.test(offer.title)) {
                setErrorField("title", true);
                setMessageField("title", t("offerForm28"));
            } else if (offer.title.length < 5) {
                setErrorField("title", true);
                setMessageField("title", t("offerForm29"));
            }
            setToggledField("title", false);
        }
    }, [toggled.title]);

    useEffect(() => {
        if (offer.title.length <= 30) {
            if ((offer.title.match(/[A-Z]/g) || []).length > 10) {
                setErrorField("title", true);
                setMessageField("title", t("offerForm30"));
            } else {
                setErrorField("title", false);
                setMessageField("title", t("offerForm4"));
            }
        } else {
            setErrorField("title", true);
            setMessageField("title", t("offerForm31"));
        }
    }, [offer.title]);

    //brand
    useEffect(() => {
        if (toggled.brand) {
            if (offer.brand === "") {
                setErrorField("brand", true);
                setMessageField("brand", t("offerForm32"));
            } else {
                setErrorField("brand", false);
                setMessageField("brand", t("offerForm5"));
            }
            setToggledField("brand", false);
        }
    }, [toggled.brand]);

    //model
    useEffect(() => {
        if (toggled.model) {
            if (offer.model === "") {
                setErrorField("model", true);
                setMessageField("model", t("offerForm33"));
            } else {
                setErrorField("model", false);
                setMessageField("model", t("offerForm6"));
            }
            setToggledField("model", false);
        }
    }, [toggled.model]);

    //to reset model when brand changes
    useEffect(() => {
        if (!carModels[offer.brand]?.includes(offer.model)) {
            setOffer(prev => ({...prev, model: ""}));
            setErrorField("model", false);
            setMessageField("model", t("offerForm6"));
        }
    }, [offer.brand]);

    //bodyType
    useEffect(() => {
        if (toggled.bodyType) {
            if (offer.bodyType === "") {
                setErrorField("bodyType", true);
                setMessageField("bodyType", t("offerForm34"));
            } else {
                setErrorField("bodyType", false);
                setMessageField("bodyType", t("offerForm7"));
            }
            setToggledField("bodyType", false);
        }
    }, [toggled.bodyType]);

    //year
    useEffect(() => {
        if (toggled.year) {
            if (offer.year === "") {
                setErrorField("year", true);
                setMessageField("year", t("offerForm35"));
            } else {
                setErrorField("year", false);
                setMessageField("year", t("offerForm8"));
            }
            setToggledField("year", false);
        }
    }, [toggled.year]);

    //mileage
    useEffect(() => {
        if (toggled.mileage) {
            if (offer.mileage === "") {
                setErrorField("mileage", true);
                setMessageField("mileage", t("offerForm36"));
            }
            setToggledField("mileage", false);
        }
    }, [toggled.mileage]);

    useEffect(() => {
        if (offer.mileage.length > 9) {
            setErrorField("mileage", true);
            setMessageField("mileage", t("offerForm37"));
        } else {
            setErrorField("mileage", false);
            setMessageField("mileage", t("offerForm9"));
        }
    }, [offer.mileage]);

    //fuel
    useEffect(() => {
        if (toggled.fuel) {
            if (offer.fuel === "") {
                setErrorField("fuel", true);
                setMessageField("fuel", t("offerForm38"));
            } else {
                setErrorField("fuel", false);
                setMessageField("fuel", t("offerForm10"));
            }
            setToggledField("fuel", false);
        }
    }, [toggled.fuel]);

    //capacity
    useEffect(() => {
        if (toggled.capacity) {
            if (offer.capacity === "") {
                setErrorField("capacity", true);
                setMessageField("capacity", t("offerForm39"));
            } else if (offer.capacity.length < 3) {
                setErrorField("capacity", true);
                setMessageField("capacity", t("offerForm40"));
            }
            setToggledField("capacity", false);
        }
    }, [toggled.capacity]);

    useEffect(() => {
        if (offer.capacity.length > 6) {
            setErrorField("capacity", true);
            setMessageField("capacity", t("offerForm40"));
        } else {
            setErrorField("capacity", false);
            setMessageField("capacity", t("offerForm11"));
        }
    }, [offer.capacity]);

    //power
    useEffect(() => {
        if (toggled.power) {
            if (offer.power === "") {
                setErrorField("power", true);
                setMessageField("power", t("offerForm41"));
            }
            setToggledField("power", false);
        }
    }, [toggled.power]);

    useEffect(() => {
        if (offer.power.length > 5) {
            setErrorField("power", true);
            setMessageField("power", t("offerForm42"));
        } else {
            setErrorField("power", false);
            setMessageField("power", t("offerForm12"));
        }
    }, [offer.power]);

    //drive
    useEffect(() => {
        if (toggled.drive) {
            if (offer.drive === "") {
                setErrorField("drive", true);
                setMessageField("drive", t("offerForm43"));
            } else {
                setErrorField("drive", false);
                setMessageField("drive", t("offerForm13"));
            }
            setToggledField("drive", false);
        }
    }, [toggled.drive]);

    //transmission
    useEffect(() => {
        if (offer.transmission !== "") {
            setErrorField("transmission", false);
            setMessageField("transmission", t("offerForm14"))
        }
    }, [offer.transmission]);

    //color
    useEffect(() => {
        if (toggled.color) {
            if (offer.color === "") {
                setErrorField("color", true);
                setMessageField("color", t("offerForm44"));
            } else {
                setErrorField("color", false);
                setMessageField("color", t("offerForm15"));
            }
            setToggledField("color", false);
        }
    }, [toggled.color]);

    //condition
    useEffect(() => {
        if (offer.condition !== "") {
            setErrorField("condition", false);
            setMessageField("condition", t("offerForm16"))
        }
    }, [offer.condition]);

    //vin
    useEffect(() => {
        if (toggled.vin) {
            if (offer.vin === "") {
                setToggledField("vin", false);
                setErrorField("vin", false);
                setMessageField("vin", t("offerForm21"));
                return;
            }
            const vinRegex = /^[A-Z0-9]{17}$/;
            if (vinRegex.test(offer.vin)) {
                setErrorField("vin", false);
                setMessageField("vin", t("offerForm21"));
            } else {
                setErrorField("vin", true);
                setMessageField("vin", t("offerForm45"));
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
                setMessageField("plate", t("offerForm22"));
                return;
            }
            const plateRegex = /^[A-Z0-9]{4,8}$/;
            if (plateRegex.test(offer.plate)) {
                setErrorField("plate", false);
                setMessageField("plate", t("offerForm22"));
            } else {
                setErrorField("plate", true);
                setMessageField("plate", t("offerForm46"));
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
                setMessageField("firstRegistration", t("offerForm23"));
                return;
            }
            const year = Number(offer.firstRegistration.split("-")[0]);
            if (year >= 1900 && year <= 2025) {
                setErrorField("firstRegistration", false);
                setMessageField("firstRegistration", t("offerForm23"));
            } else {
                setErrorField("firstRegistration", true);
                setMessageField("firstRegistration", t("offerForm47"));
            }
            setToggledField("firstRegistration", false);
        }
    }, [toggled.firstRegistration]);

    //description
    useEffect(() => {
        if (toggled.description) {
            if (offer.description === "") {
                setErrorField("description", true);
                setMessageField("description", t("offerForm48"));
            } else if (!/[a-zA-Z0-9]/.test(offer.description)) {
                setErrorField("description", true);
                setMessageField("description", t("offerForm50"));
            } else if (offer.description.length < 30) {
                setErrorField("description", true);
                setMessageField("description", t("offerForm49"));
            }
            setToggledField("description", false);
        }
    }, [toggled.description]);

    useEffect(() => {
        if (offer.description.length > 2000) {
            setErrorField("description", true);
            setMessageField("description", t("offerForm51"));
        } else {
            setErrorField("description", false);
            setMessageField("description", t("offerForm24"));
        }
    }, [offer.description]);

    //price
    useEffect(() => {
        if (toggled.price) {
            if (offer.price === "") {
                setErrorField("price", true);
                setMessageField("price", t("offerForm52"));
            } else if (offer.price.length < 3) {
                setErrorField("price", true);
                setMessageField("price", t("offerForm53"));
            }
            setToggledField("price", false);
        }
    }, [toggled.price]);

    useEffect(() => {
        if (offer.price.length > 12) {
            setErrorField("price", true);
            setMessageField("price", t("offerForm53"));
        } else {
            setErrorField("price", false);
            setMessageField("price", t("offerForm25"));
        }
    }, [offer.price]);

    //offer logic
    //checks if values are valid before commiting
    const checkValues= () => {
        let isValid = true;

        if (offer.title === "") {
            setErrorField("title", true);
            setMessageField("title", t("offerForm27"))
            isValid = false;
        } else if (!/[a-zA-Z0-9]/.test(offer.title)) {
            setErrorField("title", true);
            setMessageField("title", t("offerForm28"));
            isValid = false;
        } else if (offer.title.length < 5) {
            setErrorField("title", true);
            setMessageField("title", t("offerForm29"));
            isValid = false;
        } else if (offer.title.length > 30) {
            setErrorField("title", true);
            setMessageField("title", t("offerForm31"));
            isValid = false;
        } else if ((offer.title.match(/[A-Z]/g) || []).length > 10) {
            setErrorField("title", true);
            setMessageField("title", t("offerForm30"));
            isValid = false;
        }
        if (offer.brand === "" || !carBrands.includes(offer.brand)) {
            setErrorField("brand", true);
            setMessageField("brand", t("offerForm32"))
            isValid = false;
        }
        if (offer.model === "" || !carModels[offer.brand].includes(offer.model)) {
            setErrorField("model", true);
            setMessageField("model", t("offerForm33"));
            isValid = false;
        }
        if (offer.bodyType === "" || (!carBodyTypes.includes(offer.bodyType) && !carBodyTypesPl.includes(offer.bodyType))) {
            setErrorField("bodyType", true);
            setMessageField("bodyType", t("offerForm34"));
            isValid = false;
        }
        if (offer.year === "" || !carYears.includes(offer.year)) {
            setErrorField("year", true);
            setMessageField("year", t("offerForm35"));
            isValid = false;
        }
        if (offer.mileage === "") {
            setErrorField("mileage", true);
            setMessageField("mileage", t("offerForm36"));
            isValid = false;
        } else if (offer.mileage.length > 9) {
            setErrorField("mileage", true);
            setMessageField("mileage", t("offerForm37"));
            isValid = false;
        }
        if (offer.fuel === "" || (!carFuels.includes(offer.fuel) && !carFuelsPl.includes(offer.fuel))) {
            setErrorField("fuel", true);
            setMessageField("fuel", t("offerForm38"));
            isValid = false;
        }
        if (offer.capacity === "") {
            setErrorField("capacity", true);
            setMessageField("capacity", t("offerForm39"));
            isValid = false;
        } else if (offer.capacity.length < 3) {
            setErrorField("capacity", true);
            setMessageField("capacity", t("offerForm40"));
            isValid = false;
        } else if (offer.capacity.length > 6) {
            setErrorField("capacity", true);
            setMessageField("capacity", t("offerForm40"));
            isValid = false;
        }
        if (offer.power === "") {
            setErrorField("power", true);
            setMessageField("power", t("offerForm41"));
            isValid = false;
        } else if (offer.power.length > 5) {
            setErrorField("power", true);
            setMessageField("power", t("offerForm42"));
            isValid = false;
        }
        if (offer.drive === "" || (!carDrives.includes(offer.drive) && !carDrivesPl.includes(offer.drive))) {
            setErrorField("drive", true);
            setMessageField("drive", t("offerForm43"));
            isValid = false;
        }
        if (offer.transmission === "" || ![t("offerForm60"), t("offerForm61")].includes(offer.transmission)) {
            setErrorField("transmission", true);
            setMessageField("transmission", t("offerForm54"));
            isValid = false;
        }
        if (offer.color === "" || (!carColors.includes(offer.color) && !carColorsPl.includes(offer.color))) {
            setErrorField("color", true);
            setMessageField("color", t("offerForm44"));
            isValid = false;
        }
        if (offer.condition === "" || ![t("offerForm62"), t("offerForm63")].includes(offer.condition)) {
            setErrorField("condition", true);
            setMessageField("condition", t("offerForm55"));
            isValid = false;
        }
        if (offer.seats !== "" && !carSeats.includes(offer.seats)) {
            setErrorField("seats", true);
            setMessageField("seats", t("offerForm56"));
            isValid = false;
        }
        if (offer.doors !== "" && !carDoors.includes(offer.doors)) {
            setErrorField("doors", true);
            setMessageField("doors", t("offerForm57"));
            isValid = false;
        }
        if (offer.steeringWheel !== "" && ![t("offerForm64"), t("offerForm65")].includes(offer.steeringWheel)) {
            setErrorField("steeringWheel", true);
            setMessageField("steeringWheel", t("offerForm58"));
            isValid = false;
        }
        if (offer.country !== "" && !carCountries.includes(offer.country) && !carCountriesPl.includes(offer.country)) {
            setErrorField("country", true);
            setMessageField("country", t("offerForm59"));
            isValid = false;
        }
        if (offer.vin !== "" && !/^[A-Z0-9]{17}$/.test(offer.vin)) {
            setErrorField("vin", true);
            setMessageField("vin", t("offerForm45"));
            isValid = false;
        }
        if (offer.plate !== "" && !/^[A-Z0-9]{4,8}$/.test(offer.plate)) {
            setErrorField("plate", true);
            setMessageField("plate", t("offerForm46"));
            isValid = false;
        }
        if (offer.firstRegistration !== "") {
            const year = Number(offer.firstRegistration.split("-")[0]);
            if (year < 1900 && year > 2025) {
                setErrorField("firstRegistration", true);
                setMessageField("firstRegistration", t("offerForm47"));
                isValid = false;
            }
        }
        if (offer.description === "") {
            setErrorField("description", true);
            setMessageField("description", t("offerForm48"));
            isValid = false;
        } else if (!/[a-zA-Z0-9]/.test(offer.description)) {
            setErrorField("description", true);
            setMessageField("description", t("offerForm50"));
            isValid = false;
        } else if (offer.description.length < 30) {
            setErrorField("description", true);
            setMessageField("description", t("offerForm49"));
            isValid = false;
        } else if (offer.description.length > 2000) {
            setErrorField("description", true);
            setMessageField("description", t("offerForm51"));
            isValid = false;
        }
        if (offer.price === "") {
            setErrorField("price", true);
            setMessageField("price", t("offerForm52"));
            isValid = false;
        } else if (offer.price.length < 3 || offer.price.length > 12) {
            setErrorField("price", true);
            setMessageField("price", t("offerForm53"));
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
                    if (blob.size > 5 * 1024 * 1024) {
                        console.warn(`File at index ${index} is too large, skipping.`);
                        continue;
                    }
                    let isNSFW: boolean = false;
                    if (nsfwModelRef.current) {
                        const imageBitmap = await createImageBitmap(blob);
                        const canvas = document.createElement("canvas");
                        canvas.width = imageBitmap.width;
                        canvas.height = imageBitmap.height;
                        const ctx = canvas.getContext("2d");
                        ctx?.drawImage(imageBitmap, 0, 0);

                        const predictions = await nsfwModelRef.current.classify(canvas);
                        const pornScore = predictions.find(p => p.className === "Porn")?.probability || 0;

                        if (pornScore > 0.1) {
                            console.warn(`NSFW image at index ${index}, skipping.`);
                            isNSFW = true;
                        }
                    }

                    if (!isNSFW) {
                        const filename = `photo${index}.${blob.type.split("/")[1]}`;
                        formData.append("photos", blob, filename);
                    }
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
            bodyType: translateForBackend("bodyType", offer.bodyType),
            year: parseNumber(offer.year),
            mileage: parseNumber(offer.mileage),
            fuel: translateForBackend("fuel", offer.fuel),
            capacity: parseNumber(offer.capacity),
            power: parseNumber(offer.power),
            drive: translateForBackend("drive", offer.drive),
            transmission: translateForBackend("transmission", offer.transmission),
            seats: offer.seats ? parseNumber(offer.seats) : null,
            doors: offer.doors ? parseNumber(offer.doors) : null,
            steeringWheel: translateForBackend("steeringWheel", offer.steeringWheel) || null,
            condition: translateForBackend("condition", offer.condition),
            color: translateForBackend("color", offer.color),
            country: translateForBackend("country", offer.country) || null,
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
            if (error instanceof AxiosError) {
                if (error.response) {
                    if (error.response.status === 422) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setInappropriateContentBanner(true);
                        console.error("Provided details are inappropriate: ", error);
                    } else if (error.response.status === 405) {
                        setTooManyBanner(true);
                        console.error("Couldn't add, you've added too many offers yet: ", error);
                    } else if (error.response.status === 415) {
                        setWentWrongBanner(true);
                        console.error("Couldn't add, provided image has wrong format: ", error);
                    } else if (error.response.status === 413) {
                        setTooLarge(true);
                        console.error("Couldn't add, at least one image is too large: ", error);
                    } else {
                        setWentWrongBanner(true);
                        console.error("Unexpected error when processing offer: ", error);
                    }
                } else if (error.code === "ERR_NETWORK") {
                    setTooLarge(true);
                    console.error("Cannot be processed - images may be too large: ", error);
                }
            }
        } finally {
            setLoading(false);
            setTimeout(() => setIsDisabled(false), 500);
        }
    };

    const handleUpdateOffer = async () => {
        if (isDisabled) return;
        if (!permission) {
            navigate("/details/myOffers");
            return;
        }
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
            if (error instanceof AxiosError) {
                if (error.response) {
                    if (error.response.status === 422) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setInappropriateContentBanner(true);
                        console.error("Provided details are inappropriate: ", error);
                    } else if (error.response.status === 405) {
                        setTooManyBanner(true);
                        console.error("Couldn't add, you've added too many offers yet: ", error);
                    } else if (error.response.status === 415) {
                        setWentWrongBanner(true);
                        console.error("Couldn't add, provided image has wrong format: ", error);
                    } else if (error.response.status === 413) {
                        setTooLarge(true);
                        console.error("Couldn't add, at least one image is too large: ", error);
                    } else {
                        setWentWrongBanner(true);
                        console.error("Unexpected error when processing offer: ", error);
                    }
                } else if (error.code === "ERR_NETWORK") {
                    setTooLarge(true);
                    console.error("Cannot be processed - images may be too large: ", error);
                }
            }
        } finally {
            setLoading(false);
            setTimeout(() => setIsDisabled(false), 500);
        }
    };

    const handleDeleteOffer = async () => {
        if (isDisabled) return;
        if (!permission) {
            navigate("/details/myOffers");
            return;
        }

        setIsDisabled(true);
        setLoading(true);
        try {
            await deleteOffer(id);
            sessionStorage.setItem("offerDeleted", "true");
            navigate("/details/myOffers");
        } catch (error: unknown) {
            setWentWrongBanner(true);
            if (error instanceof NotFoundError) {
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
                <div className={`flex flex-col items-center w-full lg:w-10/12 max-w-[840px] lg:max-w-[1300px]
                 bg-lowLime ${isMobile ? "border-y" : "border"} border-gray-300 rounded-sm`}>
                    <p className="text-3xl m:text-4xl mt-14 m:mt-16 mb-8 m:mb-10 text-center">
                        {id !== null && permission === true ? t("offerForm1") : t("offerForm2")}
                    </p>
                    <div className="flex justify-center w-[80%] bg-white rounded-md border-2 border-gray-300">
                        <p className="w-full text-lg m:text-xl p-4 m:p-6 text-center">
                            {t("offerForm3")}
                        </p>
                    </div>
                    <div className="flex flex-col items-center w-full max-w-[800px] m:pl-3 mt-20 m:mb-24">
                        <div className="flex justify-center m:block w-full mb-14 m:mb-16">
                            <BasicInput label={t("offerForm26")} type="text" value={offer.title} setValue={handleSetOffer("title")} required={true}
                                        error={error.title} message={message.title} maxLength={30} setToggled={handleSetToggled("title")}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label={t("offerForm66")} options={carBrands} value={offer.brand} setValue={handleSetOffer("brand")}
                                         required={true} error={error.brand} message={message.brand} setToggled={handleSetToggled("brand")}/>
                            <SelectInput label="Model" options={carModels[offer.brand] ?? []} value={offer.model} setValue={handleSetOffer("model")}
                                         required={true} disabled={!carBrands.includes(offer.brand)} error={error.model} message={message.model} setToggled={handleSetToggled("model")}/>
                            <SelectInput label={t("offerForm67")} options={language === "ENG" ? carBodyTypes : carBodyTypesPl} value={offer.bodyType} setValue={handleSetOffer("bodyType")}
                                         required={true} error={error.bodyType} message={message.bodyType} setToggled={handleSetToggled("bodyType")}/>
                            <SelectInput label={t("offerForm68")} options={carYears} value={offer.year} setValue={handleSetOffer("year")} numericOnly={true}
                                         required={true} error={error.year} message={message.year} setToggled={handleSetToggled("year")}/>
                            <BasicInput label={t("offerForm69")} type="number" value={offer.mileage} setValue={handleSetOffer("mileage")}
                                        required={true} error={error.mileage} message={message.mileage} symbol="km" setToggled={handleSetToggled("mileage")}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label={t("offerForm70")} options={language === "ENG" ? carFuels : carFuelsPl} value={offer.fuel} setValue={handleSetOffer("fuel")} error={error.fuel}
                                         required={true} message={message.fuel} setToggled={handleSetToggled("fuel")}/>
                            <BasicInput label={t("offerForm71")} type="number" value={offer.capacity} setValue={handleSetOffer("capacity")}  error={error.capacity}
                                        required={true} message={message.capacity} symbol="cm3" setToggled={handleSetToggled("capacity")}/>
                            <BasicInput label={t("offerForm72")} type="number" value={offer.power} setValue={handleSetOffer("power")} error={error.power}
                                        required={true} message={message.power} symbol={t("offerForm96")} setToggled={handleSetToggled("power")}/>
                            <SelectInput label={t("offerForm73")} options={language === "ENG" ? carDrives : carDrivesPl} value={offer.drive} setValue={handleSetOffer("drive")} error={error.drive}
                                         required={true} message={message.drive} setToggled={handleSetToggled("drive")}/>
                            <ChooseInput label={t("offerForm74")} firstOption={language === "ENG" ? carTransmissions[0] : carTransmissionsPl[0]} secondOption={language === "ENG" ? carTransmissions[1] : carTransmissionsPl[1]}
                                         value={offer.transmission} setValue={handleSetOffer("transmission")}
                                         error={error.transmission} required={true} message={message.transmission}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-12 m:mb-14">
                            <SelectInput label={t("offerForm75")} options={language === "ENG" ? carColors : carColorsPl} value={offer.color} setValue={handleSetOffer("color")} error={error.color}
                                         required={true} message={message.color} setToggled={handleSetToggled("color")}/>
                            <ChooseInput label={t("offerForm76")} firstOption={language === "ENG" ? carConditions[0] : carConditionsPl[0]} secondOption={language === "ENG" ? carConditions[1] : carConditionsPl[1]}
                                         value={offer.condition} setValue={handleSetOffer("condition")}
                                         error={error.condition} required={true} message={message.condition}/>
                            <SelectInput label={t("offerForm77")} options={carSeats} value={offer.seats} setValue={handleSetOffer("seats")}
                                         error={error.seats} message={message.seats} numericOnly={true}/>
                            <ChooseInput label={t("offerForm78")} firstOption={language === "ENG" ? carSteeringWheel[0] : carSteeringWheelPl[0]} secondOption={language === "ENG" ? carSteeringWheel[1] : carSteeringWheelPl[1]}
                                         value={offer.steeringWheel} setValue={handleSetOffer("steeringWheel")}
                                         error={error.steeringWheel} message={message.steeringWheel}/>
                            <SelectInput label={t("offerForm79")} options={carDoors} value={offer.doors} setValue={handleSetOffer("doors")}
                                         error={error.doors} message={message.doors} numericOnly={true}/>
                        </div>
                        <div className="flex flex-col items-center m:grid grid-col-1 md:grid-cols-2 w-full gap-y-7 m:gap-y-8 mb-10 m:mb-12">
                            <SelectInput label={t("offerForm80")} options={language === "ENG" ? carCountries : carCountriesPl} value={offer.country}
                                         setValue={handleSetOffer("country")} error={error.country} message={message.country}/>
                            <BasicInput label="VIN" type="text" value={offer.vin} setValue={handleSetOffer("vin")}
                                        error={error.vin} message={message.vin} setToggled={handleSetToggled("vin")}/>
                            <BasicInput label={t("offerForm81")} type="text" value={offer.plate} setValue={handleSetOffer("plate")}
                                        error={error.plate} message={message.plate} setToggled={handleSetToggled("plate")}/>
                            <BasicInput label={t("offerForm82")} type="date" value={offer.firstRegistration} setValue={handleSetOffer("firstRegistration")}
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
                            <BasicInput label={t("offerForm84")} type="number" value={offer.price} setValue={handleSetOffer("price")} error={error.price}
                                        symbol={offer.currency} firstOtherSymbol="PLN" secondOtherSymbol="EUR" setSymbol={handleSetOffer("currency")}
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
                    <AnimatedBanner text={t("animatedBanner13")} onAnimationEnd={() => setFormErrorBanner(false)}
                                    delay={2000} color={"bg-coolRed"} z={"z-10"}/>}
                {inappropriateContentBanner &&
                    <AnimatedBanner text={t("animatedBanner14")}
                                    onAnimationEnd={() => setInappropriateContentBanner(false)} delay={4000} color={"bg-coolRed"} z={"z-10"}/>}
                {waitBanner && <AnimatedBanner text={t("animatedBanner15")} onAnimationEnd={() => setWaitBanner(false)}
                                               delay={4000} color={"bg-coolYellow"} z={"z-10"}/>}
                {wentWrongBanner && <AnimatedBanner text={t("animatedBanner1")} onAnimationEnd={() => setWentWrongBanner(false)}
                                              delay={3000} color={"bg-coolYellow"} z={"z-10"}/>}
                {tooManyBanner && <AnimatedBanner text={t("animatedBanner16")} onAnimationEnd={() => setTooManyBanner(false)}
                                                    delay={6000} color={"bg-coolYellow"} z={"z-10"}/>}
                {tooLarge && <AnimatedBanner text={t("animatedBanner18")} onAnimationEnd={() => setTooLarge(false)}
                                             delay={4000} color={"bg-coolYellow"} z={"z-10"}/>}
                {loading && <AddingOfferLoader/>}
                {modelLoading && <OfferFormLoader/>}
            </div>
        </LayOut>
    );
}

export default OfferForm