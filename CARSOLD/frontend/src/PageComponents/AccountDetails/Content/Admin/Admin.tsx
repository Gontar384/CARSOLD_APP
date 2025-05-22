import React, {useEffect, useState} from "react";
import {useUserInfo} from "../../../../CustomHooks/useUserInfo.ts";
import {Link, useNavigate} from "react-router-dom";
import {adminDeleteReport, adminFetchReports} from "../../../../ApiCalls/Services/OfferService.ts";
import {faCar, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePagination} from "../../../../CustomHooks/usePagination.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";

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
    const [deleted, setDeleted] = useState<boolean>(false);
    const [fetched, setFetched] = useState<boolean>(false);
    const itemsPerPage = 6;
    const {currentPage, setCurrentPage, setTotalPages, hasPrevPage, hasNextPage, prevPage, nextPage, hovered, bindHoverButtons} = usePagination();
    const {t, translate} = useLanguage();
    document.title = "CARSOLD | Admin";

    useEffect(() => {
        const manageCheckAdmin = async () => {
            const isAdmin = await handleCheckAdmin();
            if (!isAdmin) navigate("/details/myOffers");
            else setAdmin(isAdmin);
        };
        manageCheckAdmin();
    }, []); //initial check for admin

    useEffect(() => {
        const manageFetchReports = async () => {
            setFetched(false);
            try {
                const reports = await adminFetchReports(currentPage, itemsPerPage);
                setReports(reports.data._embedded.reportDtoList);
                setTotalPages(reports.data.page.totalPages);
            } catch (error) {
                console.error("Unexpected error while fetching reports: ", error);
                setReports([]);
                setTotalPages(0);
                setCurrentPage(0);
            } finally {
                setFetched(true);
            }
        }
        if (admin) manageFetchReports();
    }, [admin, deleted, currentPage]); //fetches reports

    const handleDeleteReport = async (id: number | null) => {
        try {
            await adminDeleteReport(id);
            setDeleted(prev => !prev);
        } catch (error) {
            console.error("Error when deleting report: ", error);
        }
    };

    if (!fetched) return null;

    return (
        <div className="w-[90%] m:w-[95%] h-full max-w-[700px] mt-10 m:mt-12">
            {reports.length > 0 ? (
                reports.map((report, key) => (
                <div key={key} className="flex flex-col mb-6 m:mb-8">
                    <div className="flex flex-row items-center justify-between gap-1.5 m:gap-2 p-3 m:p-4 bg-white rounded-md">
                        <p className="text-base m:text-lg truncate">{translate("reportReasons", report.reason ?? "")}</p>
                        <div className="flex flex-row gap-1.5 m:gap-2">
                            <Link className="flex flex-row items-center gap-0.5 m:gap-1"
                                  to={`/displayOffer/${report.offerId}`}>
                                <FontAwesomeIcon icon={faCar} className="text-xl m:text-2xl"/>
                                <p className="text-base m:text-lg">{t("admin1")}</p>
                            </Link>
                            <div className="h-6 m:h-7 border border-black"></div>
                            <button className="flex flex-row items-center gap-0.5 m:gap-1"
                                    onClick={() => handleDeleteReport(report.id)}>
                                <FontAwesomeIcon icon={faXmark} className="text-xl m:text-2xl"/>
                                <p className="text-base m:text-lg">{t("admin2")}</p>
                            </button>
                        </div>
                    </div>
                    <p className="text-xs m:text-sm ml-3 m:ml-4">{t("admin3")} {report.reportUsername}</p>
                </div>
            ))) : <p className="text-xl m:text-2xl text-center mt-32 m:mt-36">{t("admin4")}</p> }
            {reports.length > 0 && (hasPrevPage || hasNextPage) && (
                <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                    {hasPrevPage && (
                        <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md 
                        ${hovered[0] && "ring ring-white"}`}
                                {...bindHoverButtons(0)} onClick={prevPage}>
                            {currentPage}
                        </button>
                    )}
                    <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white rounded-md cursor-default`}>
                        {currentPage + 1}
                    </button>
                    {hasNextPage && (
                        <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md 
                        ${hovered[1] && "ring ring-white"}`}
                                {...bindHoverButtons(1)} onClick={nextPage}>
                            {currentPage + 2}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
};

export default Admin