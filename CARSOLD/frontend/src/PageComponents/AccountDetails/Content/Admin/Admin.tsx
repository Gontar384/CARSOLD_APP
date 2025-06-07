import React, {useEffect, useState} from "react";
import {useUserInfo} from "../../../../CustomHooks/useUserInfo.ts";
import {Link, useNavigate} from "react-router-dom";
import {adminDeleteReport, adminFetchReports} from "../../../../ApiCalls/Services/OfferService.ts";
import {faCar, faXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {usePagination} from "../../../../CustomHooks/usePagination.ts";
import {useLanguage} from "../../../../GlobalProviders/Language/useLanguage.ts";
import AnimatedBanner from "../../../../Additional/Banners/AnimatedBanner.tsx";
import {useUtil} from "../../../../GlobalProviders/Util/useUtil.ts";
import ReportLoader from "../../../../Additional/Loading/ReportLoader.tsx";

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
    const [offerDeleted, setOfferDeleted] = useState<boolean>(false);
    const [userDeleted, setUserDeleted] = useState<boolean>(false);
    const [checkOfferButton, setCheckOfferButton] = useState<number | null>(null);
    const [deleteReportButton, setDeleteReportButton] = useState<number | null>(null);
    const {isMobile} = useUtil();
    const [fetchTrigger, setFetchTrigger] = useState<boolean>(false);

    useEffect(() => {
        document.title = "CARSOLD | Admin";
    }, [t]);

    useEffect(() => {
        const manageCheckAdmin = async () => {
            const isAdmin = await handleCheckAdmin();
            if (!isAdmin) navigate("/details/myOffers");
            else setAdmin(isAdmin);
        };
        manageCheckAdmin();
    }, []); //initial check for admin

    const manageFetchReports = async () => {
        setFetched(false);
        try {
            const reports = await adminFetchReports(currentPage, itemsPerPage);
            setReports(reports.data._embedded?.reportDtoList ?? []);
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

    useEffect(() => {
        setFetchTrigger(true);
    }, [admin, deleted, currentPage]); //triggers fetch

    useEffect(() => {
        if (fetchTrigger) {
            if (admin) manageFetchReports()
            setFetchTrigger(false);
        }
    }, [fetchTrigger]); //fetches reports

    const handleDeleteReport = async (id: number | null) => {
        try {
            await adminDeleteReport(id);
            setDeleted(prev => !prev);
        } catch (error) {
            console.error("Error when deleting report: ", error);
        }
    };

    useEffect(() => {
        if (sessionStorage.getItem("offerDeletedByAdmin") === "true") {
            setOfferDeleted(true);
            sessionStorage.removeItem("offerDeletedByAdmin");
        }
        if (sessionStorage.getItem("userDeletedByAdmin") === "true") {
            setUserDeleted(true);
            sessionStorage.removeItem("userDeletedByAdmin");
        }
    }, []); //detects if offer or user was deleted by admin

    if (!fetched) return Array.from({length: 6}).map((_, index) => (<ReportLoader key={index}/>))

    return (
        <div className="w-[90%] m:w-[95%] h-full max-w-[700px] mt-10 m:mt-12">
            <h1 className="hidden">Reports</h1>
            {reports.length > 0 ? (
                <ul className="list-none">
                    {reports.map((report, key) => (
                        <li key={key} className="flex flex-col mb-6 m:mb-8">
                            <div className="flex flex-row items-center justify-between gap-1.5 m:gap-2 p-3 m:p-4 bg-white rounded-md">
                                <p className="text-base m:text-lg truncate">{translate("reportReasons", report.reason ?? "")}</p>
                                <div className="flex flex-row gap-1.5 m:gap-2">
                                    <Link className={`flex flex-row items-center gap-0.5 m:gap-1 ${checkOfferButton === report.id && "underline"}`}
                                        onMouseEnter={!isMobile ? () => setCheckOfferButton(report.id) : undefined}
                                        onMouseLeave={!isMobile ? () => setCheckOfferButton(null) : undefined}
                                        onTouchStart={isMobile ? () => setCheckOfferButton(report.id) : undefined}
                                        onTouchEnd={isMobile ? () => setCheckOfferButton(null) : undefined}
                                        to={`/displayOffer/${report.offerId}`}>
                                        <FontAwesomeIcon icon={faCar} className="text-xl m:text-2xl"/>
                                        <p className="text-base m:text-lg">{t("admin1")}</p>
                                    </Link>
                                    <div className="h-6 m:h-7 border border-black"></div>
                                    <button
                                        className={`flex flex-row items-center gap-0.5 m:gap-1 ${deleteReportButton === report.id && "underline"}`}
                                        onMouseEnter={!isMobile ? () => setDeleteReportButton(report.id) : undefined}
                                        onMouseLeave={!isMobile ? () => setDeleteReportButton(null) : undefined}
                                        onTouchStart={isMobile ? () => setDeleteReportButton(report.id) : undefined}
                                        onTouchEnd={isMobile ? () => setDeleteReportButton(null) : undefined}
                                        onClick={() => handleDeleteReport(report.id)}>
                                        <FontAwesomeIcon icon={faXmark} className="text-xl m:text-2xl"/>
                                        <p className="text-base m:text-lg">{t("admin2")}</p>
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs m:text-sm ml-3 m:ml-4">{t("admin3")} {report.reportUsername}</p>
                        </li>
                    ))}
                </ul>
            ) : <p className="text-xl m:text-2xl text-center mt-32 m:mt-36">{t("admin4")}</p>}
            {reports.length > 0 && (hasPrevPage || hasNextPage) && (
                <div className="flex justify-center my-8 m:my-10 gap-4 m:gap-5 text-sm m:text-base">
                    {hasPrevPage && (
                        <button className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-800 text-white rounded-md 
                        ${hovered[0] && "ring ring-white"}`}
                                {...bindHoverButtons(0)} onClick={prevPage}>
                            {currentPage}
                        </button>
                    )}
                    <button
                        className={`w-[72px] m:w-20 h-[38px] m:h-10 bg-gray-600 text-white rounded-md cursor-default`}>
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
            {(offerDeleted || userDeleted) &&
                <AnimatedBanner text={`${offerDeleted ? t("animatedBanner19") : t("animatedBanner20")}`}
                                onAnimationEnd={offerDeleted ? () => setOfferDeleted(false) : () => setUserDeleted(false)}
                                delay={3000} color="bg-gray-200" z="z-10"/>}
        </div>
    )
};

export default Admin