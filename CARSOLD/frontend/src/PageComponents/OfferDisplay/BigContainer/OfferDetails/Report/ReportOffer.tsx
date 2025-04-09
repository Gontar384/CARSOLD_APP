import React, {useEffect, useRef, useState} from "react";
import {reportOffer} from "../../../../../ApiCalls/Services/OfferService.ts";

interface ReportOfferProps {
    id: number | null;
    report: boolean;
    setReport: React.Dispatch<React.SetStateAction<boolean>>;
    setReported: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface SelectedReason {
    offerId: number | null;
    reason: string | null;
}

const ReportOffer: React.FC<ReportOfferProps> = ({ id, report, setReport, setReported }) => {
    const componentRef = useRef<HTMLDivElement | null>(null);
    const reportReasons = [
        "Inappropriate content",
        "False or misleading information",
        "Spam or repetitive content",
        "Scam or fraud",
        "Impersonation",
        "Prohibited item or service",
        "Hate speech or harassment",
        "Violates copyright or trademark",
        "Other",
    ];
    const [selectedReason, setSelectedReason] = useState<SelectedReason>({
        offerId: id,
        reason: "",
    });
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (selectedReason.reason === "" || disabled) return;
        setDisabled(true);
        try {
            await reportOffer(selectedReason);
        } catch (error) {
            console.error("Error when reporting offer: ", error);
        } finally {
            setDisabled(false);
            setReported(true);
            setReport(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (report && componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setReport(false);
            }
        }
        if (report) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        }
    }, [report])   //offs report window when clicked outside

    return (
        <div className="flex justify-center items-center fixed inset-0 w-full h-full bg-black bg-opacity-40 z-50">
            <div className="flex flex-col items-center w-[95%] h-[95%] max-w-[800px] bg-lowLime rounded overflow-hidden"
                 ref={componentRef}>
                <h2 className="text-2xl m:text-3xl font-semibold my-12 m:my-14">Report Offer</h2>
                <div className="space-y-6 m:space-y-8">
                    {reportReasons.map((reportReason, index) => (
                        <label key={index} className="flex items-center space-x-2 m:space-x-3 cursor-pointer">
                            <input type="radio" className="w-3 h-3 m:w-4 m:h-4"
                                   value={reportReason} checked={selectedReason.reason === reportReason}
                                   onChange={() => setSelectedReason(prev => ({...prev, reason: reportReason}) )}/>
                            <span className="text-lg m:text-xl">{reportReason}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end mt-14 m:mt-16 space-x-10 text-lg m:text-xl">
                    <button className={`px-4 py-2 bg-red-600 text-white rounded disabled:opacity-60
                            ${selectedReason !== null && "hover:ring-2 ring-black"}`}
                            onClick={handleSubmit} disabled={!selectedReason}>
                        Submit Report
                    </button>
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:ring-2 ring-black"
                            onClick={() => setReport(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
};

export default ReportOffer