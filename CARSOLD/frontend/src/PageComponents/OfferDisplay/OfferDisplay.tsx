import React, {useEffect, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useOfferUtil} from "../../CustomHooks/useOfferUtil.ts";
import ImageDisplay from "./BigContainer/ImageDisplay/ImageDisplay.tsx";
import UserInformation from "./SmallContainer/UserInformation/UserInformation.tsx";
import OfferDetails from "./BigContainer/OfferDetails/OfferDetails.tsx";
import BaseInfo from "./SmallContainer/BaseInfo/BaseInfo.tsx";
import OfferSmallLoader from "../../Additional/Loading/OfferSmallLoader.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFlag, faHeart, faTrash} from "@fortawesome/free-solid-svg-icons";
import {useButton} from "../../CustomHooks/useButton.ts";
import {useAuth} from "../../GlobalProviders/Auth/useAuth.ts";
import ConfirmDeleteWindow from "../AddingOffer/Atomic/Button/ConfirmDeleteWindow/ConfirmDeleteWindow.tsx";
import {adminDeleteOffer} from "../../ApiCalls/Services/OfferService.ts";
import {MethodNotAllowedError, NotFoundError} from "../../ApiCalls/Errors/CustomErrors.ts";
import ReportOffer from "./BigContainer/OfferDetails/Report/ReportOffer.tsx";
import AnimatedBanner from "../../Additional/Banners/AnimatedBanner.tsx";

const OfferDisplay: React.FC = () => {
    document.title = "CARSOLD | Offer"
    interface FetchedOffer {
        id: number | null;
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
        createdOn: string;
        price: string;
        currency: string;
        username: string;
        profilePic: string;
        name: string;
        phone: string;
        city: string;
        permission: boolean;
        coordinates: string;
        role: string;
    }
    const {section} = useParams();
    const [id, setId] = useState<number | null>(null);
    const {handleFetchOfferWithUser, offerFetched, handleFollowAndCheck, followed} = useOfferUtil();
    const [offer, setOffer] = useState<FetchedOffer>({
        id: null,
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
        photos: [],
        createdOn: "",
        price: "",
        currency: "",
        username: "",
        profilePic: "",
        name: "",
        phone: "",
        city: "",
        permission: false,
        coordinates: "",
        role: "",
    });
    const navigate = useNavigate();
    const {bindHoverHandlers, buttonColor} = useButton();
    const {isAuthenticated} = useAuth();
    const [disabled, setDisabled] = useState<boolean>(false);
    const [decision, setDecision] = useState<boolean>(false);
    const [report, setReport] = useState<boolean>(false);
    const [reported, setReported] = useState<boolean>(false);
    const [hasReported, setHasReported] = useState<boolean>(false);

    useEffect(() => {
        if (section) {
            const numericId = Number(section.replace(/,/g, ''));
            if (!isNaN(numericId)) setId(numericId);
        } else navigate("/home");
    }, [section]);  //gets id from section

    const formatNumber = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        const manageHandleFetchOfferWithUser = async (id: number) => {
          const data = await handleFetchOfferWithUser(id);
            const transformedOffer: FetchedOffer = {
                id: data.id ?? null,
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
                photos: data.photos ?? "",
                createdOn: data.createdOn ?? "",
                price: formatNumber(String(data.price ?? "")),
                currency: data.currency ?? "",
                username: data.username ?? "",
                profilePic: data.profilePic ?? "",
                name: data.name ?? "",
                phone: data.phone ?? "",
                city: data.city ?? "",
                permission: data.permission ?? false,
                coordinates: data.coordinates ?? "",
                role: data.role ?? "",
            };
            setOffer(transformedOffer);
        };
        if (id !== null) {
            manageHandleFetchOfferWithUser(id);
        }
    }, [id]); //fetches offer and user permission

    useEffect(() => {
        if (id === null || offer.permission || !isAuthenticated) return;
        handleFollowAndCheck(id, false);
    }, [offerFetched]);

    const handleFollow = async (id: number | null, follow: boolean) => {
        if (disabled) return;
        if (id === null || offer.permission || !isAuthenticated) {
            navigate("/authenticate/login");
            return;
        }
        setDisabled(true);
        await handleFollowAndCheck(id, follow);
        setTimeout(() => setDisabled(false), 500);
    };

    //adminOnly
    const handleDeleteOffer = async (id: number | null) => {
        if (disabled) return;
        setDisabled(true);
        try {
            await adminDeleteOffer(id);
            navigate("/search?page=0&size=10");
        } catch(error: unknown) {
            setDecision(false);
            if (error instanceof NotFoundError) {
                console.error("Offer with id = " + offer.id +  " not found: ", error);
            } else if (error instanceof MethodNotAllowedError) {
                console.error("User does not have permission: ", error);
            } else {
                console.error("Unexpected error occurred during admin offer deletion: ", error);
            }
        } finally {
            setDisabled(false);
        }
    };

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className="flex flex-col lg:flex-row justify-center w-11/12 max-w-[1300px] gap-3 m:gap-4">
                    <div className="flex flex-col w-full items-center lg:w-[70%] border border-gray-300 bg-lowLime rounded relative">
                        <ImageDisplay photos={offer.photos} offerFetched={offerFetched}/>
                        {offerFetched &&
                            <OfferDetails brand={offer.brand} model={offer.model} bodyType={offer.bodyType} year={offer.year} mileage={offer.mileage}
                                          fuel={offer.fuel} capacity={offer.capacity} power={offer.power} drive={offer.drive} transmission={offer.transmission}
                                          color={offer.color} condition={offer.condition} seats={offer.seats} doors={offer.doors} steeringWheel={offer.steeringWheel}
                                          country={offer.country} vin={offer.vin} plate={offer.plate} firstRegistration={offer.firstRegistration} description={offer.description}/>
                        }
                        {offerFetched && !offer.permission &&
                            <button className="absolute right-2.5 top-1.5 m:right-3 m:top-2"
                                    {...bindHoverHandlers()} onClick={() => handleFollow(id, true)}>
                                <FontAwesomeIcon icon={faHeart} className={`text-3xl m:text-4xl ${followed ? "text-coolRed" : "text-gray-600"}
                                                                ${buttonColor && "brightness-[115%]"}`}/>
                            </button>}
                        {offer.role === "ADMIN" &&
                            <button className="absolute left-2.5 top-1.5 m:left-3 m:top-2"
                                    onClick={() => setDecision(true)}>
                                <FontAwesomeIcon icon={faTrash} className="text-xl m:text-2xl"/>
                            </button>
                        }
                        {offer.role === "USER" && !offer.permission && !hasReported &&
                            <button className="absolute left-2.5 top-1.5 m:left-3 m:top-2"
                                    onClick={() => setReport(true)}>
                                <FontAwesomeIcon icon={faFlag} className="text-xl m:text-2xl"/>
                            </button>
                        }
                    </div>
                    <div className="flex flex-col items-center w-full lg:w-[30%] border border-gray-300 bg-lowLime rounded">
                    {offerFetched ?
                            <>
                                <BaseInfo title={offer.title} price={offer.price} currency={offer.currency} createdOn={offer.createdOn}/>
                                <UserInformation username={offer.username} profilePic={offer.profilePic} name={offer.name} phone={offer.phone}
                                                 city={offer.city} coordinates={offer.coordinates} permission={offer.permission} id={offer.id}/>
                            </> : <OfferSmallLoader/>
                        }
                    </div>
                </div>
                {decision && (<ConfirmDeleteWindow decision={decision} setDecision={setDecision}
                                                   onClick={() => handleDeleteOffer(offer.id)}/>)}
                {report && <ReportOffer id={offer.id} report={report} setReport={setReport} setReported={setReported} setHasReported={setHasReported}/>}
                {reported && <AnimatedBanner text={"Offer reported"} onAnimationEnd={() => setReported(false)}
                                                    delay={3000} color={"bg-gray-300"} z={"z-10"}/>}
            </div>
        </LayOut>
    );
}

export default OfferDisplay