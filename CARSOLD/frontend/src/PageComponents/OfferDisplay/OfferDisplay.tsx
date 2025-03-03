import React, {useEffect, useState} from "react";
import LayOut from "../../LayOut/LayOut.tsx";
import {useParams} from "react-router-dom";
import {useOfferUtil} from "../../CustomHooks/useOfferUtil.ts";

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
        price: string;
        currency: string;
        name: string;
        phone: string;
        city: string;
        permission: boolean;
    }
    const {section} = useParams();
    const [id, setId] = useState<number | null>(null);
    const {handleFetchOfferWithContact, loading} = useOfferUtil();
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
        price: "",
        currency: "",
        name: "",
        phone: "",
        city: "",
        permission: false,
    });
    const [contact, setContact] = useState({
        name: "",
        phone: "",
        city: "",
    })

    useEffect(() => {
        if (section) {
            const numericId = Number(section.replace(/,/g, ''));
            if (!isNaN(numericId)) setId(numericId);
        }
    }, [section]);  //gets id from section

    const formatNumber = (value: string) => {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    useEffect(() => {
        const manageFetchFetchOfferWithContact = async (id: number) => {
          const data = await handleFetchOfferWithContact(id);
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
                photos: ((data.photos)?.split(",")) ?? "",
                price: formatNumber(String(data.price ?? "")),
                currency: data.currency ?? "",
                name: data.name ?? "",
                phone: data.phone ?? "",
                city: data.city ?? "",
                permission: data.permission ?? false,
            };
            setOffer(transformedOffer);
        };
        if (id !== null) {
            manageFetchFetchOfferWithContact(id);
        }
    }, [id]); //fetches offer and user permission

    useEffect(() => {
        if (!!offer?.name && !!offer?.phone && !!offer.city) {
            setContact( prev => ({...prev,
                name: offer.name,
                phone: offer.phone,
                city: offer.city
            }));
        }
    }, [offer]);

    return (
        <LayOut>
            <div className="flex flex-col items-center">
                <div className="flex flex-col sm:flex-row justify-center w-11/12 max-w-[1300px] gap-3 m:gap-4">
                    <div className="flex flex-col w-full sm:w-2/3 border border-blue-500">
                        {offer.name}
                        {offer.permission ? "true" : "false"}
                    </div>
                    <div className="flex flex-col w-full sm:w-1/3 border border-red-400">
                        {Object.entries(contact).map(([key, value]) => (
                            <div key={key}>
                                <p className="text-base m:text-lg">{key === "name" ? "Name:" : key === "phone" ? "Phone:" : "City:"}</p>
                                <p className="flex items-center pl-1 w-44 m:w-48 h-9 m:h-10 text-lg m:text-xl border border-gray-400
                            text-gray-700 bg-gray-50 rounded overflow-hidden truncate cursor-not-allowed">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </LayOut>
    );
}

export default OfferDisplay