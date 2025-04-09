import React, {useEffect, useState} from "react";
import {useUserInfo} from "../../../../CustomHooks/useUserInfo.ts";
import {Link, useNavigate} from "react-router-dom";
import {adminDeleteReport, adminFetchReports} from "../../../../ApiCalls/Services/OfferService.ts";
import {faCar, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface Report {
    id: number | null;
    offerId: number | null;
    reason: string | null;
    reportUsername: string | null;
}

const Admin: React.FC = () => {
    const [admin, setAdmin] = useState<boolean>(false);
    const {handleCheckAdmin} = useUserInfo();
    const navigate = useNavigate();
    const [reports, setReports] = useState<Report[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const itemsPerPage = 5;
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedReports = reports.slice(startIndex, endIndex);
    const [deleted, setDeleted] = useState<boolean>(false);

    const nextPage = () => {
        if (endIndex < reports.length) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    useEffect(() => {
        const manageCheckAdmin = async () => {
            const isAdmin = await handleCheckAdmin();
            if (!isAdmin) navigate("/details/myOffers");
            else setAdmin(isAdmin);
        };
        manageCheckAdmin();
    }, []);

    useEffect(() => {
        const manageFetchReports = async () => {
            const reports = await adminFetchReports();
            setReports(reports.data);
        }
        if (admin) manageFetchReports();
    }, [admin, deleted]);

    const handleDeleteReport = async (id: number | null) => {
        try {
            await adminDeleteReport(id);
            setDeleted(prev => !prev);
        } catch (error) {
            console.error("Error when deleting report: ", error);
        }
    };

    return (
        <div className="w-[90%] m:w-[95%] h-full max-w-[700px] mt-10 m:mt-12">
            {reports.length > 0 ? (
            paginatedReports.map((report, key) => (
                <div key={key} className="flex flex-col mb-6 m:mb-8">
                    <div className="flex flex-row items-center justify-between gap-1.5 m:gap-2 p-3 m:p-4 bg-white rounded-md">
                        <p className="text-base m:text-lg">{report.reason}</p>
                        <div className="flex flex-row gap-1.5 m:gap-2">
                            <Link className="flex flex-row items-center gap-0.5 m:gap-1"
                                  to={`/displayOffer/${report.offerId}`}>
                                <FontAwesomeIcon icon={faCar} className="text-xl m:text-2xl"/>
                                <p className="text-base m:text-lg">Check</p>
                            </Link>
                            <div className="h-6 m:h-7 border border-black"></div>
                            <button className="flex flex-row items-center gap-0.5 m:gap-1"
                                    onClick={() => handleDeleteReport(report.id)}>
                                <FontAwesomeIcon icon={faXmark} className="text-xl m:text-2xl"/>
                                <p className="text-base m:text-lg">Delete</p>
                            </button>
                        </div>
                    </div>
                    <p className="text-xs m:text-sm ml-3 m:ml-4">reported by {report.reportUsername}</p>
                </div>
            ))) : <p className="text-xl m:text-2xl text-center mt-32 m:mt-36">No reports to display!</p> }
            {reports.length > itemsPerPage &&
                <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base py-3 m:py-6">
                    <button onClick={prevPage} disabled={currentPage === 0}
                            className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white
                            rounded-md disabled:opacity-60">
                        Previous
                    </button>
                    <button onClick={nextPage} disabled={endIndex >= reports.length}
                            className="w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white
                            rounded-md disabled:opacity-60">
                        Next
                    </button>
                </div>
            }
        </div>
    )
};

export default Admin